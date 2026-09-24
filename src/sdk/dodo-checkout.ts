import type {
  CheckoutCloseReason,
  CheckoutErrorCode,
  CheckoutMessage,
  CheckoutOptions,
} from "../types/checkout";

const CHECKOUT_PATH = "/?checkout=1";

const CHECKOUT_TIMEOUT = 15000;

let activeCheckout: {
  iframe: HTMLIFrameElement;
  overlay: HTMLDivElement;
  loading: HTMLDivElement;
  options: CheckoutOptions;
  timeoutId: number;
  origin: string;
} | null = null;

function getCheckoutUrl() {
  return `${window.location.origin}${CHECKOUT_PATH}`;
}

function cleanup() {
  if (!activeCheckout) {
    return;
  }

  window.clearTimeout(
    activeCheckout.timeoutId,
  );

  window.removeEventListener(
    "message",
    handleMessage,
  );

  activeCheckout.iframe.remove();

  activeCheckout.overlay.remove();

  activeCheckout = null;
}

function finishWithClose(
  reason: CheckoutCloseReason,
) {
  if (!activeCheckout) {
    return;
  }

  const { options } = activeCheckout;

  cleanup();

  options.onClose?.({
    reason,
  });
}

function finishWithError(
  code: CheckoutErrorCode,
  message: string,
) {
  if (!activeCheckout) {
    return;
  }

  const { options } = activeCheckout;

  cleanup();

  options.onError?.({
    code,
    message,
  });
}

function handleMessage(
  event: MessageEvent,
) {
  if (!activeCheckout) {
    return;
  }

  const {
    iframe,
    options,
    origin,
    loading,
  } = activeCheckout;

  // Security: only accept messages from the expected origin.
  if (event.origin !== origin) {
    return;
  }

  // Security: only accept messages from our checkout iframe.
  if (
    event.source !==
    iframe.contentWindow
  ) {
    return;
  }

  const message =
    event.data as CheckoutMessage;

  if (
    !message ||
    typeof message.type !==
      "string"
  ) {
    return;
  }

  console.log(
    "[Dodo SDK] Message received:",
    message,
  );

  switch (message.type) {
    case "CHECKOUT_READY": {
      console.log(
        "[Dodo SDK] Checkout ready",
      );

      // The iframe loaded successfully.
      window.clearTimeout(
        activeCheckout.timeoutId,
      );

      // Hide loading state.
      loading.style.display = "none";

      // Initialize checkout.
      iframe.contentWindow?.postMessage(
        {
          type: "CHECKOUT_INIT",
          productId:
            options.productId,
        } satisfies CheckoutMessage,
        origin,
      );

      break;
    }

    case "CHECKOUT_SUCCESS": {
      options.onSuccess?.({
        sessionId:
          message.sessionId,
      });

      break;
    }

    case "CHECKOUT_ERROR": {
      options.onError?.({
        code: message.code,
        message:
          message.message,
      });

      break;
    }

    case "CHECKOUT_CLOSE": {
      const reason =
        message.reason;

      cleanup();

      options.onClose?.({
        reason,
      });

      break;
    }
  }
}

export const DodoCheckout = {
  open(options: CheckoutOptions) {
    // --------------------------------
    // Prevent duplicate checkout
    // --------------------------------

    if (activeCheckout) {
      options.onError?.({
        code:
          "CHECKOUT_ALREADY_OPEN",
        message:
          "A checkout is already open.",
      });

      return;
    }

    // --------------------------------
    // Validate product
    // --------------------------------

    if (!options.productId) {
      options.onError?.({
        code:
          "COMMUNICATION_ERROR",
        message:
          "productId is required.",
      });

      return;
    }

    const checkoutUrl =
      getCheckoutUrl();

    const origin =
      new URL(checkoutUrl)
        .origin;

    // --------------------------------
    // Overlay
    // --------------------------------

    const overlay =
      document.createElement(
        "div",
      );

    overlay.style.position =
      "fixed";

    overlay.style.inset = "0";

    overlay.style.zIndex =
      "999999";

    overlay.style.background =
      "rgba(15, 23, 42, 0.5)";

    overlay.style.backdropFilter =
      "blur(4px)";

    overlay.style.display =
      "flex";

    overlay.style.alignItems =
      "center";

    overlay.style.justifyContent =
      "center";

    overlay.style.padding =
      "24px";

    // --------------------------------
    // Loading state
    // --------------------------------

    const loading =
      document.createElement(
        "div",
      );

    loading.style.position =
      "absolute";

    loading.style.width =
      "min(448px, calc(100% - 48px))";

    loading.style.height =
      "min(760px, 95vh)";

    loading.style.borderRadius =
      "24px";

    loading.style.background =
      "white";

    loading.style.display =
      "flex";

    loading.style.flexDirection =
      "column";

    loading.style.alignItems =
      "center";

    loading.style.justifyContent =
      "center";

    loading.style.boxShadow =
      "0 25px 60px rgba(0, 0, 0, 0.25)";

    loading.innerHTML = `
      <div
        style="
          width: 32px;
          height: 32px;
          border: 3px solid #e2e8f0;
          border-top-color: #0f172a;
          border-radius: 50%;
          animation: dodo-checkout-spin 0.8s linear infinite;
        "
      ></div>

      <p
        style="
          margin: 16px 0 0;
          color: #0f172a;
          font-size: 14px;
          font-weight: 600;
          font-family: Inter, system-ui, sans-serif;
        "
      >
        Loading secure checkout
      </p>

      <p
        style="
          margin: 6px 0 0;
          color: #64748b;
          font-size: 12px;
          font-family: Inter, system-ui, sans-serif;
        "
      >
        Please wait...
      </p>
    `;

    // Add spinner animation.
    const style =
      document.createElement(
        "style",
      );

    style.textContent = `
      @keyframes dodo-checkout-spin {
        to {
          transform: rotate(360deg);
        }
      }
    `;

    document.head.appendChild(style);

    // --------------------------------
    // iframe
    // --------------------------------

    const iframe =
      document.createElement(
        "iframe",
      );

    iframe.src =
      checkoutUrl;

    iframe.title =
      "Dodo Checkout";

    iframe.style.width =
      "100%";

    iframe.style.maxWidth =
      "448px";

    iframe.style.height =
      "min(760px, 95vh)";

    iframe.style.border =
      "0";

    iframe.style.borderRadius =
      "24px";

    iframe.style.background =
      "white";

    iframe.style.boxShadow =
      "0 25px 60px rgba(0, 0, 0, 0.25)";

    iframe.style.position =
      "relative";

    iframe.style.zIndex =
      "1";

    // --------------------------------
    // Timeout
    // --------------------------------

    const timeoutId =
      window.setTimeout(() => {
        finishWithError(
          "CHECKOUT_LOAD_FAILED",
          "The checkout could not be loaded. Please try again.",
        );
      }, CHECKOUT_TIMEOUT);

    // --------------------------------
    // Active checkout
    // --------------------------------

    activeCheckout = {
      iframe,
      overlay,
      loading,
      options,
      timeoutId,
      origin,
    };

    // --------------------------------
    // Listen before iframe insertion
    // --------------------------------

    window.addEventListener(
      "message",
      handleMessage,
    );

    // --------------------------------
    // Insert elements
    // --------------------------------

    overlay.appendChild(
      loading,
    );

    overlay.appendChild(
      iframe,
    );

    document.body.appendChild(
      overlay,
    );
  },

  close() {
    if (!activeCheckout) {
      return;
    }

    finishWithClose("user");
  },
};

export default DodoCheckout;