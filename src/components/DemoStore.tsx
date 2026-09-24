import { useState } from "react";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  CreditCard,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import DodoCheckout from "../sdk/dodo-checkout";
import { CallbackLog } from "./CallbackLog";

export function DemoStore() {
  const [events, setEvents] = useState<string[]>([]);

  const addEvent = (message: string) => {
    setEvents((current) => [
      ...current,
      `${new Date().toLocaleTimeString()} — ${message}`,
    ]);
  };

  const handleBuy = () => {
    addEvent("Checkout opened");

    DodoCheckout.open({
      productId: "prod_123",

      onSuccess: ({ sessionId }) => {
        addEvent(`Payment successful — ${sessionId}`);
      },

      onClose: ({ reason }) => {
        addEvent(`Checkout closed — ${reason}`);
      },

      onError: ({ code, message }) => {
        addEvent(`${code} — ${message}`);
      },
    });
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-950">
      {/* =========================================
          HEADER
      ========================================== */}

   <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
  <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-6 lg:px-8">
    {/* Logo */}

    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-sm font-bold text-white shadow-sm">
        D
      </div>

      <div>
        <p className="text-[15px] font-semibold tracking-tight text-slate-950">
          Demo Store
        </p>

        <p className="text-xs text-slate-400">
          Merchant checkout demo
        </p>
      </div>
    </div>

    {/* Powered by */}

    <div className="hidden items-center gap-2 text-sm text-slate-500 sm:flex">
      <span>Powered by</span>

      <span className="font-semibold text-slate-900">
        Dodo Checkout
      </span>
    </div>
  </div>
</header>
      {/* =========================================
          HERO
      ========================================== */}

      <section className="relative overflow-hidden border-b border-slate-200/80 bg-white">
        {/* Background decoration */}

        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-slate-100 blur-3xl" />
          <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-slate-50 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_430px] lg:gap-20">
            {/* =================================
                LEFT CONTENT
            ================================= */}

            <div className="max-w-2xl">
              {/* Badge */}

              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-sm font-medium text-emerald-700">
                <CheckCircle2 className="h-4 w-4" />

                Secure checkout
              </div>

              {/* Heading */}

              <h1 className="text-4xl font-bold leading-[1.08] tracking-[-0.03em] text-slate-950 sm:text-5xl lg:text-[56px]">
                Everything you need to build better products.
              </h1>

              {/* Description */}

              <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
                A simple merchant experience powered by an embeddable
                Dodo Payments checkout. Customers can complete their
                payment without leaving the page.
              </p>

              {/* Feature list */}

              <div className="mt-9 grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                    <ShieldCheck className="h-4 w-4 text-slate-700" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Secure payment
                    </p>

                    <p className="mt-0.5 text-xs leading-5 text-slate-500">
                      Protected checkout experience
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                    <CreditCard className="h-4 w-4 text-slate-700" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Card payments
                    </p>

                    <p className="mt-0.5 text-xs leading-5 text-slate-500">
                      Fast and reliable payment flow
                    </p>
                  </div>
                </div>
              </div>

              {/* Small technical note */}

              <div className="mt-10 flex items-center gap-2 text-xs text-slate-400">
                <LockKeyhole className="h-3.5 w-3.5" />

                <span>Checkout runs securely inside an iframe.</span>
              </div>
            </div>

            {/* =================================
                PRODUCT CARD
            ================================= */}

            <div className="relative">
              {/* Card glow */}

              <div className="absolute -inset-4 rounded-[32px] bg-slate-200/40 blur-2xl" />

              <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.18)] sm:p-6">
                {/* Product visual */}

                <div className="relative flex h-48 items-center justify-center overflow-hidden rounded-2xl bg-slate-950">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.12),transparent_35%)]" />

                  <div className="relative text-center">
                    <Sparkles className="mx-auto mb-3 h-5 w-5 text-slate-400" />

                    <p className="text-5xl font-bold tracking-tight text-white">
                      PRO
                    </p>

                    <p className="mt-2 text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                      Developer plan
                    </p>
                  </div>
                </div>

                {/* Product information */}

                <div className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        Developer Pro
                      </p>

                      <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
                        Pro Plan
                      </h2>
                    </div>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                      Monthly
                    </span>
                  </div>

                  {/* Price */}

                  <div className="mt-6 flex items-baseline gap-2">
                    <span className="text-4xl font-bold tracking-tight text-slate-950">
                      $49
                    </span>

                    <span className="text-sm text-slate-500">
                      / month
                    </span>
                  </div>

                  {/* Benefits */}

                  <div className="mt-6 space-y-3 border-t border-slate-100 pt-5">
                    <div className="flex items-center gap-2.5 text-sm text-slate-600">
                      <Check className="h-4 w-4 text-emerald-600" />
                      Full developer access
                    </div>

                    <div className="flex items-center gap-2.5 text-sm text-slate-600">
                      <Check className="h-4 w-4 text-emerald-600" />
                      Secure payment processing
                    </div>

                    <div className="flex items-center gap-2.5 text-sm text-slate-600">
                      <Check className="h-4 w-4 text-emerald-600" />
                      Cancel anytime
                    </div>
                  </div>

                  {/* Buy button */}

                  <button
                    type="button"
                    onClick={handleBuy}
                    className="group mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2"
                  >
                    Buy now

                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </button>

                  <p className="mt-4 text-center text-xs leading-5 text-slate-400">
                    You'll complete your payment securely without
                    leaving this page.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          CHECKOUT CALLBACK LOG
      ========================================== */}

      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <CallbackLog events={events} />
      </section>
    </main>
  );
}