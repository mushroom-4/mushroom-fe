import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { fetchAuctionItemDetail, placeBid } from "../../api/auctionItem";
import { getToken, isAuthenticated } from "../../utils/auth";
import { API_BASE_URL } from "../../config";

const Container = styled.div`
  display: flex;
  gap: 20px;
  max-width: 1000px;
  margin: 40px auto;
  padding: 20px;
`;

const ChatSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  max-height: 500px;
  overflow-y: auto;
`;

const ChatMessage = styled.div`
  padding: 8px;
  margin-bottom: 5px;
  border-radius: 5px;
  background: ${(props) => (props.isBid ? "#f0f8ff" : "#eee")};
  color: ${(props) => (props.isBid ? "#007bff" : "black")};
`;

const ChatInput = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-top: 5px;
`;

const BiddingSection = styled.div`
  flex: 1;
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
`;

const PriceText = styled.p`
  font-size: 24px;
  font-weight: bold;
`;

const BidButton = styled.button`
  width: 100%;
  padding: 10px;
  margin: 5px 0;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  background-color: ${(props) => props.theme.colors.darkGray};
  color: white;
  transition: background 0.2s ease-in-out;
  
  &:hover {
    background-color: ${(props) => props.theme.colors.gray};
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

const AuctionBid = () => {
  const { auctionItemId } = useParams();
  const isLogin = isAuthenticated();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [highestBid, setHighestBid] = useState(0);
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [stompClient, setStompClient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBid, setSelectedBid] = useState(0);
  const lastSendTime = useRef(0);

  useEffect(() => {
    const loadAuctionItemDetail = async () => {
      setLoading(true);
      const response = await fetchAuctionItemDetail(auctionItemId);
      if (response.success) {
        setItem(response.data);
        setHighestBid(response.data.bid ? response.data.bid.maxPrice : response.data.startPrice);
      }
      setLoading(false);
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
          if (receivedMessage.isBid) {
            setHighestBid(receivedMessage.bidAmount);
          }
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
      alert("입찰 내역이 없으셔서 채팅을 하실 수 없습니다.");
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
    const response = await placeBid(auctionItemId, selectedBid);
    if (response.success) {
      setIsModalOpen(false);
      alert("입찰 성공!");
    } else {
      alert(response.message);
      setIsModalOpen(false);
    }
  };

  if (loading) return <p>로딩 중...</p>;

  return (
    <Container>
      {/* 채팅 영역 */}
      <ChatSection>
        {chatMessages.map((msg, index) => (
          <ChatMessage key={index} isBid={msg.isBid}>
            <strong>{msg.nickname}:</strong> {msg.message}
          </ChatMessage>
        ))}
        <ChatInput
          type="text"
          placeholder="메시지를 입력하세요"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyUp={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />
      </ChatSection>

      {/* 입찰 영역 */}
      <BiddingSection>
        <p>현재 최고 입찰 금액</p>
        <PriceText>{highestBid.toLocaleString()}원</PriceText>
        <BidButton onClick={() => handleBidClick(500)} disabled={!isLogin}>+500</BidButton>
        <BidButton onClick={() => handleBidClick(1000)} disabled={!isLogin}>+1,000</BidButton>
        <BidButton onClick={() => handleBidClick(2000)} disabled={!isLogin}>+2,000</BidButton>
      </BiddingSection>

      {/* 입찰 모달 */}
      {isModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <h3>입찰 금액을 확인해 주세요</h3>
            <p>입찰 취소 시 불이익이 있을 수 있습니다.</p>
            <PriceText>{selectedBid.toLocaleString()}원</PriceText>
            <ButtonGroup>
              <button onClick={() => setIsModalOpen(false)}>취소</button>
              <button onClick={confirmBid}>입찰</button>
            </ButtonGroup>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default AuctionBid;