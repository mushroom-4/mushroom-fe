import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { fetchAuctionItemDetail, fetchAuctionItemLike, likeAuctionItems, unlikeAuctionItems } from "../../api/auctionItem";
import { isAuthenticated } from "../../utils/auth";
import BackButton from "../../components/common/BackButton";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { getItemImageSrc, getProfileImageSrc } from "../../utils/image";
import { fetchSellerReviews } from "../../api/review";

const Container = styled.div`
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  gap: 10px;
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

const BidButton = styled.button`
  margin-top: 20px;
  padding: 10px 16px;
  font-size: 16px;
  border-radius: 8px;
  border: none;
  background-color: ${(props) => (props.disabled ? props.theme.colors.lightGray : props.theme.colors.darkGray)};
  color: white;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};

  &:hover {
    background-color: ${(props) => (props.disabled ? props.theme.colors.lightGray : props.theme.colors.gray)};
  }

`;

const LikeButton = styled.button`
  position: absolute;
  top: 2rem;
  right: 2rem;
  font-size: 16px;
  border-radius: 8px;
  border: none;
  background-color: ${(props) => (props.isLiked ? props.theme.colors.lightGray : props.theme.colors.darkGray)};
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

const NoItemMessage = styled.p`
  text-align: center;
  color: ${(props) => props.theme.colors.darkGray};
  font-size: 16px;
`;

const SellerContainer = styled.div`
  display: flex;
  object-fit: contain;
  align-items: center;
  margin-right: auto;
  gap: 12px;
  padding: 12px;
  background: #f9f9f9;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    background: #ececec;
  }
`;

const SellerProfile = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid ${(props) => props.theme.colors.darkGray};
`;

const SellerInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const SellerName = styled.span`
  font-size: 16px;
  font-weight: bold;
`;

const SellerRating = styled.span`
  font-size: 14px;
  color: ${(props) => props.theme.colors.gray};
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
  width: 500px;
  max-height: 600px;
  overflow-y: auto;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
`;

const ReviewImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 8px;
  object-fit: cover;
  margin-right: 12px;
  border: 1px solid #ddd;
`;

const ReviewContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const ReviewItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
  transition: background 0.2s;
  gap: 6px;

  &:hover {
    background: #f9f9f9;
  }
`;

const ReviewText = styled.p`
  font-size: 14px;
  margin: 6px 0;
`;

const ReviewBidInfo = styled.span`
  font-size: 12px;
  color: ${(props) => props.theme.colors.gray};
`;

const Image = styled.img`
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
`;

const FullScreenOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const FullScreenImage = styled.img`
  width: 80%;
  max-height: 90%;
  object-fit: contain;
  border-radius: 8px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  font-size: 24px;
  color: white;
  cursor: pointer;
  z-index: 2100;
  &:hover {
    opacity: 0.7;
  }
`;


const formatScore = (score) => {
  if (Number.isInteger(score * 10)) return score.toString();
  return score.toFixed(2);
};

const AuctionItemDetail = () => {
  const navigate = useNavigate();
  const isLogin = isAuthenticated();
  const { auctionItemId } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState("");
  const [isBiddingActive, setIsBiddingActive] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [sellerReviews, setSellerReviews] = useState([]);
  const [isImageOpen, setIsImageOpen] = useState(false);

  useEffect(() => {
    const loadAuctionItemDetail = async () => {
      setLoading(true);
      const auctionItemResp = await fetchAuctionItemDetail(auctionItemId);
      const likeResp = await fetchAuctionItemLike(auctionItemId);
      if (auctionItemResp.success) {
        setItem(auctionItemResp.data);
      }
      if (likeResp.success) {
        setIsLiked(likeResp.data.hasLike);
      }
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
  
  // 모달이 열릴 때 리뷰 데이터를 가져옴
  useEffect(() => {
    if (!isReviewModalOpen) return;

    const loadSellerReviews = async () => {
      const response = await fetchSellerReviews(item.seller.id);
      if (response.success) {
        setSellerReviews(response.data.reviews);
      }
    };
    if (isReviewModalOpen) {
      loadSellerReviews();
    }
  }, [isReviewModalOpen, item]);

  const formatTime = (ms) => {
    if (ms <= 0) return "00:00:00";
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const handleLike = async (isLiked) => {
    const response = isLiked ? await unlikeAuctionItems(auctionItemId) : await likeAuctionItems(auctionItemId);
    if (response.success) {
      alert(isLiked ? "관심 상품을 해제했습니다." : "관심 상품에 등록했습니다.");
      setIsLiked(!isLiked);
    } else {
      alert(response.message);
    }
  }

  if (loading) return <LoadingSpinner />;
  if (!item) return <NoItemMessage>잘못된 상품 정보 페이지 입니다.</NoItemMessage>;

  return (
    <>
      <BackButton />
      <Container>
      <SellerContainer onClick={() => setIsReviewModalOpen(true)}>
        <SellerProfile src={getProfileImageSrc(item.seller.imageUrl)} alt="판매자 프로필" />
        <SellerInfo>
          <SellerName>{item.seller.nickname}</SellerName>
          <SellerRating>{item.seller.averageScore === 0 ? "" : `⭐ ${formatScore(item.seller.averageScore)}`} ({item.seller.totalReviewCount}개 리뷰)</SellerRating>
        </SellerInfo>
      </SellerContainer>
      {isLogin ? <LikeButton onClick={() => handleLike(isLiked)} isLiked={isLiked}>{isLiked ? "좋아요 취소" : "좋아요"}</LikeButton>: <></>}
      
      <Image src={getItemImageSrc(item.imageUrl)} alt={item.name} onClick={() => setIsImageOpen(true)}/>
      {isImageOpen && (
        <FullScreenOverlay onClick={() => setIsImageOpen(false)}>
          <CloseButton onClick={() => setIsImageOpen(false)}>✕</CloseButton>
          <FullScreenImage src={getItemImageSrc(item.imageUrl)} alt={item.name} />
        </FullScreenOverlay>
      )}
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
  {isReviewModalOpen && (
    <ModalOverlay onClick={() => setIsReviewModalOpen(false)}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <h3>{item.seller.nickname}님의 리뷰 ({sellerReviews.length}개) {item.seller.averageScore === 0 ? "" : `⭐ ${formatScore(item.seller.averageScore)}`}</h3>
        {sellerReviews.length > 0 ? (
          sellerReviews.map((review) => (
            <ReviewItem key={review.reviewId} onClick={() => {
              setIsReviewModalOpen(false);
              navigate(`/auction/${review.bid.auctionItemId}`);
            }}>
              {/* 상품 이미지 추가 */}
              <ReviewImage src={getItemImageSrc(review.bid.auctionItemImageUrl)} alt="상품 이미지" />
              <ReviewContent>
                <ReviewText>{review.bid.bidderName}: "{review.content}"</ReviewText>
                <ReviewBidInfo>⭐ {review.score} | {review.bid.auctionItemName} ({review.bid.biddingPrice.toLocaleString()}원)</ReviewBidInfo>
              </ReviewContent>
            </ReviewItem>
          ))
        ) : (
          <p>아직 리뷰가 없습니다.</p>
        )}
      </ModalContent>
    </ModalOverlay>
  )}
    </>
  );
};

export default AuctionItemDetail;
