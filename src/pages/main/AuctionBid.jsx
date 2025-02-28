import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { auctionItemChat, fetchAuctionItemDetail, placeBid } from "../../api/auctionItem";
import { getToken, isAuthenticated } from "../../utils/auth";
import { API_BASE_URL } from "../../config";
import { useAuth } from "../../context/AuthContext";
import BackButton from "../../components/common/BackButton";
import { getProfileImageSrc } from "../../utils/image";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { formatDate } from "../../utils/date";

/** ✅ 전체 컨테이너 */

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 40px;
  margin: 40px auto;

  @media (max-width: 800px) {
    flex-direction: column;
    align-items: center;
  }
`;

const AuctionContainer = styled.div`
  display: flex;
  gap: 20px;
  width: 100%;
`;


const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  @media (max-width: 800px) {
    width: 100%;
  }
`;

/** ✅ 채팅 섹션 (스크롤 가능) */
const ChatSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px;
  min-height: calc(80vh - 200px);
  max-height: calc(80vh - 200px);
  overflow-y: auto;
  background: #f9f9f9;
  transition: overflow-y 0.3s ease-in-out;
`;

const ChatMessage = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
`;

const ChatMessageBottom = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  ${({ isMe }) => isMe && `flex-direction: row-reverse;`}
`;

const MessageInfo = styled.div`
  display: flex;
  font-size: 12px;
  padding: 6px;
  color: ${(props) => props.theme.colors.gray};
  gap: 4px;
  ${({ isMe }) => isMe && `flex-direction: row-reverse;`}
`;

/** ✅ 말풍선 */
const Bubble = styled.div`
  /* object-fit: contain; */
  padding: 10px 14px;
  border-radius: 16px;
  font-size: 14px;
  line-height: 1.4;
  background: ${({ isMe }) => (isMe ? "#007bff" : "white")};
  color: ${({ isMe }) => (isMe ? "white" : "black")};
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  ${({ messageType }) => messageType !== "MESSAGE" &&
  (messageType === "ERROR" 
    ? `background: #ffabab; color: #940000; font-weight: bold;`
    : `background: #f0f8ff; color: #007bff; font-weight: bold;`)};
  word-break: break-word;
`;

/** ✅ 프로필 이미지 */
const ProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #ccc;
`;

/** ✅ 채팅 입력창 */
const ChatInputContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  position: sticky;
  bottom: 0;
  gap: 10px;
`;

/** ✅ 입력 필드 */
const ChatInput = styled.input`
  flex: 1;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  background: #f9f9f9;
`;

/** ✅ 전송 버튼 */
const SendButton = styled.button`
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background-color: ${(props) => (props.disabled ? props.theme.colors.lightGray : props.theme.colors.darkGray)};
  color: white;
  font-size: 14px;
  transition: 0.2s ease-in-out;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  

  &:hover {
    background-color: ${(props) => (props.disabled ? props.theme.colors.lightGray : props.theme.colors.gray)};
  }
`;

const BiddingSection = styled.div`
  flex: 1;
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  width: 50%;
  @media (max-width: 800px) {
    width: 100%;
  }
`;

const PriceText = styled.p`
  font-size: 24px;
  font-weight: bold;
`;

const BidButton = styled.button`
  width: 100%;
  padding: 12px;
  margin: 5px 0;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.2s ease-in-out, transform 0.1s ease-in-out;
  
  ${({ tier, theme }) => {
    switch (tier) {
      case 1:
        return `background-color: ${theme.colors.lightGray}; color: black;`;
      case 2:
        return `background-color: ${theme.colors.gray}; color: black;`;
      case 3:
        return `background-color: ${theme.colors.darkGray}; color: white;`;  // 주황색 강조
      case 4:
        return `background-color: #b72222; color: white;`;  // 빨간색 강조
      default:
        return `background-color: ${theme.colors.darkGray}; color: white;`;
    }
  }}

  &:hover {
    transform: scale(1.05);
  }
  
  &:disabled {
    background-color: #bbb;
    cursor: not-allowed;
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
  text-align: center;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
`;

const HighestBidderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  
  background: ${(props) => (props.isMe ? "#f1ffed" : "white")};
  padding: 30px 20px;
  border-radius: 10px;
  margin-top: 10px;
  
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  & > div {
    display: flex;
    align-items: center;
    gap: 10px;
  }
`;

const HighestBidderText = styled.span`
  font-size: 16px;
  font-weight: bold;
  color: #333;
`;

const TimerText = styled.p`
  font-size: 24px;
  font-weight: bold;
  color: ${({ timeLeft }) => {
    if (timeLeft < 10) return "#ff0000"; // 10초 미만: 빨간색
    if (timeLeft < 60) return "#ff5500"; // 1분 미만: 주황색
    if (timeLeft < 600) return "#ffaa00"; // 10분 미만: 노란색
    if (timeLeft < 3600) return "#11dd00"; // 1시간 미만: 초록색
    return "#444444";
  }};
  transition: color 0.5s ease-in-out;
`;

const AuctionItemInfo = styled.div`
  position: absolute;
  top: -3.5rem;
  left: 50%;
  transform: translate(-50%, 0);
  display: flex;
  align-items: center;
  padding: 16px;
  border-radius: 8px;
  gap: 2rem;
`;

const ItemImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 8px;
  object-fit: cover;
`;

const ItemDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 14px;
`;

const ItemName = styled.h2`
  font-size: 18px;
  font-weight: bold;
`;

const ItemMeta = styled.p`
  font-size: 14px;
  color: #666;
`;

const getBidIncrements = (price) => {
  
  if (price < 100000) return [100, 500, 1000, 5000];

  const base = Math.pow(10, Math.floor(Math.log10(price)) - 2); // 가격의 자릿수를 기반으로 증가 단위 계산
  return [base, base * 5, base * 10, base * 50];
};

const AuctionBid = () => {
  const { auctionItemId } = useParams();
  const isLogin = isAuthenticated();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [highestBid, setHighestBid] = useState(0);
  const [highestBidder, setHighestBidder] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [stompClient, setStompClient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBid, setSelectedBid] = useState(0);
  const lastSendTime = useRef(0);
  const scrollRef = useRef(null);
  const context = useAuth();
  const bidIncrements = getBidIncrements(highestBid);
  const [timeLeft, setTimeLeft] = useState("");
  
  useEffect(() => {
    if (!item) {
      return;
    }

    if (!item || new Date(item.endTime).getTime() < new Date().getTime()) {
      alert("이 경매는 이미 종료되었습니다.");
      navigate(-1); // 자동으로 이전 페이지로 이동
      return;
    }

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const end = new Date(item.endTime).getTime();
      const diff = end - now;
  
      if (diff <= 0) {
        navigate(-1); // ⏳ 시간이 지나면 자동으로 이전 페이지로 이동
        return;
      }
  
      const hours = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, "0");
      const minutes = String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, "0");
      const seconds = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, "0");
  
      setTimeLeft(`${hours}:${minutes}:${seconds}`);
    };
  
    calculateTimeLeft(); // 초기 실행
    const timer = setInterval(calculateTimeLeft, 1000); // 1초마다 업데이트
  
    return () => clearInterval(timer);
  }, [item, navigate]);
  
  useEffect(() => {
    const loadAuctionItemDetail = async () => {
      setLoading(true);
      const itemResponse = await fetchAuctionItemDetail(auctionItemId);
      console.log(itemResponse);
      if (itemResponse.success) {
        setItem(itemResponse.data);
        setHighestBid(itemResponse.data.bid ? itemResponse.data.bid.maxPrice : itemResponse.data.startPrice);
        itemResponse.data.bid && setHighestBidder({
          nickname: itemResponse.data.bid.bidderNickname,
          imageUrl: itemResponse.data.bid.imageUrl,
        });
      }
      const chatResponse = await auctionItemChat(auctionItemId);
      if (chatResponse.success) {
        const receivedMessage = chatResponse.data;
        setChatMessages(receivedMessage);
      }
      setLoading(false);
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: "smooth",
          });
        }
      }, 100);
    };

    loadAuctionItemDetail();
  }, [auctionItemId]);

  useEffect(() => {
    if (!isLogin || !item) return;

    const socket = new SockJS(`${API_BASE_URL}/ws`); 
    const client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: { Authorization: getToken() },
      debug: (str) => console.log("📌 [STOMP Debug]:", str),
      onConnect: (frame) => {
        console.log("✅ WebSocket Connected:", frame);

        client.subscribe(`/ws/sub/chats/${auctionItemId}`, (message) => {
          const receivedMessage = JSON.parse(message.body);
          console.log(receivedMessage);
          setChatMessages((prev) => [...prev, receivedMessage]);
          if (receivedMessage.messageType !== "MESSAGE") {
            const bidAmountMatch = receivedMessage.message.match(/([\d,]+)(?=원에 입찰하였습니다\.)/);
            if (bidAmountMatch) {
              const bidAmount = Number(bidAmountMatch[1].replace(/,/g, ''));
              setHighestBid(bidAmount);
              setHighestBidder({
                nickname: receivedMessage.nickname,
                imageUrl: receivedMessage.imageUrl,
              })
            }
          }
          setTimeout(() => {
            if (scrollRef.current) {
              scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: "smooth",
              });
            }
          }, 100);
        });

        setStompClient(client); // ✅ stompClient 상태 업데이트
      },
      onStompError: (frame) => {
        console.error("❌ WebSocket Error:", frame);
      },
    });

    client.activate();

    return () => {
      if (client.connected) {
        client.deactivate();
      }
      setStompClient(null); // ✅ 연결 해제 시 상태 초기화
    };
  }, [isLogin, item, auctionItemId]);

  const sendMessage = () => {
    if (!message.trim()) return;
    if (message.length > 50) {
      alert("메시지 크기는 50자 이내로 부탁드려요");
      return;
    }
    if (!isLogin) {
      alert("로그인이 필요합니다.");
      return;
    }
    if (!stompClient) {
      alert("웹소켓 연결이 없습니다.");
      return;
    }
    const now = Date.now();

    // 500ms 이내에 같은 메시지 전송 방지
    if (now - lastSendTime.current < 500) return;

    try {
      stompClient.publish({
        destination: `/ws/pub/chats/${auctionItemId}`,
        body: JSON.stringify({ message }),
      });
      setMessage("");
    } catch (error) {
      console.error("🚨 메시지 전송 오류:", error);
      alert("메시지 전송 중 오류가 발생했습니다.");
    }    
  };

  const handleBidClick = (increment) => {
    if (!isLogin) {
      alert("로그인이 필요합니다.");
      return;
    }
    setSelectedBid(highestBid + increment);
    setIsModalOpen(true);
  };

  const confirmBid = async () => {
    if (highestBidder?.nickname === context.user.nickname) {
      alert("이미 최고가 입찰자입니다.");
      setIsModalOpen(false);
      return;
    }
  
    const response = await placeBid(auctionItemId, selectedBid);
    if (response.success) {
      setIsModalOpen(false);
      alert("입찰 성공!");
    } else {
      alert(response.message);
      setIsModalOpen(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <>
    <BackButton/>
    {item && (
          <AuctionItemInfo>
            <ItemImage src={getProfileImageSrc(item.imageUrl)} alt={item.name} />
            <ItemDetails>
              <ItemName>{item.name}</ItemName>
              <ItemMeta>시작 금액: {item.startPrice.toLocaleString()}원</ItemMeta>
            </ItemDetails>
            <ItemDetails>
              <ItemMeta>경매시작: {formatDate(new Date(item.startTime))}</ItemMeta>
              <ItemMeta>경매종료: {formatDate(new Date(item.endTime))}</ItemMeta>
            </ItemDetails>
          </AuctionItemInfo>
        )}
    <Container>
    <AuctionContainer>
      <ChatContainer>
      {/* 채팅 영역 */}
      <ChatSection ref={scrollRef}>
        {chatMessages.map((msg, index) => {
          const isMe = msg.nickname === context.user.nickname;
          return (
            (isMe || msg.messageType !== "ERROR") && <ChatMessage key={index} isMe={isMe}>
              <ChatMessageBottom isMe={isMe}>
                <ProfileImage src={getProfileImageSrc(msg.imageUrl)} alt="profile" />
                <Bubble isMe={isMe} messageType={msg.messageType}>{msg.message}</Bubble>
              </ChatMessageBottom>
              <MessageInfo isMe={isMe}>
                <span>{msg.nickname}</span>
                <span>·</span>
                <span>{formatDate(new Date(msg.sendDateTime))}</span>
              </MessageInfo>
            </ChatMessage>
            );
          })}
        </ChatSection>

        {/* 메시지 입력 */}
        <ChatInputContainer>
          <ChatInput
            type="text"
            placeholder={context.user.nickname === item.seller.nickname ? "판매자는 채팅을 입력할 수 없습니다." : "메시지를 입력하세요"}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyUp={(e) => e.key === "Enter" && sendMessage()}
            readOnly={context.user.nickname === item.seller.nickname}
          />
          <SendButton onClick={sendMessage} disabled={context.user.nickname === item.seller.nickname}>전송</SendButton>
        </ChatInputContainer>
      </ChatContainer>

      <BiddingSection>
      <TimerText timeLeft={parseInt(timeLeft.split(":")[2]) + parseInt(timeLeft.split(":")[1]) * 60 + parseInt(timeLeft.split(":")[0]) * 60 * 60}>{timeLeft}</TimerText>
        {highestBidder && <HighestBidderContainer isMe={highestBidder.nickname === context.user.nickname}>
          <span>현재 최고 입찰자: </span>
          <div>
            <ProfileImage src={getProfileImageSrc(highestBidder.imageUrl)} alt="최고 입찰자 프로필" />
            <HighestBidderText>{highestBidder.nickname}</HighestBidderText>
          </div>
          <PriceText>{highestBid.toLocaleString()}원</PriceText>
        </HighestBidderContainer>}
        {bidIncrements.map((increment, i) => (
          <BidButton key={increment} onClick={() => handleBidClick(increment)} disabled={!isLogin} tier={i + 1}>
            +{increment.toLocaleString()}
          </BidButton>
        ))}
      </BiddingSection>
    </AuctionContainer>
    </Container>
    {/* 입찰 모달 */}
    {isModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <h3>입찰 금액을 확인해 주세요</h3>
            <p>낙찰 이후에 취소하면 불이익이 있을 수 있습니다.</p>
            <PriceText>{selectedBid.toLocaleString()}원</PriceText>
            <ButtonGroup>
              <button onClick={() => setIsModalOpen(false)}>취소</button>
              <button onClick={confirmBid}>입찰</button>
            </ButtonGroup>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

export default AuctionBid;