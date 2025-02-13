import { useEffect, useState } from "react";
import styled from "styled-components";
import { fetchAuctionItems } from "../api/auctionItem";
import Layout from "../components/Layout";
import defaultImage from "../assets/background.png";

const IMAGE_BASE_URL = "https://yeim-vpc-bucket-240130.s3.ap-northeast-2.amazonaws.com/public/";

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
`;

const Title = styled.h3`
  font-size: 16px;
  font-weight: bold;
  margin: 0;
`;

const Description = styled.p`
  font-size: 14px;
  color: ${(props) => props.theme.colors.darkGray};
  margin: 4px 0 8px;
`;

const Price = styled.p`
  font-size: 14px;
  font-weight: bold;
  color: black;
  margin: 4px 0;
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
  margin-top: 20px;
  gap: 8px;
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
  const [auctionItems, setAuctionItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const loadAuctionItems = async () => {
      const data = await fetchAuctionItems(currentPage);
      setAuctionItems(data.content);
      setTotalPages(data.page.totalPages);
    };

    loadAuctionItems();
  }, [currentPage]);

  return (
    <Layout>
      <Container>
        {auctionItems.map((item) => (
          <Card key={item.auctionItemId}>
            <ImageWrapper>
              <Image
                src={item.imageUrl ? `${IMAGE_BASE_URL}${item.imageUrl}` : defaultImage}
                alt={item.name}
              />
            </ImageWrapper>
            <Content>
              <Timestamp>{new Date(item.startTime).toLocaleString("ko-KR")} 시작</Timestamp>
              <Title>{item.brand}</Title>
              <Description>{item.name}</Description>
              <Price>{item.startPrice.toLocaleString()}원</Price>
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
    </Layout>
  );
};

export default Home;