import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { fetchBidHistory } from "../../api/bid";
import defaultImage from "../../assets/background.png";
import {IMAGE_BASE_URL} from "../../config";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const Container = styled.div`
  max-width: 800px;
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

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Card = styled.div`
  display: flex;
  align-items: center;
  padding: 12px;
  border: 1px solid ${(props) => props.theme.colors.lightGray};
  color: ${(props) =>
    props.status === "SUCCEED" ? "#155724" :
    props.status === "FAILED" ? "#721c24" :
    props.status === "BIDDING" ? "#856404" :
    props.status === "PAYMENT_COMPLETED" ? "#004085" :
    "#333"};
  background: ${(props) =>
    props.status === "SUCCEED" ? "#d4edda" :
    props.status === "FAILED" ? "#f8d7da" :
    props.status === "BIDDING" ? "#fff3cd" :
    props.status === "PAYMENT_COMPLETED" ? "#cce5ff" :
    "#eee"};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const ImageWrapper = styled.div`
  width: 80px;
  height: 80px;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Info = styled.div`
  flex: 1;
  margin-left: 12px;
`;

const ItemName = styled.h3`
  margin: 0;
  font-size: 16px;
`;

const BidInfo = styled.p`
  margin: 4px 0;
  font-size: 14px;
  color: ${(props) => props.theme.colors.darkGray};
`;

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

const NoBidMessage = styled.p`
  text-align: center;
  color: ${(props) => props.theme.colors.darkGray};
  font-size: 16px;
`;

const BidHistory = () => {
  const navigate = useNavigate();
  const [bids, setBids] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBidHistory = async () => {
      const response = await fetchBidHistory(currentPage);
      if (response.success) {
        setBids(response.data.content);
        setTotalPages(response.data.page.totalPages);
      }
      setLoading(false);
    };

    loadBidHistory();
  }, [currentPage]);

  if (loading) return <LoadingSpinner />;

  return (
    <Container>
      <Title>입찰 내역</Title>
      <List>
        bids.length === 0 ? (<NoBidMessage>입찰 내역이 없습니다.</NoBidMessage>) :(
        {bids.map((bid) => (
          <Card key={bid.bidId} onClick={() => navigate(`/bids/${bid.bidId}`)} status={bid.biddingStatus} >
            <ImageWrapper>
              <Image src={bid.searchAuctionItemRes.imageUrl ? `${IMAGE_BASE_URL}${bid.searchAuctionItemRes.imageUrl}` : defaultImage} alt={bid.searchAuctionItemRes.name} />
            </ImageWrapper>
            <Info>
              <ItemName>{bid.searchAuctionItemRes.name}</ItemName>
              <BidInfo>입찰가: {bid.biddingPrice.toLocaleString()}원</BidInfo>
              <BidInfo>상태: {bid.biddingStatus}</BidInfo>
            </Info>
          </Card>
        ))})
      </List>

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
    </Container>
  );
};

export default BidHistory;
