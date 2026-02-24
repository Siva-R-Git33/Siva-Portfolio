-- Run this in your Supabase SQL Editor to set up the database schema!

-- Create Projects Table
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  tech_stack TEXT[] DEFAULT '{}',
  github_link TEXT,
  live_link TEXT,
  image TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create Blogs Table
CREATE TABLE blogs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  excerpt TEXT,
  cover_image TEXT,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create Skills Table
CREATE TABLE skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- e.g., 'Programming', 'OS', 'Tools', 'Security'
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create Contact Messages Table
CREATE TABLE contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Set up Row Level Security (RLS) policies
-- We want anyone to be able to READ projects, blogs, and skills.
-- We want anyone to be able to INSERT contact messages.
-- But only authenticated users (Admin) can insert/update/delete.

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Auth can manage projects" ON projects USING (auth.role() = 'authenticated');

ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view published blogs" ON blogs FOR SELECT USING (published = true);
CREATE POLICY "Auth can manage blogs" ON blogs USING (auth.role() = 'authenticated');

ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view skills" ON skills FOR SELECT USING (true);
CREATE POLICY "Auth can manage skills" ON skills USING (auth.role() = 'authenticated');

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can insert contact messages" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth can manage contact messages" ON contact_messages USING (auth.role() = 'authenticated');

-- Create Certifications Table
CREATE TABLE certifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  issuer TEXT NOT NULL,
  color TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view certifications" ON certifications FOR SELECT USING (true);
CREATE POLICY "Auth can manage certifications" ON certifications USING (auth.role() = 'authenticated');

-- Create Settings Table (for global toggles)
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view settings" ON settings FOR SELECT USING (true);
CREATE POLICY "Auth can manage settings" ON settings USING (auth.role() = 'authenticated');

-- Insert Initial Seed Data
INSERT INTO skills (name, category, icon) VALUES
('Python', 'Programming', 'SiPython'),
('Bash', 'Programming', 'SiGnubash'),
('JavaScript', 'Programming', 'SiJavascript'),
('C++', 'Programming', 'SiCplusplus'),
('Linux (Kali/Parrot)', 'OS', 'SiKali'),
('Windows Server', 'OS', 'SiWindows'),
('Burp Suite', 'Tools', 'SiKalilinux'),
('Nmap', 'Tools', 'SiKalilinux'),
('Wireshark', 'Tools', 'SiWireshark'),
('Metasploit', 'Tools', 'SiKalilinux'),
('Vulnerability Assessment', 'Security', 'SiShield'),
('Network Security', 'Security', 'SiSecurity');

INSERT INTO projects (title, description, tech_stack, github_link, featured) VALUES
('Signature Verification using Siamese Networks', 'A deep learning project implementing a Siamese Neural Network to verify the authenticity of signatures. Built to prevent forgery in financial and legal documents.', ARRAY['Python', 'TensorFlow', 'Keras', 'OpenCV', 'Jupyter'], 'https://github.com/Siva-R-Git33/Signature-Verification', true);

INSERT INTO blogs (title, slug, content, tags, excerpt) VALUES
('Getting Started with TryHackMe', 'getting-started-thm', 'TryHackMe is a great platform for beginners. In this post, I will walk you through setting up your VPN connection and solving your first room...', ARRAY['CTF', 'Writeup'], 'A quick guide to starting your cybersecurity journey with TryHackMe.');

-- Insert Admin Auth User (Login: shivar6277@gmail.com / Password: SHIVA@#54354s)
-- NOTE: In Supabase, it is highly recommended to do this via the UI (Authentication -> Users)
-- But if you run this, it will manually bypass the API and create an active user:
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'shivar6277@gmail.com',
  crypt('SHIVA@#54354s', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  now(),
  now()
);

-- --------------------------------------------------------
-- STORAGE BUCKET POLICIES (Required for Uploads)
-- --------------------------------------------------------

-- 1. Create the uploads bucket if it doesn't exist and make it public
INSERT INTO storage.buckets (id, name, public)
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Allow public to view any file in the uploads bucket
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'uploads' );

-- 3. Allow authenticated Admin to upload ANY file to the uploads bucket
CREATE POLICY "Auth Uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'uploads' );

-- 4. Allow authenticated Admin to update ANY file 
CREATE POLICY "Auth Updates"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'uploads' );

-- 5. Allow authenticated Admin to delete ANY file
CREATE POLICY "Auth Deletes"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'uploads' );
