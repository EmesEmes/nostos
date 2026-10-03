-- NOSTOS · esquema inicial. Ejecutar una sola vez en SQL Editor.

create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Investigaciones -----------------------------------------------------------

create table public.investigations (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title_es text not null,
  title_en text not null default '',
  summary_es text not null default '',
  summary_en text not null default '',
  content_es jsonb,
  content_en jsonb,
  cover_path text,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index investigations_published_idx
  on public.investigations (published, published_at desc);

create trigger investigations_updated_at
  before update on public.investigations
  for each row execute function public.set_updated_at();

-- Lugares de estudio ---------------------------------------------------------

create table public.study_sites (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  kind text not null check (kind in ('canton', 'parroquia')),
  name text not null,
  province text not null,
  province_id text not null,
  map_x numeric(6, 3),
  map_y numeric(6, 3),
  zone_id text,
  annual_rate numeric(5, 2),
  population_now integer,
  population_2050 integer,
  change_pct numeric(5, 1),
  altitude text,
  distance_es text,
  distance_en text,
  tagline_es text,
  tagline_en text,
  summary_es text not null default '',
  summary_en text not null default '',
  content_es jsonb,
  content_en jsonb,
  cover_path text,
  audio_path text,
  audio_title_es text,
  audio_title_en text,
  sort_order integer not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index study_sites_published_idx
  on public.study_sites (published, sort_order);

create trigger study_sites_updated_at
  before update on public.study_sites
  for each row execute function public.set_updated_at();

create table public.site_images (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.study_sites (id) on delete cascade,
  path text not null,
  alt_es text not null default '',
  alt_en text not null default '',
  caption_es text,
  caption_en text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index site_images_site_idx on public.site_images (site_id, sort_order);

create table public.testimonies (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.study_sites (id) on delete cascade,
  person_name text not null,
  person_detail_es text,
  person_detail_en text,
  quote_es text not null,
  quote_en text not null default '',
  photo_path text,
  audio_path text,
  sort_order integer not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index testimonies_site_idx on public.testimonies (site_id, sort_order);

create trigger testimonies_updated_at
  before update on public.testimonies
  for each row execute function public.set_updated_at();

-- Formularios y contador -----------------------------------------------------

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  reason text,
  message text not null,
  created_at timestamptz not null default now()
);

create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

create table public.site_visits (
  id integer primary key default 1 check (id = 1),
  count bigint not null default 0
);

insert into public.site_visits (id, count) values (1, 0);

create or replace function public.increment_visits()
returns bigint
language sql
security definer
set search_path = ''
as $$
  update public.site_visits set count = count + 1 where id = 1 returning count;
$$;

revoke execute on function public.increment_visits() from public, anon, authenticated;

-- Seguridad (RLS) ------------------------------------------------------------

alter table public.investigations enable row level security;
alter table public.study_sites enable row level security;
alter table public.site_images enable row level security;
alter table public.testimonies enable row level security;
alter table public.contact_messages enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.site_visits enable row level security;

create policy "Lectura pública de investigaciones publicadas"
  on public.investigations for select to anon, authenticated
  using (published or public.is_admin());

create policy "Admins gestionan investigaciones"
  on public.investigations for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "Lectura pública de lugares publicados"
  on public.study_sites for select to anon, authenticated
  using (published or public.is_admin());

create policy "Admins gestionan lugares"
  on public.study_sites for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "Lectura pública de imágenes de lugares publicados"
  on public.site_images for select to anon, authenticated
  using (
    public.is_admin()
    or exists (
      select 1 from public.study_sites s
      where s.id = site_id and s.published
    )
  );

create policy "Admins gestionan imágenes"
  on public.site_images for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "Lectura pública de testimonios publicados"
  on public.testimonies for select to anon, authenticated
  using (
    public.is_admin()
    or (
      published
      and exists (
        select 1 from public.study_sites s
        where s.id = site_id and s.published
      )
    )
  );

create policy "Admins gestionan testimonios"
  on public.testimonies for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "Admins leen mensajes de contacto"
  on public.contact_messages for select to authenticated
  using (public.is_admin());

create policy "Admins leen suscriptores"
  on public.newsletter_subscribers for select to authenticated
  using (public.is_admin());

create policy "Lectura pública del contador"
  on public.site_visits for select to anon, authenticated
  using (true);

-- Storage --------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  true,
  52428800,
  array[
    'image/jpeg', 'image/png', 'image/webp', 'image/avif',
    'audio/mpeg', 'audio/mp4', 'audio/x-m4a', 'audio/aac',
    'audio/ogg', 'audio/wav'
  ]
)
on conflict (id) do nothing;

create policy "Admins suben archivos"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and public.is_admin());

create policy "Admins actualizan archivos"
  on storage.objects for update to authenticated
  using (bucket_id = 'media' and public.is_admin())
  with check (bucket_id = 'media' and public.is_admin());

create policy "Admins borran archivos"
  on storage.objects for delete to authenticated
  using (bucket_id = 'media' and public.is_admin());