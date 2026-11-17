CREATE TABLE public.subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(150) NOT NULL CHECK (char_length(btrim(name)) > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (id, user_id)
);

CREATE TABLE public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL,
  title VARCHAR(200) NOT NULL CHECK (char_length(btrim(title)) > 0),
  description VARCHAR(300),
  file_key TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (lower(file_type) IN ('pdf', 'txt', 'md')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT resources_subject_owner_fkey
    FOREIGN KEY (subject_id, user_id)
    REFERENCES public.subjects (id, user_id)
    ON DELETE CASCADE
);

CREATE INDEX subjects_user_id_idx ON public.subjects (user_id);
CREATE INDEX resources_user_id_idx ON public.resources (user_id);
CREATE INDEX resources_subject_id_idx ON public.resources (subject_id);

CREATE OR REPLACE FUNCTION public.prevent_subject_owner_change()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.user_id IS DISTINCT FROM OLD.user_id THEN
    RAISE EXCEPTION 'user_id cannot be changed';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER subjects_prevent_owner_change
BEFORE UPDATE ON public.subjects
FOR EACH ROW
EXECUTE FUNCTION public.prevent_subject_owner_change();

CREATE OR REPLACE FUNCTION public.prevent_resource_owner_change()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.user_id IS DISTINCT FROM OLD.user_id THEN
    RAISE EXCEPTION 'user_id cannot be changed';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER resources_prevent_owner_change
BEFORE UPDATE ON public.resources
FOR EACH ROW
EXECUTE FUNCTION public.prevent_resource_owner_change();

ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users can read their subjects"
ON public.subjects
FOR SELECT TO authenticated
USING (user_id = (SELECT auth.uid()));

CREATE POLICY "users can create their subjects"
ON public.subjects
FOR INSERT TO authenticated
WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "users can update their subjects"
ON public.subjects
FOR UPDATE TO authenticated
USING (user_id = (SELECT auth.uid()))
WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "users can delete their subjects"
ON public.subjects
FOR DELETE TO authenticated
USING (user_id = (SELECT auth.uid()));

CREATE POLICY "users can read their resources"
ON public.resources
FOR SELECT TO authenticated
USING (user_id = (SELECT auth.uid()));

CREATE POLICY "users can create their resources"
ON public.resources
FOR INSERT TO authenticated
WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "users can update their resources"
ON public.resources
FOR UPDATE TO authenticated
USING (user_id = (SELECT auth.uid()))
WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "users can delete their resources"
ON public.resources
FOR DELETE TO authenticated
USING (user_id = (SELECT auth.uid()));

GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, DELETE ON public.subjects TO authenticated;
GRANT UPDATE (name) ON public.subjects TO authenticated;
GRANT SELECT, INSERT, DELETE ON public.resources TO authenticated;
GRANT UPDATE (subject_id, title, description, file_key, file_name, file_type)
ON public.resources TO authenticated;