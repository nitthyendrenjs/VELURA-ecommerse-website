# Velura: Multi-Category Store + Admin Portal + Delhivery Shipping

This turns Velura from a static fashion demo into a real multi-category commerce platform with a Shopify-style admin and live Delhivery logistics. It's large, so it ships in four phases — each phase leaves the site working.

## Phase 0 — Backend foundation

Velura currently has no backend: products live in a hardcoded file and cart/wishlist live in browser storage only. Everything below needs a real database, so the first step is enabling Lovable Cloud (database, auth, file storage, server-side code — no external accounts).

Tables: products, variants, categories, inventory, customers, addresses, orders, order_items, shipments, shipment_events, discounts, warehouses, notifications_log, admin roles. Roles are stored in a separate table with a security-definer role check (never on the profile row).

Admin access: email/password + Google sign-in, with an `admin` role required for `/admin/*`. The route gate is UX; every admin server call re-checks the role server-side.

## Phase 1 — Storefront cleanup

- Remove the left filter sidebar from Shop entirely; full-width product grid with search + sort on top.
- Generalize the catalog beyond garments: categories become database-driven, product attributes become flexible (size/color are just optional variant options, not required).
- Product, cart, wishlist, and checkout read from the database instead of the hardcoded file.
- Checkout collects a real pincode and calls Delhivery for serviceability, COD availability, delivery ETA, and shipping cost before payment.

## Phase 2 — Admin portal (`/admin`)

Shopify-like layout: left nav, top bar, data tables with bulk selection.

- **Dashboard** — revenue, orders, AOV, top products, sales chart, low-stock alerts.
- **Products** — list/create/edit, variants, images, pricing, categories, stock levels, bulk edit.
- **Orders** — list with filters and saved segments, order detail, timeline, status changes, refunds/cancellations.
- **Customers** — profiles, order history, contact details.
- **Discounts** — codes, percentage/fixed, usage limits, expiry (replaces the hardcoded VELURA10).
- **Fulfillment** — pick/pack queue with barcode-scanner input (scan AWB or order number to advance status; works with any USB/Bluetooth HID scanner).
- **Exports** — CSV/XLSX export of any table, with column selection and segmented exports (e.g. orders by date range, status, or channel) as separate files.
- **Documents** — bulk invoice generation from a branded template, packing slips, and shipping labels; batch-print to a single merged PDF.
- **Settings** — store details, warehouses, shipping defaults, notification templates.

## Phase 3 — Delhivery integration (staging first)

All Delhivery calls run server-side with your token kept secret; nothing is exposed to the browser. Staging endpoints first, one switch to production later.

Storefront-facing:
- Pincode serviceability + payment-mode (COD/prepaid) check
- Expected TAT / delivery date estimate
- Shipping cost calculation from weight, dimensions and destination

Admin/fulfillment:
- Fetch waybill (AWB allocation), shipment creation, update, cancellation
- Shipping label PDF generation
- Pickup request creation
- Warehouse creation and updates, synced with the Warehouses settings page
- E-waybill update
- Manifest and document download

Tracking and exceptions:
- Live tracking view on the order detail page and a public customer tracking page
- Webhook receiver so status changes land instantly, writing to the shipment timeline
- NDR handling: failed-delivery queue in admin with re-attempt instructions, new slot, alternate number
- RVP QC 3.0 reverse pickups with QC rules for returns

Notifications: on each tracking milestone, automatic email (built-in email — needs a sender domain you own), SMS, and WhatsApp, each containing tracking data plus a link to the customer tracking portal. SMS/WhatsApp needs a provider account (Twilio or similar) — I'll ask for those credentials when we reach that step.

## Technical notes

- Delhivery calls go through server functions (`createServerFn`) with the token in `process.env`; the webhook is a public server route with signature/secret verification.
- Staging token stored as a secret (`DELHIVERY_API_TOKEN`, staging base URL configurable) — I'll request it when Phase 3 starts.
- PDFs (invoices, packing slips, labels) generated server-side; labels prefer Delhivery's returned label PDF where available.
- Exports built with a server-side XLSX/CSV writer, streamed as a download.
- Barcode scanning uses keyboard-wedge input (no extra hardware SDK) with an optional camera scanner fallback.
- Admin tables paginate server-side to stay fast as the catalog grows.

## Order of work

1. Cloud + schema + admin auth + seed current 16 products into the DB
2. Shop sidebar removal + storefront on live data
3. Admin portal core (dashboard, products, orders, customers, discounts)
4. Delhivery staging integration, tracking, webhooks, notifications
5. Exports, invoices, packing slips, labels, barcode fulfillment, NDR/RVP
