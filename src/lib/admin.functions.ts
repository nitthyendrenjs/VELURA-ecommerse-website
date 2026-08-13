import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertStaff(context: { supabase: any; userId: string }) {
  const { data, error } = await context.supabase.rpc("is_staff", {
    _user_id: context.userId,
  });
  if (error || !data) throw new Error("Forbidden: staff access required");
  return true;
}

export const getMyRoles = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    const roles = (data ?? []).map((r: { role: string }) => r.role);
    return { roles, isStaff: roles.includes("admin") || roles.includes("staff") };
  });

export const getAdminDashboard = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context);
    const supabase = context.supabase;
    const [{ data: orders }, { data: products }, { data: customers }] = await Promise.all([
      supabase
        .from("orders")
        .select("id,order_number,customer_name,total,status,payment_status,created_at")
        .order("created_at", { ascending: false })
        .limit(200),
      supabase.from("products").select("id,name,stock,low_stock_threshold,price,status"),
      supabase.from("profiles").select("id", { count: "exact", head: false }),
    ]);
    const all = orders ?? [];
    const revenue = all.reduce((s: number, o: any) => s + Number(o.total ?? 0), 0);
    const lowStock = (products ?? []).filter(
      (p: any) => Number(p.stock) <= Number(p.low_stock_threshold),
    );
    const byDay = new Map<string, number>();
    for (const o of all) {
      const d = String(o.created_at).slice(0, 10);
      byDay.set(d, (byDay.get(d) ?? 0) + Number(o.total ?? 0));
    }
    const series = [...byDay.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-14)
      .map(([date, total]) => ({ date, total }));
    return {
      revenue,
      orderCount: all.length,
      aov: all.length ? revenue / all.length : 0,
      productCount: (products ?? []).length,
      customerCount: (customers ?? []).length,
      pending: all.filter((o: any) => o.status === "pending").length,
      recentOrders: all.slice(0, 8),
      lowStock: lowStock.slice(0, 8),
      series,
    };
  });

export const adminListProducts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ search: z.string().optional() }).parse(input ?? {}),
  )
  .handler(async ({ context, data }) => {
    await assertStaff(context);
    let q = context.supabase
      .from("products")
      .select("id,name,slug,sku,price,stock,status,images,category_id,is_featured")
      .order("created_at", { ascending: false })
      .limit(200);
    if (data.search) q = q.ilike("name", `%${data.search}%`);
    const [{ data: products }, { data: categories }] = await Promise.all([
      q,
      context.supabase.from("categories").select("id,name").order("name"),
    ]);
    return { products: products ?? [], categories: categories ?? [] };
  });

const productInput = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(200),
  sku: z.string().max(80).nullable().optional(),
  description: z.string().max(5000).nullable().optional(),
  category_id: z.string().uuid().nullable().optional(),
  brand: z.string().max(120).nullable().optional(),
  price: z.number().min(0),
  compare_at_price: z.number().min(0).nullable().optional(),
  stock: z.number().int().min(0),
  low_stock_threshold: z.number().int().min(0).default(5),
  weight_grams: z.number().int().min(1).default(500),
  images: z.array(z.string().max(1000)).max(10).default([]),
  status: z.enum(["active", "draft", "archived"]).default("active"),
  is_featured: z.boolean().default(false),
  is_new: z.boolean().default(false),
});

export const adminGetProduct = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ context, data }) => {
    await assertStaff(context);
    const [{ data: product }, { data: categories }] = await Promise.all([
      context.supabase.from("products").select("*").eq("id", data.id).maybeSingle(),
      context.supabase.from("categories").select("id,name").order("name"),
    ]);
    return { product, categories: categories ?? [] };
  });

export const adminGetCategories = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context);
    const { data } = await context.supabase.from("categories").select("id,name").order("name");
    return data ?? [];
  });

export const adminSaveProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => productInput.parse(input))
  .handler(async ({ context, data }) => {
    await assertStaff(context);
    const { id, ...values } = data;
    if (id) {
      const { error } = await context.supabase.from("products").update(values).eq("id", id);
      if (error) throw new Error(error.message);
      return { id };
    }
    const { data: row, error } = await context.supabase
      .from("products")
      .insert(values)
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: row.id as string };
  });

export const adminDeleteProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ context, data }) => {
    await assertStaff(context);
    const { error } = await context.supabase.from("products").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminListOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ status: z.string().optional(), search: z.string().optional() }).parse(input ?? {}),
  )
  .handler(async ({ context, data }) => {
    await assertStaff(context);
    let q = context.supabase
      .from("orders")
      .select(
        "id,order_number,customer_name,email,phone,total,status,payment_status,payment_mode,fulfillment_status,created_at",
      )
      .order("created_at", { ascending: false })
      .limit(200);
    if (data.status && data.status !== "all") q = q.eq("status", data.status);
    if (data.search) q = q.ilike("order_number", `%${data.search}%`);
    const { data: orders } = await q;
    return orders ?? [];
  });

export const adminGetOrder = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ context, data }) => {
    await assertStaff(context);
    const [{ data: order }, { data: items }, { data: shipments }] = await Promise.all([
      context.supabase.from("orders").select("*").eq("id", data.id).maybeSingle(),
      context.supabase.from("order_items").select("*").eq("order_id", data.id),
      context.supabase
        .from("shipments")
        .select("id,awb,carrier,status,status_detail,created_at")
        .eq("order_id", data.id),
    ]);
    return { order, items: items ?? [], shipments: shipments ?? [] };
  });

export const adminUpdateOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        status: z.enum(["pending", "confirmed", "shipped", "delivered", "cancelled"]).optional(),
        payment_status: z.enum(["pending", "paid", "refunded", "failed"]).optional(),
        fulfillment_status: z.enum(["unfulfilled", "partial", "fulfilled"]).optional(),
        notes: z.string().max(2000).optional(),
      })
      .parse(input),
  )
  .handler(async ({ context, data }) => {
    await assertStaff(context);
    const { id, ...values } = data;
    const { error } = await context.supabase.from("orders").update(values).eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminListCustomers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context);
    const [{ data: profiles }, { data: orders }] = await Promise.all([
      context.supabase
        .from("profiles")
        .select("id,email,full_name,phone,created_at")
        .order("created_at", { ascending: false })
        .limit(200),
      context.supabase.from("orders").select("user_id,total"),
    ]);
    const totals = new Map<string, { count: number; spend: number }>();
    for (const o of orders ?? []) {
      if (!o.user_id) continue;
      const cur = totals.get(o.user_id) ?? { count: 0, spend: 0 };
      cur.count += 1;
      cur.spend += Number(o.total ?? 0);
      totals.set(o.user_id, cur);
    }
    return (profiles ?? []).map((p: any) => ({
      ...p,
      orders: totals.get(p.id)?.count ?? 0,
      spend: totals.get(p.id)?.spend ?? 0,
    }));
  });

export const adminListDiscounts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context);
    const { data } = await context.supabase
      .from("discounts")
      .select("*")
      .order("created_at", { ascending: false });
    return data ?? [];
  });

export const adminSaveDiscount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        id: z.string().uuid().optional(),
        code: z.string().min(2).max(40),
        type: z.enum(["percent", "fixed"]),
        value: z.number().min(0),
        min_order_value: z.number().min(0).default(0),
        usage_limit: z.number().int().min(1).nullable().optional(),
        expires_at: z.string().nullable().optional(),
        is_active: z.boolean().default(true),
      })
      .parse(input),
  )
  .handler(async ({ context, data }) => {
    await assertStaff(context);
    const { id, ...values } = data;
    const payload = { ...values, code: values.code.toUpperCase() };
    if (id) {
      const { error } = await context.supabase.from("discounts").update(payload).eq("id", id);
      if (error) throw new Error(error.message);
      return { ok: true };
    }
    const { error } = await context.supabase.from("discounts").insert(payload);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminDeleteDiscount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ context, data }) => {
    await assertStaff(context);
    const { error } = await context.supabase.from("discounts").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
