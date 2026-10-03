-- Autores de las investigaciones.

create table public.authors (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 200),
  affiliation text,
  bio_es text,
  bio_en text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger authors_updated_at
  before update on public.authors
  for each row execute function public.set_updated_at();

alter table public.investigations
  add column author_id uuid references public.authors (id) on delete restrict;

create index investigations_author_idx on public.investigations (author_id);

alter table public.authors enable row level security;

create policy "Lectura pública de autores con investigaciones publicadas"
  on public.authors for select to anon, authenticated
  using (
    public.is_admin()
    or exists (
      select 1 from public.investigations i
      where i.author_id = authors.id and i.published
    )
  );

create policy "Admins gestionan autores"
  on public.authors for all to authenticated
  using (public.is_admin()) with check (public.is_admin());