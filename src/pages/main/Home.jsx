import { useEffect, useState } from "react";
import styled from "styled-components";
import { fetchAuctionItems } from "../../api/auctionItem";
import defaultImage from "../../assets/background.png";
import { useNavigate } from "react-router-dom";
import {IMAGE_BASE_URL} from "../../config";

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 10px;
  justify-content: center;
`;

const Card = styled.div`
  width: 200px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background: white;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: all 0.3s ease-in-out; /* ✅ 부드러운 효과 */

  &:hover {
    transform: translateY(-5px); /* ✅ 약간 위로 이동 */
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2); /* ✅ 그림자 강조 */
  }
`;

const ImageWrapper = styled.div`
  width: 100%;
  height: 140px;
  background-color: ${(props) => props.theme.colors.lightGray};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Content = styled.div`
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: start;
`;

const Title = styled.h3`
  font-size: 16px;
  font-weight: bold;
`;

const Description = styled.p`
  font-size: 14px;
  color: ${(props) => props.theme.colors.darkGray};
`;

const Price = styled.p`
  font-size: 14px;
  font-weight: bold;
  color: black;
`;

const Status = styled.p`
  font-size: 12px;
  padding: 2px 5px;
  border-radius: 5px;

  color: ${(props) => props.status !== "WAITING" ? props.theme.colors.lightGray : props.theme.colors.darkGray};
  background-color: ${(props) => props.status === "WAITING" ? props.theme.colors.lightGray : props.theme.colors.darkGray};
`;

const Timestamp = styled.p`
  font-size: 12px;
  color: gray;
  margin: 4px 0;
`;

/** ✅ 페이지네이션 UI 스타일 */
const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: 20px;
`;

const PageButton = styled.button`
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  cursor: pointer;
  background-color: ${(props) => (props.active ? props.theme.colors.darkGray : "white")};
  color: ${(props) => (props.active ? "white" : props.theme.colors.darkGray)};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: ${(props) => props.theme.colors.gray};
    color: white;
  }
`;

const Home = () => {
  const navigate = useNavigate();
  const [auctionItems, setAuctionItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  

  useEffect(() => {
    const loadAuctionItems = async () => {
      const response = await fetchAuctionItems(currentPage);
      setAuctionItems(response.data.content);
      setTotalPages(response.data.page.totalPages);
    };

    loadAuctionItems();
  }, [currentPage]);

  return (
    <>
      <Container>
        {auctionItems.map((item) => (
          <Card key={item.auctionItemId} onClick={() => navigate(`/auction/${item.auctionItemId}`)}>
            <ImageWrapper>
              <Image
                src={item.imageUrl ? `${IMAGE_BASE_URL}${item.imageUrl}` : defaultImage}
                alt={item.name}
              />
            </ImageWrapper>
            <Content>
              {
                item.status === "WAITING"
                ? <Timestamp>{new Date(item.startTime).toLocaleString("ko-KR")} <strong>시작</strong></Timestamp>
                : <Timestamp>{new Date(item.endTime).toLocaleString("ko-KR")} <strong>종료</strong></Timestamp>
              }
              
              <Title>{item.name}</Title>
              <Description>브랜드: {item.brand}</Description>
              <Price>{item.startPrice.toLocaleString()}원</Price>
              <Status status={item.status}>{item.status}</Status>
            </Content>
          </Card>
        ))}
      </Container>

      <Pagination>
        {[...Array(totalPages)].map((_, index) => (
          <PageButton
            key={index + 1}
            onClick={() => setCurrentPage(index + 1)}
            active={index + 1 === currentPage}
          >
            {index + 1}
          </PageButton>
        ))}
      </Pagination>
    </>
  );
};

export default Home;
