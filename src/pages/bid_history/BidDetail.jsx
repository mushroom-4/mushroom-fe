import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { fetchBidDetail } from "../../api/bid";
import defaultImage from "../../assets/background.png";
import {IMAGE_BASE_URL} from "../../config";


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

const BidDetail = () => {
  const { bidId } = useParams();
  const [bid, setBid] = useState(null);
  const [loading, setLoading] = useState(true);

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
        <Image src={bid.searchAuctionItemRes.imageUrl ? `${IMAGE_BASE_URL}${bid.searchAuctionItemRes.imageUrl}` : defaultImage} alt={bid.searchAuctionItemRes.name} />
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
    </Container>
  );
};

export default BidDetail;
