import {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { confirmPayment } from "../../api/payment";
import styled from "styled-components";

const Container = styled.div`
  text-align: center;
  padding: 20px;
`;

const Image = styled.img`
  width: 100px;
`;

const Title = styled.h2`
  color: #4e5968;
`;

const Message = styled.p`
  font-size: 18px;
`;

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [time, setTime] = useState(5);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentKey = urlParams.get("paymentKey");
    const orderId = urlParams.get("orderId");
    const amount = urlParams.get("amount");
    const bidId = orderId.substring(20);

    const confirm = async () => {
      const response = await confirmPayment(paymentKey, orderId, amount);

      if (response.success) {
        const interval = setInterval(() => {
          setTime((prevTime) => {
            prevTime -= 1;
            if (prevTime <= 1) {
              clearInterval(interval);
              navigate(`/bids/${bidId}`);
            }
            return prevTime;
          });
        }, 1000);

        return () => clearInterval(interval);
      } else {
        navigate("/payment-fail", { state: { message: response.message || "결제 승인 실패", bidId } });
      }
    };

    confirm();
  }, [navigate]);

  return (
      <Container>
        <Image src="https://static.toss.im/illusts/check-blue-spot-ending-frame.png" alt="Success" />
        <Title>결제를 완료했어요</Title>
        <Message>{time}초 후 창이 닫힙니다.</Message>
      </Container>
  );
};

export default PaymentSuccess;
