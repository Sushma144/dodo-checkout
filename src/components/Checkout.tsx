import { useEffect, useState } from "react";
import { CheckCircle2, X } from "lucide-react";

import { ProductSummary } from "./ProductSummary";
import { PaymentForm } from "./PaymentForm";

type CheckoutProps = {
  onClose: () => void;

  onSuccess?: (
    sessionId: string,
  ) => void;

  onError?: (
    code: string,
    message: string,
  ) => void;
};

export function Checkout({
  onClose,
  onSuccess,
  onError,
}: CheckoutProps) {
  const [paymentState, setPaymentState] = useState<
    "idle" | "success"
  >("idle");

  const [sessionId, setSessionId] = useState("");

  // ----------------------------------
  // Escape key
  // ----------------------------------

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  // ----------------------------------
  // Payment success
  // ----------------------------------

  const handlePaymentSuccess = (newSessionId: string) => {
    setSessionId(newSessionId);
    setPaymentState("success");

    onSuccess?.(newSessionId);
  };

  // ----------------------------------
  // Payment error
  // ----------------------------------

  const handlePaymentError = (
    code: string,
    message: string,
  ) => {
    onError?.(code, message);
  };

  // ----------------------------------
  // Success screen
  // ----------------------------------

  if (paymentState === "success") {
    return (
      <div
        className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="success-title"
      >
        <div className="relative w-full max-w-md rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">
          {/* Header */}

          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950 text-xs font-bold text-white">
                D
              </div>

              <span className="text-sm font-semibold text-slate-950">
                Dodo Checkout
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close checkout"
              className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-950"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Success */}

          <div className="flex min-h-[500px] flex-col items-center justify-center px-6 py-10 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="h-9 w-9 text-emerald-600" />
            </div>

            <h2
              id="success-title"
              className="mt-6 text-2xl font-bold text-slate-950"
            >
              Payment successful
            </h2>

            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
              Your payment has been completed successfully.
            </p>

            <div className="mt-6 w-full rounded-xl bg-slate-50 p-4 text-left">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Session ID
              </p>

              <p className="mt-2 break-all font-mono text-xs text-slate-700">
                {sessionId}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="mt-7 w-full rounded-xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------
  // Checkout screen
  // ----------------------------------

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-title"
    >
      <div
        className="relative max-h-[95vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        {/* Header */}

        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-5">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950 text-xs font-bold text-white">
                D
              </div>

              <span className="text-sm font-semibold text-slate-950">
                Dodo Checkout
              </span>
            </div>

            <p className="mt-2 text-xs text-slate-500">
              Secure payment
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close checkout"
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-950"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Checkout content */}

        <div className="px-6 py-6">
          {/* Product */}

          <ProductSummary
            name="Developer Pro"
            plan="Pro Plan · Monthly"
            price={49}
            currency="$"
          />

          {/* Customer */}

          <div className="mt-7">
            <h2
              id="checkout-title"
              className="text-xl font-bold text-slate-950"
            >
              Complete your purchase
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Enter your details to continue.
            </p>
          </div>

          {/* Payment form */}

          <PaymentForm
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />

          {/* Security message */}

          <p className="mt-4 text-center text-xs leading-5 text-slate-400">
            Your card details are handled inside the secure checkout.
          </p>
        </div>
      </div>
    </div>
  );
}