import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { fetchRegisteredAuctionItems } from "../api/auctionRegistration";
import defaultImage from "../assets/background.png";
import {IMAGE_BASE_URL} from "../config";

const Container = styled.div`
  padding: 20px;
`;

const List = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
`;

const Card = styled.div`
  width: 220px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background: white;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }
`;

const Image = styled.img`
  width: 100%;
  height: 140px;
  object-fit: cover;
`;

const Content = styled.div`
  padding: 12px;
`;

const Title = styled.h3`
  font-size: 16px;
  font-weight: bold;
`;

const Status = styled.p`
  font-size: 14px;
  color: ${(props) => props.theme.colors.darkGray};
`;

const FloatingButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: ${(props) => props.theme.colors.darkGray};
  color: white;
  padding: 12px 20px;
  border-radius: 30px;
  font-size: 16px;
  font-weight: bold;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;

  &:hover {
    background-color: ${(props) => props.theme.colors.gray};
    transform: scale(1.05);
  }
`;

const AuctionRegistrationList = () => {
  const navigate = useNavigate();
  const [auctionItems, setAuctionItems] = useState([]);

  useEffect(() => {
    const loadAuctionItems = async () => {
      const response = await fetchRegisteredAuctionItems();
      if (response.success) {
        setAuctionItems(response.data.content);
      } else {
        // alert(response.message);
      }
    };

    loadAuctionItems();
  }, []);

  return (
    <Container>
      <h2>등록된 경매 물품</h2>
      <List>
        {auctionItems.map((item) => (
          <Card key={item.auctionItemId} onClick={() => navigate(`/auction/${item.auctionItemId}/edit`)}>
            <Image src={item.imageUrl ? `${IMAGE_BASE_URL}${item.imageUrl}` : defaultImage} alt={item.name} />
            <Content>
              <Title>{item.brand} - {item.name}</Title>
              <Status>상태: {item.auctionItemStatus}</Status>
            </Content>
          </Card>
        ))}
      </List>
      <FloatingButton onClick={() => navigate("/auction/create")}>경매 등록하기</FloatingButton>
    </Container>
  );
};

export default AuctionRegistrationList;