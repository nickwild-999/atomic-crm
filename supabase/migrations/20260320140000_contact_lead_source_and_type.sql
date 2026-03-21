ALTER TABLE public.contacts ADD COLUMN IF NOT EXISTS lead_source text;
ALTER TABLE public.contacts ADD COLUMN IF NOT EXISTS contact_type text;

DROP VIEW IF EXISTS public.contacts_summary;
CREATE VIEW public.contacts_summary WITH (security_invoker = on) AS
SELECT
    co.id,
    co.first_name,
    co.last_name,
    co.gender,
    co.title,
    co.background,
    co.avatar,
    co.first_seen,
    co.last_seen,
    co.has_newsletter,
    co.status,
    co.tags,
    co.company_id,
    co.sales_id,
    co.linkedin_url,
    co.email_jsonb,
    co.phone_jsonb,
    co.lead_source,
    co.contact_type,
    co.social_links_jsonb,
    (jsonb_path_query_array(co.email_jsonb, '$[*]."email"'))::text AS email_fts,
    (jsonb_path_query_array(co.phone_jsonb, '$[*]."number"'))::text AS phone_fts,
    c.name AS company_name,
    count(DISTINCT t.id) FILTER (WHERE t.done_date IS NULL) AS nb_tasks
FROM public.contacts co
    LEFT JOIN public.tasks t ON co.id = t.contact_id
    LEFT JOIN public.companies c ON co.company_id = c.id
GROUP BY co.id, c.name;
