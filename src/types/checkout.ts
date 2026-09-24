export type CheckoutErrorCode =
  | "CHECKOUT_LOAD_FAILED"
  | "CHECKOUT_ALREADY_OPEN"
  | "PAYMENT_DECLINED"
  | "PAYMENT_FAILED"
  | "COMMUNICATION_ERROR";

export type CheckoutCloseReason =
  | "user"
  | "success"
  | "error";

export type CheckoutOptions = {
  productId: string;

  onSuccess?: (data: {
    sessionId: string;
  }) => void;

  onClose?: (data: {
    reason: CheckoutCloseReason;
  }) => void;

  onError?: (data: {
    code: CheckoutErrorCode;
    message: string;
  }) => void;
};

export type CheckoutMessage =
  | {
      type: "CHECKOUT_READY";
    }
  | {
      type: "CHECKOUT_INIT";
      productId: string;
    }
  | {
      type: "CHECKOUT_SUCCESS";
      sessionId: string;
    }
  | {
      type: "CHECKOUT_ERROR";
      code: CheckoutErrorCode;
      message: string;
    }
  | {
      type: "CHECKOUT_CLOSE";
      reason: CheckoutCloseReason;
    };