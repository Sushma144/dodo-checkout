import { useEffect } from "react";

import { DemoStore } from "./components/DemoStore";
import { Checkout } from "./components/Checkout";

function CheckoutApp() {
  useEffect(() => {
    console.log(
      "[Checkout] Sending CHECKOUT_READY",
    );

    window.parent.postMessage(
      {
        type: "CHECKOUT_READY",
      },
      window.location.origin,
    );
  }, []);

  const handleSuccess = (
    sessionId: string,
  ) => {
    window.parent.postMessage(
      {
        type: "CHECKOUT_SUCCESS",
        sessionId,
      },
      window.location.origin,
    );
  };

  const handleError = (
    code: string,
    message: string,
  ) => {
    window.parent.postMessage(
      {
        type: "CHECKOUT_ERROR",
        code,
        message,
      },
      window.location.origin,
    );
  };

  const handleClose = () => {
    window.parent.postMessage(
      {
        type: "CHECKOUT_CLOSE",
        reason: "user",
      },
      window.location.origin,
    );
  };

  return (
    <Checkout
      onClose={handleClose}
      onSuccess={handleSuccess}
      onError={handleError}
    />
  );
}

function App() {
  const isCheckout =
    new URLSearchParams(
      window.location.search,
    ).get("checkout") === "1";

  console.log(
    "[App] isCheckout:",
    isCheckout,
  );

  if (isCheckout) {
    return <CheckoutApp />;
  }

  return <DemoStore />;
}

export default App;