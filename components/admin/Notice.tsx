export function Notice({ children }: { children: React.ReactNode }) {
  return (
    <p
      role="status"
      className="mt-8 rounded-sm border border-hairline bg-paper px-4 py-3 font-sans text-sm text-ink"
    >
      {children}
    </p>
  );
}
