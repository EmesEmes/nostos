-- NOSTOS · datos iniciales.
-- Ejecutar en SQL Editor después de schema.sql y de las migraciones.
-- Se puede ejecutar más de una vez: no duplica registros ni pisa lo editado en el panel.

begin;

-- Los 10 cantones con mayor decrecimiento poblacional (INEC, censos 1990–2022).
insert into public.study_sites
  (slug, kind, name, province, province_id, map_x, map_y, annual_rate, zone_id, sort_order, published)
values
  ('pucara', 'canton', 'Pucará', 'Azuay', 'azuay', 6.13, 1.64, -1.67, 'azuay-eloro-morona', 1, true),
  ('paltas', 'canton', 'Paltas', 'Loja', 'loja', 5.96, 0.87, -1.21, 'loja', 2, true),
  ('chaguarpamba', 'canton', 'Chaguarpamba', 'Loja', 'loja', 5.97, 1.03, -1.13, 'loja', 3, true),
  ('gonzanama', 'canton', 'Gonzanamá', 'Loja', 'loja', 6.16, 0.71, -1.07, 'loja', 4, true),
  ('quilanga', 'canton', 'Quilanga', 'Loja', 'loja', 6.19, 0.64, -1.04, 'loja', 5, true),
  ('sozoranga', 'canton', 'Sozoranga', 'Loja', 'loja', 5.83, 0.62, -1.04, 'loja', 6, true),
  ('olmedo', 'canton', 'Olmedo', 'Loja', 'loja', 5.96, 0.98, -0.98, 'loja', 7, true),
  ('alausi', 'canton', 'Alausí', 'Chimborazo', 'chimborazo', 6.69, 2.57, -0.83, 'chimborazo-canar', 8, true),
  ('espindola', 'canton', 'Espíndola', 'Loja', 'loja', 6.16, 0.39, -0.79, 'loja', 9, true),
  ('chunchi', 'canton', 'Chunchi', 'Chimborazo', 'chimborazo', 6.62, 2.5, -0.74, 'chimborazo-canar', 10, true)
on conflict (slug) do nothing;

-- Estudio de caso (pilotaje). Cifras y textos provisionales hasta tener los datos del trabajo de campo.
-- La ubicación en el mapa se marca desde el panel.
insert into public.study_sites
  (slug, kind, name, province, province_id, population_now, population_2050, change_pct, altitude,
   distance_es, distance_en, tagline_es, tagline_en, content_es, content_en,
   audio_title_es, audio_title_en, sort_order, published)
values (
  'chavezpamba',
  'parroquia',
  'Chavezpamba',
  'Pichincha',
  'pichincha',
  730,
  340,
  -34,
  '1.868 m s. n. m.',
  '≈ 70 km al norte de Quito',
  '≈ 70 km north of Quito',
  'Está a dos horas de Quito. Para volver, parece que a mucho más.',
  'It is two hours from Quito. Coming back seems much farther.',
  '{"type": "doc", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "Chavezpamba fue punto de paso entre la sierra y los valles subtropicales. Hoy la carretera sigue ahí, pero cada vez menos gente la toma de regreso."}]}, {"type": "paragraph", "content": [{"type": "text", "text": "El pilotaje registró la vida diaria de la parroquia durante tres meses: sus dos tiendas, la escuela que resiste con aulas multigrado, la misa que se celebra cuando el párroco alcanza a subir."}]}, {"type": "paragraph", "content": [{"type": "text", "text": "Lo que se aprenda aquí —qué preguntar, qué medir, qué escuchar— definirá cómo el estudio se acerca a las diez parroquias de la muestra final."}]}]}'::jsonb,
  '{"type": "doc", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "Chavezpamba was once a waypoint between the highlands and the subtropical valleys. The road is still there, but fewer and fewer people take it back."}]}, {"type": "paragraph", "content": [{"type": "text", "text": "The pilot recorded the parish''s daily life for three months: its two shops, the school holding on with multigrade classrooms, the mass held whenever the priest manages to come up."}]}, {"type": "paragraph", "content": [{"type": "text", "text": "What is learned here — what to ask, what to measure, what to listen for — will define how the study approaches the ten parishes of the final sample."}]}]}'::jsonb,
  'Episodio 1 — Las voces de Chavezpamba',
  'Episode 1 — The voices of Chavezpamba',
  0,
  true
)
on conflict (slug) do nothing;

-- Investigador principal.
insert into public.authors (name, affiliation, bio_es, bio_en)
select 'Alexis Vallejo Mancero', 'NOSTOS',
  'Soy un investigador apasionado por la ruralidad, su conservación y el desarrollo sostenible de los territorios. Durante más de quince años he tenido el privilegio de trabajar junto a comunidades rurales, instituciones públicas y organismos internacionales en el diseño, implementación y evaluación de iniciativas orientadas al fortalecimiento de los territorios.',
  'I am a researcher with a passion for rural life, its conservation and the sustainable development of territories. For more than fifteen years I have had the privilege of working alongside rural communities, public institutions and international organizations in the design, implementation and evaluation of initiatives aimed at strengthening territories.'
where not exists (select 1 from public.authors where name = 'Alexis Vallejo Mancero');

commit;