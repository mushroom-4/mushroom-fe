import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import styled from "styled-components";
import useTossPayments from "../hooks/useTossPayments";

const ModalContainer = styled.div`
  padding: 40px;
  background: white;
  border-radius: 10px;
  text-align: center;
  border: 1px solid ${(props) => props.theme.colors.darkGray};
  margin: 100px;
`;

const Title = styled.h2`
  color: #4e5968;
`;

const ButtonWrapper = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 10px;
`;

const PaymentButton = styled.button`
  background-color: #3182f6;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  &:disabled {
    background-color: #b0b8c1;
  }
`;

const CancelButton = styled.button`
  background-color: #e5e8eb;
  color: black;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
`;

const PaymentModal = ({ isOpen, onRequestClose, orderId, amount, onPaymentFail }) => {
  const [clientKey] = useState("test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm");
  const [isReady, setIsReady] = useState(false);

  const { requestPayment, ready } = useTossPayments(
      isOpen ? clientKey : null, // ✅ 모달이 열릴 때만 초기화
      amount,
      orderId,
      onPaymentFail
  );

  useEffect(() => {
    if (isOpen) {
      setIsReady(true);
    }
  }, [isOpen]);

  return (
      <Modal
          isOpen={isOpen}
          onRequestClose={onRequestClose}
          ariaHideApp={false}
          className="payment-modal"
      >
        <ModalContainer>
          <Title>결제하기</Title>
          <div id="payment-method"></div>
          <div id="agreement"></div>
          <ButtonWrapper>
            <PaymentButton onClick={requestPayment} disabled={!ready || !isReady}>
              {ready ? "결제하기" : "로딩 중..."}
            </PaymentButton>
            <CancelButton onClick={onRequestClose}>취소</CancelButton>
          </ButtonWrapper>
        </ModalContainer>
      </Modal>
  );
};

export default PaymentModal;
