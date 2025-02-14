import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { fetchAuctionItemDetail, placeBid } from "../api/auctionItem";
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

const BidButton = styled.button`
  margin-top: 20px;
  padding: 10px 16px;
  font-size: 16px;
  border-radius: 8px;
  border: none;
  background-color: ${(props) => (props.disabled ? "#bbb" : props.theme.colors.darkGray)};
  color: white;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: background 0.3s;

  &:hover {
    background-color: ${(props) => (props.disabled ? "#bbb" : props.theme.colors.gray)};
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 12px;
  width: 400px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
`;

const ModalTitle = styled.h3`
  margin-bottom: 10px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  font-size: 16px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const CancelButton = styled.button`
  padding: 8px 16px;
  border-radius: 8px;
  background: white;
  border: 1px solid ${(props) => props.theme.colors.gray};
  cursor: pointer;
`;

const ConfirmButton = styled.button`
  padding: 8px 16px;
  border-radius: 8px;
  background: ${(props) => props.theme.colors.darkGray};
  color: white;
  border: none;
  cursor: pointer;

  &:hover {
    background: ${(props) => props.theme.colors.gray};
  }
`;

const TimerText = styled.p`
  font-size: 18px;
  font-weight: bold;
  color: ${(props) => props.theme.colors.darkGray};
  margin-top: 10px;
`;


const AuctionItemDetail = () => {
  const { auctionItemId } = useParams(); // URL에서 auctionItemId 가져오기
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [biddingPrice, setBiddingPrice] = useState("");
  const [timeLeft, setTimeLeft] = useState("");
  const [isBiddingActive, setIsBiddingActive] = useState(false);

  useEffect(() => {
    const loadAuctionItemDetail = async () => {
      setLoading(true);
      const data = await fetchAuctionItemDetail(auctionItemId);
      setItem(data);
      setLoading(false);
    };

    loadAuctionItemDetail();
  }, [auctionItemId]);

  useEffect(() => {
    if (!item) return;

    const updateTimer = async () => {
      const now = new Date().getTime();
      const startTime = new Date(item.startTime).getTime();
      const endTime = new Date(item.endTime).getTime();

      if (now < startTime) {
        setIsBiddingActive(false);
        setTimeLeft(formatTime(startTime - now));
      } else if (now >= startTime && now <= endTime) {
        setIsBiddingActive(true);
        setTimeLeft(formatTime(endTime - now));

        const data = await fetchAuctionItemDetail(auctionItemId);
        setItem((prevItem) => ({
          ...prevItem,
          ...data,
        }));
      } else {
        setIsBiddingActive(false);
        setTimeLeft("해당 경매는 이미 종료되었습니다.");
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [auctionItemId]);


  const formatTime = (ms) => {
    if (ms <= 0) return "00:00:00";
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  if (loading) return <Loading>로딩 중...</Loading>;

  const handleOpenModal = () => {
    setBiddingPrice(""); // 초기화
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleBidSubmit = async () => {
    if (!biddingPrice || isNaN(biddingPrice) || Number(biddingPrice) <= 0 || biddingPrice % 500 !== 0) {
      alert("올바른 입찰가를 입력해주세요.");
      return;
    }

    const response = await placeBid(auctionItemId, Number(biddingPrice));

    if (response.success) {
      setIsModalOpen(false);
      alert("입찰에 성공했습니다.");
    } else {
      setIsModalOpen(false);
      alert(response.message);
    }
  };

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
      {/* ✅ 타이머 표시 */}
      {new Date().getTime() < new Date(item.startTime).getTime() ? (
          <TimerText>⏳ 입찰까지 남은 시간: {timeLeft}</TimerText>
        ) : new Date().getTime() < new Date(item.endTime).getTime() ? (
          <TimerText>⏳ 입찰 종료까지 남은 시간: {timeLeft}</TimerText>
        ) : (
          <TimerText>{timeLeft}</TimerText>
        )}
      {/* ✅ 버튼 상태 제어 */}
      <BidButton onClick={handleOpenModal} disabled={!isBiddingActive}>
        입찰하기
      </BidButton>
      {isModalOpen && (
      <ModalOverlay>
        <ModalContent>
          <ModalTitle>입찰하기</ModalTitle>
          <Input
            type="text"
            placeholder="입찰 금액 입력"
            value={biddingPrice}
            onChange={(e) => setBiddingPrice(e.target.value)}
          />
          <DetailItem>판매자가 설정한 경매 단위: 500원</DetailItem>
          <ButtonGroup>
            <CancelButton onClick={handleCloseModal}>취소</CancelButton>
            <ConfirmButton onClick={handleBidSubmit}>입찰</ConfirmButton>
          </ButtonGroup>
        </ModalContent>
      </ModalOverlay>
    )}
  </Container>
  );
};

export default AuctionItemDetail;