import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { fetchAuctionItemDetail, likeAuctionItems } from "../../api/auctionItem";
import defaultImage from "../../assets/background.png";
import {IMAGE_BASE_URL} from "../../config";
import { isAuthenticated } from "../../utils/auth";
import BackButton from "../../components/common/BackButton";

const Container = styled.div`
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
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

const BidButton = styled.button`
  margin-top: 20px;
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

const LikeButton = styled.button`
  position: absolute;
  top: 2rem;
  right: 2rem;
  font-size: 16px;
  border-radius: 8px;
  border: none;
  background-color: ${(props) => props.theme.colors.darkGray};
  color: white;
  cursor: pointer;
  &:hover {
    background-color: ${(props) => props.theme.colors.gray};
  }
`;

const TimerText = styled.p`
  font-size: 18px;
  font-weight: bold;
  color: ${(props) => props.theme.colors.darkGray};
  margin-top: 10px;
`;


const AuctionItemDetail = () => {
  const navigate = useNavigate();
  const isLogin = isAuthenticated();
  const { auctionItemId } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState("");
  const [isBiddingActive, setIsBiddingActive] = useState(false);

  useEffect(() => {
    const loadAuctionItemDetail = async () => {
      setLoading(true);
      const response = await fetchAuctionItemDetail(auctionItemId);
      setItem(response.data);
      setLoading(false);
    };

    loadAuctionItemDetail();
  }, [auctionItemId]);

  useEffect(() => {
    if (!item) return;

    const updateTimer = () => {
      const now = new Date().getTime();
      const startTime = new Date(item.startTime).getTime();
      const endTime = new Date(item.endTime).getTime();

      if (now < startTime) {
        setIsBiddingActive(false);
        setTimeLeft(formatTime(startTime - now));
      } else if (now >= startTime && now <= endTime) {
        setIsBiddingActive(true);
        setTimeLeft(formatTime(endTime - now));
      } else {
        setIsBiddingActive(false);
        setTimeLeft("해당 경매는 이미 종료되었습니다.");
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [item]);

  const formatTime = (ms) => {
    if (ms <= 0) return "00:00:00";
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  if (loading) return <Loading>로딩 중...</Loading>;

  const handleLike = async () => {
    const response = await likeAuctionItems(auctionItemId);
    if (response.success) {
      alert("관심 상품에 등록했습니다.");
    } else {
      alert(response.message);
    }
  }

  return (
    <>
      <BackButton />
      <Container>
      {isLogin ? <LikeButton onClick={handleLike}>관심 갖기</LikeButton>: <></>}
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
        {
          item.bid && 
          <>
            <strong>
            <DetailItem>😎 최고 입찰자: {item.bid.bidderNickname}</DetailItem>
            <DetailItem>💰 최고 금액: {item.bid.maxPrice.toLocaleString()}원</DetailItem>
            </strong>
          </>
        }
      </Info>
      {isLogin ? (
        <>
        {new Date().getTime() < new Date(item.startTime).getTime() ? (
          <TimerText>⏳ 입찰 시작까지 남은 시간: {timeLeft}</TimerText>
        ) : new Date().getTime() < new Date(item.endTime).getTime() ? (
          <TimerText>⏳ 입찰 종료까지 남은 시간: {timeLeft}</TimerText>
        ) : (
          <TimerText>{timeLeft}</TimerText>
        )}
        <BidButton onClick={() => navigate(`/auction/${auctionItemId}/bid`)} disabled={!isBiddingActive}>
          입찰하러 가기
        </BidButton>
        </>
      ) : (
        <>
        <TimerText>입찰은 로그인 후 이용할 수 있어요!</TimerText>
        <BidButton onClick={() => navigate("/login")}>
          로그인하러 가기
        </BidButton>
        </>
      )}
  </Container>
    </>
  );
};

export default AuctionItemDetail;
