import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { fetchBidDetail } from "../../api/bid";
import { getItemImageSrc } from "../../utils/image";
import PaymentModal from "../../components/PaymentModal";
import BackButton from "../../components/common/BackButton";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const Container = styled.div`
  max-width: 650px;
  margin: 50px auto;
  padding: 24px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
`;

const Image = styled.img`
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 20px;
  cursor: pointer;
  &:hover {
    opacity: 0.7;
  }
`;

const BidInfoSection = styled.div`
  background: #f9f9f9;
  padding: 16px;
  border-radius: 8px;
  margin-top: 20px;
`;

const DetailItem = styled.p`
  font-size: 15px;
  margin: 6px 0;
  color: #555;
`;

const HighlightText = styled.span`
  font-size: 16px;
  font-weight: bold;
  color: #222;
`;

const AuctionStatus = styled.p`
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  padding: 10px;
  border-radius: 8px;
  margin-top: 16px;
  color: ${(props) =>
    props.status === "SUCCEED" ? "#155724" :
    props.status === "FAILED" ? "#721c24" :
    props.status === "BIDDING" ? "#856404" :
    props.status === "PAYMENT_COMPLETED" ? "#004085" :
    "#333"};
  background: ${(props) =>
    props.status === "SUCCEED" ? "#d4edda" :
    props.status === "FAILED" ? "#f8d7da" :
    props.status === "BIDDING" ? "#fff3cd" :
    props.status === "PAYMENT_COMPLETED" ? "#cce5ff" :
    "#eee"};
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 18px;
`;

const PayButton = styled.button`
  padding: 12px 16px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 8px;
  border: none;
  background-color: ${(props) => (props.disabled ? "#bbb" : "#28a745")};
  color: white;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: background 0.3s ease-in-out;

  &:hover {
    background-color: ${(props) => (props.disabled ? "#bbb" : "#218838")};
  }
`;

const ItemInfoSection = styled.div`
  padding: 1rem 0;
  display: flex;
  align-items: center;
  gap: 20px;
`;

const statusMessage = {
  "BIDDING": "경매 진행 중",
  "SUCCEED": "입찰 성공! 결제 가능",
  "FAILED": "입찰 실패",
  "CANCELED": "입찰 취소됨",
  "PAYMENT_COMPLETED": "결제 완료! 배송 대기 중",
};

const BidDetail = () => {
  const { bidId } = useParams();
  const [bid, setBid] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadBidDetail = async () => {
      setLoading(true);
      const response = await fetchBidDetail(bidId);
      setBid(response.data);
      setLoading(false);
    };

    loadBidDetail();
  }, [bidId]);

  if (loading) return <LoadingSpinner />;
  if (!bid) return <p style={{ textAlign: "center", fontSize: "16px" }}>데이터를 불러올 수 없습니다.</p>;

  return (
    <>
      <BackButton />
      <Container>
        <AuctionStatus status={bid.biddingStatus}>{statusMessage[bid.biddingStatus]}</AuctionStatus>
        
        <ItemInfoSection>
        <Image
            src={getItemImageSrc(bid.searchAuctionItemRes.imageUrl)}
            alt={bid.searchAuctionItemRes.name}
            onClick={() => navigate(`/auction/${bid.searchAuctionItemRes.auctionItemId}`)}
          />
        <div>
          <DetailItem>
            상품명: <HighlightText>{bid.searchAuctionItemRes.name}</HighlightText>
          </DetailItem>
          <DetailItem>
            브랜드: <HighlightText>{bid.searchAuctionItemRes.brand}</HighlightText>
          </DetailItem>
          <DetailItem>
            카테고리: <HighlightText>{bid.searchAuctionItemRes.category}</HighlightText>
          </DetailItem>
          <DetailItem>
            사이즈: <HighlightText>{bid.searchAuctionItemRes.size}</HighlightText>
          </DetailItem>
        </div>
        </ItemInfoSection>
        <BidInfoSection>
          <DetailItem>
            경매 시작가: <HighlightText>{bid.searchAuctionItemRes.startPrice.toLocaleString()}원</HighlightText>
          </DetailItem>
          <DetailItem>
            입찰한 가격: <HighlightText>{bid.biddingPrice.toLocaleString()}원</HighlightText>
          </DetailItem>
          <DetailItem>
            경매 시작: <HighlightText>{new Date(bid.searchAuctionItemRes.startTime).toLocaleString("ko-KR")}</HighlightText>
          </DetailItem>
          <DetailItem>
            경매 종료: <HighlightText>{new Date(bid.searchAuctionItemRes.endTime).toLocaleString("ko-KR")}</HighlightText>
          </DetailItem>
        </BidInfoSection>

        {/* 결제 버튼 */}
        <ButtonWrapper>
          <PayButton onClick={() => setIsPaymentOpen(true)} disabled={bid.biddingStatus !== "SUCCEED"}>
            결제하기
          </PayButton>
        </ButtonWrapper>

        {isPaymentOpen && (
          <PaymentModal
            isOpen={isPaymentOpen}
            onRequestClose={() => setIsPaymentOpen(false)}
            orderId={`${window.btoa(Math.random()).slice(0, 20)}${bidId}`}
            amount={bid.biddingPrice}
            onPaymentFail={() => navigate("/payment-fail", { state: { message: "결제 실패", bidId } })}
          />
        )}
      </Container>
    </>
  );
};

export default BidDetail;
