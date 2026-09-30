import Image from "@tiptap/extension-image";
import StarterKit from "@tiptap/starter-kit";

export const INVESTIGATION_IMAGE_PREFIX = "investigations/";

const IMAGE_PATH_PATTERN =
  /^investigations\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|png|webp|avif)$/;

export const StorageImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      path: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-path"),
        renderHTML: (attributes) =>
          attributes.path ? { "data-path": attributes.path } : {},
      },
    };
  },
}).configure({ inline: false, allowBase64: false });

export const contentExtensions = [
  StarterKit.configure({
    heading: { levels: [2, 3] },
    code: false,
    codeBlock: false,
    link: { openOnClick: false, autolink: true, defaultProtocol: "https" },
  }),
  StorageImage,
];

type DocNode = {
  type?: string;
  attrs?: Record<string, unknown>;
  content?: DocNode[];
  [key: string]: unknown;
};

export function storageUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/${path}`;
}

export function isValidImagePath(path: unknown): path is string {
  return typeof path === "string" && IMAGE_PATH_PATTERN.test(path);
}

function mapImages(
  node: DocNode,
  transform: (image: DocNode) => DocNode | null,
): DocNode | null {
  if (node.type === "image") return transform(node);
  if (!Array.isArray(node.content)) return node;
  return {
    ...node,
    content: node.content
      .map((child) => mapImages(child, transform))
      .filter((child): child is DocNode => child !== null),
  };
}

// La base guarda solo la ruta del archivo; la URL se arma al leer para no atar el contenido a un proyecto de Supabase.
export function stripImageUrls<T>(doc: T): T {
  return mapImages(doc as DocNode, (image) => {
    const path = image.attrs?.path;
    if (!isValidImagePath(path)) return null;
    const attrs = { ...image.attrs };
    delete attrs.src;
    return { ...image, attrs };
  }) as T;
}

export function withImageUrls<T>(doc: T): T {
  if (!doc) return doc;
  return mapImages(doc as DocNode, (image) => {
    const path = image.attrs?.path;
    if (!isValidImagePath(path)) return null;
    return { ...image, attrs: { ...image.attrs, src: storageUrl(path) } };
  }) as T;
}

export function collectImagePaths(...docs: unknown[]) {
  const paths = new Set<string>();
  const visit = (node: DocNode) => {
    if (node.type === "image" && isValidImagePath(node.attrs?.path)) {
      paths.add(node.attrs.path);
    }
    node.content?.forEach(visit);
  };
  for (const doc of docs) {
    if (doc && typeof doc === "object") visit(doc as DocNode);
  }
  return paths;
}

export function hasContent(doc: unknown): boolean {
  if (!doc || typeof doc !== "object") return false;
  const node = doc as DocNode;
  if (node.type === "image") return true;
  if (
    node.type === "text" &&
    typeof node.text === "string" &&
    node.text.trim() !== ""
  )
    return true;
  return Array.isArray(node.content) && node.content.some(hasContent);
}
