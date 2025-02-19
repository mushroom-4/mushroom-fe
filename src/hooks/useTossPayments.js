import { useEffect, useState } from "react";
import { loadTossPayments, ANONYMOUS } from "@tosspayments/tosspayments-sdk";
import { useNavigate } from "react-router-dom";

const useTossPayments = (clientKey, amount, orderId, failCallback) => {
  const [widgets, setWidgets] = useState(null);
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    if (!clientKey || !amount || amount <= 0) {
      return;
    }

    async function initPayments() {
      try {
        const tossPayments = await loadTossPayments(clientKey);
        if (!mounted) return;

        const customerKey = ANONYMOUS;
        const widgetsInstance = tossPayments.widgets({ customerKey });

        await widgetsInstance.setAmount({ currency: "KRW", value: amount });

        await Promise.all([
          widgetsInstance.renderPaymentMethods({ selector: "#payment-method", variantKey: "DEFAULT" }),
          widgetsInstance.renderAgreement({ selector: "#agreement", variantKey: "AGREEMENT" }),
        ]);

        setWidgets(widgetsInstance);
        setReady(true);
      } catch (error) {
        console.error("TossPayments 초기화 실패:", error);
      }
    }

    initPayments();

    return () => {
      mounted = false;
    };
  }, [clientKey, amount]);

  const requestPayment = async () => {
    if (!widgets) {
      return;
    }

    try {
      await widgets.requestPayment({
        orderId,
        orderName: "경매 상품",
        successUrl: `${window.location.origin}/payment-success?orderId=${orderId}&amount=${amount}`,
        failUrl: `${window.location.origin}/payment-fail`,
      });
    } catch (error) {
      console.error("결제 요청 실패:", error);
      failCallback && failCallback(error);
      navigate("/payment-fail", { state: { message: error.message || "결제 실패" } });
    }
  };

  return { requestPayment, ready };
};

export default useTossPayments;
