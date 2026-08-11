import { Star } from "lucide-react";

export function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  const full = Math.floor(rating);
  return (
    <div className="flex items-center gap-0.5">
      {[0, 1, 2, 3, 4].map((i) => (
        <Star
          key={i}
          size={size}
          className={
            i < full
              ? "fill-[var(--color-gold)] text-[var(--color-gold)]"
              : "text-muted-foreground/40"
          }
        />
      ))}
    </div>
  );
}

export { formatPrice } from "@/lib/format";
