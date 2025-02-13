import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { fetchAuctionItemDetail } from "../api/auctionItem";
import defaultImage from "../assets/background.png";

const IMAGE_BASE_URL = "https://yeim-vpc-bucket-240130.s3.ap-northeast-2.amazonaws.com/public/";

const Container = styled.div`
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Image = styled.img`
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const Info = styled.div`
  width: 100%;
  margin-top: 20px;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin: 0;
`;

const Description = styled.p`
  font-size: 16px;
  color: ${(props) => props.theme.colors.darkGray};
  margin-top: 10px;
`;

const DetailItem = styled.p`
  font-size: 14px;
  margin: 5px 0;
`;

const Loading = styled.p`
  font-size: 16px;
  color: ${(props) => props.theme.colors.darkGray};
`;

const AuctionItemDetail = () => {
  const { auctionItemId } = useParams(); // URL에서 auctionItemId 가져오기
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAuctionItemDetail = async () => {
      setLoading(true);
      const data = await fetchAuctionItemDetail(auctionItemId);
      setItem(data);
      setLoading(false);
    };

    loadAuctionItemDetail();
  }, [auctionItemId]);

  if (loading) return <Loading>로딩 중...</Loading>;

  return (
    <Container>
      <Image src={item.imageUrl ? `${IMAGE_BASE_URL}${item.imageUrl}` : defaultImage} alt={item.name} />
      <Info>
        <Title>{item.brand} - {item.name}</Title>
        <Description>{item.description}</Description>
        <DetailItem>📏 사이즈: {item.size}</DetailItem>
        <DetailItem>📂 카테고리: {item.category}</DetailItem>
        <DetailItem>💰 시작 가격: {item.startPrice.toLocaleString()}원</DetailItem>
        <DetailItem>⏳ 시작 시간: {new Date(item.startTime).toLocaleString("ko-KR")}</DetailItem>
        <DetailItem>⏳ 종료 시간: {new Date(item.endTime).toLocaleString("ko-KR")}</DetailItem>
        <DetailItem>🔍 상태: {item.status}</DetailItem>
      </Info>
    </Container>
  );
};

export default AuctionItemDetail;