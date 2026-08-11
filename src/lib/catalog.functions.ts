import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const PRODUCT_COLUMNS =
  "id,name,slug,sku,description,brand,category_id,price,compare_at_price,stock,low_stock_threshold,weight_grams,images,options,tags,status,is_featured,is_new,rating,review_count,created_at";

export const listCategories = createServerFn({ method: "GET" }).handler(async () => {
  const { getPublicClient } = await import("./supabase-public.server");
  const { data } = await getPublicClient()
    .from("categories")
    .select("id,name,slug,description,image_url,sort_order,is_active")
    .eq("is_active", true)
    .order("sort_order");
  return data ?? [];
});

export const listProducts = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) =>
    z
      .object({
        search: z.string().optional(),
        category: z.string().optional(),
        sort: z.enum(["newest", "low", "high", "popular"]).default("newest"),
        limit: z.number().int().min(1).max(60).default(24),
      })
      .parse(input ?? {}),
  )
  .handler(async ({ data }) => {
    const { getPublicClient } = await import("./supabase-public.server");
    let query = getPublicClient()
      .from("products")
      .select(`${PRODUCT_COLUMNS},categories(name,slug)`)
      .eq("status", "active")
      .limit(data.limit);

    if (data.search) query = query.ilike("name", `%${data.search}%`);
    if (data.category && data.category !== "all") {
      const { data: cat } = await getPublicClient()
        .from("categories")
        .select("id")
        .eq("slug", data.category)
        .maybeSingle();
      if (cat) query = query.eq("category_id", cat.id);
    }

    if (data.sort === "low") query = query.order("price", { ascending: true });
    else if (data.sort === "high") query = query.order("price", { ascending: false });
    else if (data.sort === "popular") query = query.order("review_count", { ascending: false });
    else query = query.order("created_at", { ascending: false });

    const { data: rows } = await query;
    return ((rows ?? []) as unknown[]).map((r) => {
      const { categories, ...rest } = r as Record<string, unknown> & {
        categories?: { name: string } | null;
      };
      return { ...rest, category_name: categories?.name ?? null } as ProductWithCategory;
    });
  });

export const getProductBySlug = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ slug: z.string().min(1) }).parse(input))
  .handler(async ({ data }) => {
    const { getPublicClient } = await import("./supabase-public.server");
    const client = getPublicClient();
    const { data: row } = await client
      .from("products")
      .select(`${PRODUCT_COLUMNS},categories(name,slug)`)
      .eq("slug", data.slug)
      .eq("status", "active")
      .maybeSingle();
    if (!row) return null;
    const { categories, ...rest } = row as unknown as Record<string, unknown> & {
      categories?: { name: string } | null;
      category_id?: string | null;
    };
    let related: Product[] = [];
    if (rest.category_id) {
      const { data: rel } = await client
        .from("products")
        .select(PRODUCT_COLUMNS)
        .eq("status", "active")
        .eq("category_id", rest.category_id)
        .neq("slug", data.slug)
        .limit(4);
      related = (rel ?? []) as unknown as Product[];
    }
    const product = {
      ...rest,
      category_name: categories?.name ?? null,
    } as unknown as ProductWithCategory;
    return { product, related };
  });


export const getHomeData = createServerFn({ method: "GET" }).handler(async () => {
  const { getPublicClient } = await import("./supabase-public.server");
  const client = getPublicClient();
  const [featured, fresh, cats] = await Promise.all([
    client
      .from("products")
      .select(PRODUCT_COLUMNS)
      .eq("status", "active")
      .eq("is_featured", true)
      .limit(8),
    client
      .from("products")
      .select(PRODUCT_COLUMNS)
      .eq("status", "active")
      .eq("is_new", true)
      .order("created_at", { ascending: false })
      .limit(8),
    client
      .from("categories")
      .select("id,name,slug,image_url,sort_order,is_active,description")
      .eq("is_active", true)
      .order("sort_order")
      .limit(6),
  ]);
  return {
    featured: featured.data ?? [],
    fresh: fresh.data ?? [],
    categories: cats.data ?? [],
  };
});

export const getProductsByIds = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) =>
    z.object({ ids: z.array(z.string().uuid()).max(100) }).parse(input),
  )
  .handler(async ({ data }) => {
    if (data.ids.length === 0) return [];
    const { getPublicClient } = await import("./supabase-public.server");
    const { data: rows } = await getPublicClient()
      .from("products")
      .select(PRODUCT_COLUMNS)
      .in("id", data.ids)
      .eq("status", "active");
    return rows ?? [];
  });
