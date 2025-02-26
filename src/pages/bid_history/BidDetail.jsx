import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { fetchBidDetail } from "../../api/bid";
import { getItemImageSrc } from "../../utils/image";
import PaymentModal from "../../components/PaymentModal";
import BackButton from "../../components/common/BackButton";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { createSellerReview } from "../../api/review";

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

const ReviewSection = styled.div`
  max-width: 650px;
  margin: 20px auto;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  text-align: center;
  
  & > div {
    display: flex;
    padding: 1rem 0;
    align-items: center;
    gap: 1rem;
    justify-content: space-between;
  }
`;

const ReviewTextArea = styled.textarea`
  width: 100%;
  height: 80px;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 6px;
  resize: none;
`;

const ReviewScoreInput = styled.input`
  width: 50px;
  padding: 6px;
  font-size: 14px;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 6px;
`;

const SubmitReviewButton = styled.button`
  padding: 10px 14px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 8px;
  border: none;
  margin-top: 12px;
  background-color: ${(props) => (props.disabled ? props.theme.colors.lightGray : props.theme.colors.darkGray)};
  color: white;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: background 0.3s ease-in-out;

  &:hover {
    background-color: ${(props) => (props.disabled ? props.theme.colors.lightGray : props.theme.colors.gray)};
  }
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
  const [reviewScore, setReviewScore] = useState(10);
  const [reviewContent, setReviewContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadBidDetail = async () => {
      setLoading(true);
      const response = await fetchBidDetail(bidId);
      setBid(response.data);
      setLoading(false);
    };

    loadBidDetail();
  }, [bidId]);

  const handleSubmitReview = async () => {
    if (reviewScore < 1 || reviewScore > 10) {
      alert("점수는 1~10 사이로 입력해주세요.");
      return;
    }
    if (!reviewContent.trim()) {
      alert("리뷰 내용을 입력해주세요.");
      return;
    }
    if (reviewContent.length > 100) {
      alert("리뷰 내용은 100자 이내로 입력해주세요.");
      return;
    }
  
    setIsSubmitting(true);
  
    const response = await createSellerReview(bidId, {
      score: reviewScore,
      content: reviewContent,
    });
  
    if (response.success) {
      alert("리뷰가 성공적으로 등록되었습니다.");
      window.location.reload(); // 새로고침하여 리뷰 반영
    } else {
      alert(response.message);
    }
  
    setIsSubmitting(false);
  };

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
      {bid.biddingStatus === "PAYMENT_COMPLETED" && (
        <ReviewSection>
          <div>
            <h3>판매자 리뷰 작성</h3>
            <div>
              <label>점수: </label>
              <ReviewScoreInput
                type="number"
                min="1"
                max="10"
                value={reviewScore}
                onChange={(e) => setReviewScore(Number(e.target.value))}
              />
            </div>
          </div>
          <ReviewTextArea
            placeholder="리뷰 내용을 입력하세요 (최대 100자)"
            maxLength={100}
            value={reviewContent}
            onChange={(e) => setReviewContent(e.target.value)}
          />
          <SubmitReviewButton onClick={handleSubmitReview} disabled={isSubmitting}>
            리뷰 제출
          </SubmitReviewButton>
        </ReviewSection>
      )}
    </>
  );
};

export default BidDetail;
