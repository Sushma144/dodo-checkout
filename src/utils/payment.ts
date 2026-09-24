export type PaymentResult =
  | {
      status: "success";
      sessionId: string;
    }
  | {
      status: "declined";
      code: "PAYMENT_DECLINED";
      message: string;
    }
  | {
      status: "failed";
      code: "PAYMENT_FAILED";
      message: string;
    };

const RETRY_CARD = "4000000000000341";

let retryCardAttempts = 0;

export async function processPayment(
  cardNumber: string,
): Promise<PaymentResult> {
  // Simulate network/payment processing.
  await new Promise((resolve) =>
    setTimeout(resolve, 1200),
  );

  const normalizedCard = cardNumber.replace(/\s/g, "");

  // ----------------------------------
  // Successful payment
  // ----------------------------------

  if (normalizedCard === "4242424242424242") {
    return {
      status: "success",
      sessionId: `sess_${crypto.randomUUID()}`,
    };
  }

  // ----------------------------------
  // Declined payment
  // ----------------------------------

  if (normalizedCard === "4000000000000002") {
    return {
      status: "declined",
      code: "PAYMENT_DECLINED",
      message:
        "Your card was declined. Please try another card.",
    };
  }

  // ----------------------------------
  // Fail once, then succeed
  // ----------------------------------

  if (normalizedCard === RETRY_CARD) {
    retryCardAttempts += 1;

    if (retryCardAttempts === 1) {
      return {
        status: "failed",
        code: "PAYMENT_FAILED",
        message:
          "We couldn't complete the payment. Your card hasn't been charged.",
      };
    }

    return {
      status: "success",
      sessionId: `sess_${crypto.randomUUID()}`,
    };
  }

  // ----------------------------------
  // Unknown card
  // ----------------------------------

  return {
    status: "failed",
    code: "PAYMENT_FAILED",
    message:
      "For this demo, please use one of the provided test cards.",
  };
}