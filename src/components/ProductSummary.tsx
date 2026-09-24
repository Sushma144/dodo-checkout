type ProductSummaryProps = {
  name?: string;
  plan?: string;
  price?: number;
  currency?: string;
};

export function ProductSummary({
  name = "Developer Pro",
  plan = "Pro Plan · Monthly",
  price = 49,
  currency = "$",
}: ProductSummaryProps) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-950">
            {name}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {plan}
          </p>
        </div>

        <p className="text-lg font-bold text-slate-950">
          {currency}
          {price}
        </p>
      </div>
    </div>
  );
}