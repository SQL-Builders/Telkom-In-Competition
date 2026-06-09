-- ============================================================
-- Telkom-In-Competition: Database Schema
-- Last Updated: 2026-06-07
-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.
-- ============================================================

CREATE TABLE public.user_pengguna (
  id_user integer NOT NULL DEFAULT nextval('user_pengguna_id_user_seq'::regclass),
  name character varying NOT NULL,
  email character varying NOT NULL UNIQUE,
  password character varying NOT NULL,
  role character varying DEFAULT 'user'::character varying CHECK (role::text = ANY (ARRAY['user'::character varying, 'admin'::character varying]::text[])),
  nama_lengkap character varying,
  no_telepon character varying,
  tgl_daftar timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  status character varying DEFAULT 'active'::character varying CHECK (status::text = ANY (ARRAY['active'::character varying, 'banned'::character varying]::text[])),
  CONSTRAINT user_pengguna_pkey PRIMARY KEY (id_user)
);

CREATE TABLE public.data_berkas (
  id_data_berkas integer NOT NULL DEFAULT nextval('data_berkas_id_data_berkas_seq'::regclass),
  id_user integer,
  nama_berkas text,
  file_path text,
  tipe_berkas character varying,
  ukuran_berkas bigint,
  uploaded timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT data_berkas_pkey PRIMARY KEY (id_data_berkas),
  CONSTRAINT data_berkas_id_user_fkey FOREIGN KEY (id_user) REFERENCES public.user_pengguna(id_user)
);

CREATE TABLE public.kategori_lomba (
  id_kategori integer NOT NULL DEFAULT nextval('kategori_lomba_id_kategori_seq'::regclass),
  nama_kategori character varying,
  deskripsi text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT kategori_lomba_pkey PRIMARY KEY (id_kategori)
);

CREATE TABLE public.data_lomba (
  id_lomba integer NOT NULL DEFAULT nextval('data_lomba_id_lomba_seq'::regclass),
  id_kategori integer,
  nama_lomba character varying,
  deskripsi text,
  hadiah character varying,
  penyelenggara character varying,
  biaya numeric DEFAULT 0 CHECK (biaya >= 0::numeric),
  tgl_mulai date,
  tgl_selesai date,
  deadline timestamp without time zone,
  status character varying DEFAULT 'active'::character varying CHECK (status::text = ANY (ARRAY['active'::text, 'inactive'::text, 'upcoming'::text, 'completed'::text, 'draft'::text])),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  level character varying DEFAULT 'University'::character varying,
  location character varying,
  whatsapp_group character varying,
  featured boolean DEFAULT false,
  recommended boolean DEFAULT false,
  requirements jsonb DEFAULT '[]'::jsonb,
  timeline jsonb DEFAULT '[]'::jsonb,
  proposal_fields jsonb DEFAULT '[]'::jsonb,
  CONSTRAINT data_lomba_pkey PRIMARY KEY (id_lomba),
  CONSTRAINT data_lomba_id_kategori_fkey FOREIGN KEY (id_kategori) REFERENCES public.kategori_lomba(id_kategori)
);

CREATE TABLE public.gambar_poster (
  id_gambar_poster integer NOT NULL DEFAULT nextval('gambar_poster_id_gambar_poster_seq'::regclass),
  id_lomba integer,
  image_path text,
  uploaded timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT gambar_poster_pkey PRIMARY KEY (id_gambar_poster),
  CONSTRAINT gambar_poster_id_lomba_fkey FOREIGN KEY (id_lomba) REFERENCES public.data_lomba(id_lomba)
);

CREATE TABLE public.data_pendaftaran_lomba (
  id_pendaftaran integer NOT NULL DEFAULT nextval('data_pendaftaran_lomba_id_pendaftaran_seq'::regclass),
  id_user integer,
  id_lomba integer,
  id_berkas integer,
  tgl_daftar timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  status_pendaftaran character varying DEFAULT 'pending'::character varying CHECK (status_pendaftaran::text = ANY (ARRAY['pending'::character varying, 'accepted'::character varying, 'rejected'::character varying, 'under_review'::character varying]::text[])),
  nomor_pendaftaran character varying,
  stage character varying DEFAULT 'University'::character varying,
  form_data jsonb DEFAULT '{}'::jsonb,
  CONSTRAINT data_pendaftaran_lomba_pkey PRIMARY KEY (id_pendaftaran),
  CONSTRAINT data_pendaftaran_lomba_id_user_fkey FOREIGN KEY (id_user) REFERENCES public.user_pengguna(id_user),
  CONSTRAINT data_pendaftaran_lomba_id_lomba_fkey FOREIGN KEY (id_lomba) REFERENCES public.data_lomba(id_lomba),
  CONSTRAINT data_pendaftaran_lomba_id_berkas_fkey FOREIGN KEY (id_berkas) REFERENCES public.data_berkas(id_data_berkas)
);

CREATE TABLE public.lomba_favorit (
  id_lomba_favorit integer NOT NULL DEFAULT nextval('lomba_favorit_id_lomba_favorit_seq'::regclass),
  id_user integer,
  id_lomba integer,
  favorit integer DEFAULT 1 CHECK (favorit = ANY (ARRAY[0, 1])),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT lomba_favorit_pkey PRIMARY KEY (id_lomba_favorit),
  CONSTRAINT lomba_favorit_id_user_fkey FOREIGN KEY (id_user) REFERENCES public.user_pengguna(id_user),
  CONSTRAINT lomba_favorit_id_lomba_fkey FOREIGN KEY (id_lomba) REFERENCES public.data_lomba(id_lomba)
);
