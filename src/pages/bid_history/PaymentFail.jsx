import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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

const Button = styled.button`
  background-color: #e53e3e;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  margin-top: 20px;
`;

const PaymentFail = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [path, setPath] = useState("/bids");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setErrorMessage(location.state?.message || urlParams.get("message") || "결제에 실패했습니다.");
    setPath("/bids/" + (location.state?.bidId || ""))
  }, [location]);

  return (
      <Container>
        <Image src="https://static.toss.im/lotties/error-spot-apng.png" alt="Fail" />
        <Title>결제를 실패했어요</Title>
        <Message>{errorMessage}</Message>
        <Button onClick={() => navigate(path)}>이전 페이지로 이동</Button>
      </Container>
  );
};

export default PaymentFail;
