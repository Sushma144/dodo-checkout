import { useState } from "react";
import {
  AlertCircle,
  Check,
  LockKeyhole,
  Loader2,
} from "lucide-react";

import { processPayment } from "../utils/payment";

type PaymentFormProps = {
  onSuccess?: (sessionId: string) => void;
  onError?: (code: string, message: string) => void;
};

type PaymentState =
  | "idle"
  | "processing"
  | "error";

export function PaymentForm({
  onSuccess,
  onError,
}: PaymentFormProps) {
  const [email, setEmail] =
    useState("");

  const [cardNumber, setCardNumber] =
    useState("");

  const [expiry, setExpiry] =
    useState("");

  const [cvc, setCvc] =
    useState("");

  const [paymentState, setPaymentState] =
    useState<PaymentState>("idle");

  const [errorMessage, setErrorMessage] =
    useState("");

  const formatCardNumber = (
    value: string,
  ) => {
    const digits = value
      .replace(/\D/g, "")
      .slice(0, 16);

    return digits
      .replace(/(.{4})/g, "$1 ")
      .trim();
  };

  const formatExpiry = (
    value: string,
  ) => {
    const digits = value
      .replace(/\D/g, "")
      .slice(0, 4);

    if (digits.length > 2) {
      return `${digits.slice(
        0,
        2,
      )}/${digits.slice(2)}`;
    }

    return digits;
  };

  const clearError = () => {
    if (paymentState === "error") {
      setPaymentState("idle");
      setErrorMessage("");
    }
  };

  const handlePayment = async () => {
    if (
      paymentState ===
      "processing"
    ) {
      return;
    }

    setErrorMessage("");

    // Email validation
    if (!email.trim()) {
      setPaymentState("error");
      setErrorMessage(
        "Please enter your email address.",
      );
      return;
    }

    if (!email.includes("@")) {
      setPaymentState("error");
      setErrorMessage(
        "Please enter a valid email address.",
      );
      return;
    }

    // Card validation
    const normalizedCard =
      cardNumber.replace(/\s/g, "");

    if (
      normalizedCard.length !== 16
    ) {
      setPaymentState("error");
      setErrorMessage(
        "Please enter a valid 16-digit card number.",
      );
      return;
    }

    // Expiry validation
    if (expiry.length !== 5) {
      setPaymentState("error");
      setErrorMessage(
        "Please enter your card expiry date.",
      );
      return;
    }

    // CVC validation
    if (cvc.length < 3) {
      setPaymentState("error");
      setErrorMessage(
        "Please enter your CVC.",
      );
      return;
    }

    setPaymentState("processing");

    const result =
      await processPayment(
        cardNumber,
      );

    if (
      result.status === "success"
    ) {
      onSuccess?.(
        result.sessionId,
      );

      return;
    }

    setPaymentState("error");

    setErrorMessage(
      result.message,
    );

    onError?.(
      result.code,
      result.message,
    );
  };

  return (
    <div>
      {/* Email */}

      <div>
        <label
          htmlFor="checkout-email"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Email address
        </label>

        <input
          id="checkout-email"
          type="email"
          value={email}
          onChange={(event) => {
            setEmail(
              event.target.value,
            );
            clearError();
          }}
          placeholder="you@example.com"
          autoComplete="email"
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10"
        />
      </div>

      {/* Card */}

      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <label
            htmlFor="checkout-card"
            className="text-sm font-medium text-slate-700"
          >
            Card details
          </label>

          <div className="flex items-center gap-1 text-xs text-slate-400">
            <LockKeyhole className="h-3.5 w-3.5" />
            Secure
          </div>
        </div>

        <input
          id="checkout-card"
          type="text"
          inputMode="numeric"
          value={cardNumber}
          onChange={(event) => {
            setCardNumber(
              formatCardNumber(
                event.target.value,
              ),
            );
            clearError();
          }}
          placeholder="4242 4242 4242 4242"
          autoComplete="cc-number"
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm tracking-wide text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10"
        />

        <div className="mt-3 grid grid-cols-2 gap-3">
          <input
            type="text"
            inputMode="numeric"
            value={expiry}
            onChange={(event) =>
              setExpiry(
                formatExpiry(
                  event.target.value,
                ),
              )
            }
            placeholder="MM/YY"
            autoComplete="cc-exp"
            aria-label="Card expiry"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10"
          />

          <input
            type="password"
            inputMode="numeric"
            value={cvc}
            onChange={(event) =>
              setCvc(
                event.target.value
                  .replace(/\D/g, "")
                  .slice(0, 4),
              )
            }
            placeholder="CVC"
            autoComplete="cc-csc"
            aria-label="Card security code"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10"
          />
        </div>
      </div>

      {/* Error */}

      {paymentState ===
        "error" && (
        <div
          role="alert"
          className="mt-5 flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

          <div>
            <p className="text-sm font-semibold text-red-900">
              Payment couldn't be completed
            </p>

            <p className="mt-1 text-sm leading-5 text-red-700">
              {errorMessage}
            </p>
          </div>
        </div>
      )}

      {/* Pay */}

      <button
        type="button"
        onClick={handlePayment}
        disabled={
          paymentState ===
          "processing"
        }
        className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {paymentState ===
        "processing" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Processing payment...
          </>
        ) : (
          <>
            <Check className="h-4 w-4" />
            Pay $49
          </>
        )}
      </button>

      <p className="mt-4 text-center text-xs leading-5 text-slate-400">
        Your card details are handled inside the secure checkout.
      </p>
    </div>
  );
}