import { useEffect, useState } from "react";
import {useNavigate, useParams} from "react-router-dom";
import styled from "styled-components";
import { fetchBidDetail } from "../../api/bid";
import defaultImage from "../../assets/background.png";
import {IMAGE_BASE_URL} from "../../config";
import PaymentModal from "../../components/PaymentModal";


const Container = styled.div`
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
`;

const ImageWrapper = styled.div`
  width: 100%;
  height: 200px;
  background: ${(props) => props.theme.colors.lightGray};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
`;

const Info = styled.div`
  margin-top: 20px;
`;

const DetailItem = styled.p`
  font-size: 14px;
  margin: 5px 0;
`;

const Loading = styled.p`
  text-align: center;
  font-size: 16px;
  color: ${(props) => props.theme.colors.darkGray};
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row-reverse;
`;

const PayButton = styled.button`
  padding: 10px 16px;
  font-size: 16px;
  border-radius: 8px;
  border: none;
  background-color: ${(props) => (props.disabled ? "#bbb" : props.theme.colors.darkGray)};
  color: white;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};

  &:hover {
    background-color: ${(props) => (props.disabled ? "#bbb" : props.theme.colors.gray)};
  }
`;

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

  if (loading) return <Loading>로딩 중...</Loading>;
  if (!bid) return <Loading>데이터를 불러올 수 없습니다.</Loading>;

  return (
      <Container>
        <Title>입찰 내역 상세</Title>
        <ImageWrapper>
          <Image src={bid.searchAuctionItemRes.imageUrl
              ? `${IMAGE_BASE_URL}${bid.searchAuctionItemRes.imageUrl}`
              : defaultImage} alt={bid.searchAuctionItemRes.name}/>
        </ImageWrapper>
        <Info>
          <DetailItem>📢 상품명: {bid.searchAuctionItemRes.name}</DetailItem>
          <DetailItem>📂 카테고리: {bid.searchAuctionItemRes.category}</DetailItem>
          <DetailItem>📏 사이즈: {bid.searchAuctionItemRes.size}</DetailItem>
          <DetailItem>💰 입찰 가격: {bid.biddingPrice.toLocaleString()}원</DetailItem>
          <DetailItem>⏳ 입찰 상태: {bid.biddingStatus}</DetailItem>
          <DetailItem>🏷 브랜드: {bid.searchAuctionItemRes.brand}</DetailItem>
          <DetailItem>💵 경매 시작가: {bid.searchAuctionItemRes.startPrice.toLocaleString()}원</DetailItem>
          <DetailItem>📅 경매 시작: {new Date(bid.searchAuctionItemRes.startTime).toLocaleString("ko-KR")}</DetailItem>
          <DetailItem>📅 경매 종료: {new Date(bid.searchAuctionItemRes.endTime).toLocaleString("ko-KR")}</DetailItem>
          <DetailItem>🔍 경매 상태: {bid.searchAuctionItemRes.status}</DetailItem>
        </Info>
        <ButtonWrapper>
        <PayButton onClick={() => setIsPaymentOpen(true)} disabled={bid.biddingStatus !== "SUCCEED"}>결제하기</PayButton>
        </ButtonWrapper>
        

        {isPaymentOpen && (
            <PaymentModal
                isOpen={isPaymentOpen}
                onRequestClose={() => setIsPaymentOpen(false)}
                orderId={`${window.btoa(Math.random()).slice(0, 20)}${bidId}`}
                amount={bid.biddingPrice}
                onPaymentFail={() => navigate("/payment-fail", { state: { message: "결제 실패2", bidId }})}
            />
        )}
      </Container>
  );
};

export default BidDetail;
