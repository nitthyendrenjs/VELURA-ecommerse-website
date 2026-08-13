import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getMyAccount = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const [{ data: profile }, { data: orders }] = await Promise.all([
      context.supabase
        .from("profiles")
        .select("id,email,full_name,phone")
        .eq("id", context.userId)
        .maybeSingle(),
      context.supabase
        .from("orders")
        .select("id,order_number,total,status,payment_status,created_at")
        .eq("user_id", context.userId)
        .order("created_at", { ascending: false })
        .limit(50),
    ]);
    return { profile, orders: orders ?? [] };
  });

export const updateMyProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        full_name: z.string().min(1).max(120),
        phone: z.string().max(20).nullable().optional(),
      })
      .parse(input),
  )
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase
      .from("profiles")
      .update({ full_name: data.full_name, phone: data.phone ?? null })
      .eq("id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
