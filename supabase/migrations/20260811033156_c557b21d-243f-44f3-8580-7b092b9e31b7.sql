REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.next_order_number() FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.touch_updated_at() FROM anon, authenticated, public;

DROP POLICY "products public read" ON public.products;
CREATE POLICY "products anon read" ON public.products FOR SELECT TO anon USING (status = 'active');
CREATE POLICY "products auth read" ON public.products FOR SELECT TO authenticated USING (status = 'active' OR public.is_staff(auth.uid()));

DROP POLICY "categories public read" ON public.categories;
CREATE POLICY "categories anon read" ON public.categories FOR SELECT TO anon USING (is_active);
CREATE POLICY "categories auth read" ON public.categories FOR SELECT TO authenticated USING (is_active OR public.is_staff(auth.uid()));

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.is_staff(uuid) FROM anon, public;