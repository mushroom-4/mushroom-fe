import styled from "styled-components";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { fetchAdminAuctionItems, setStatusAdminAuctionItems } from "../../api/auctionItem";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { getItemImageSrc } from "../../utils/image";
import Pagination from "../../components/common/Pagination";

const Container = styled.div`
  max-width: 1200px;
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

const FilterContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 10px;
`;

const FilterButton = styled.button`
  padding: 8px 12px;
  font-size: 14px;
  border: 1px solid ${(props) => props.theme.colors.gray};
  border-radius: 5px;
  cursor: pointer;
  background-color: ${(props) =>
    props.status === "PROGRESSING" ? "#28a745" :
    props.status === "INSPECTING" ? "#ffc107" :
    props.status === "WAITING" ? "#a663c5" :
    props.status === "REJECTED" ? "#dc3545" :
    props.status === "COMPLETED" ? "#007bff" :
    "#ff8400"};
    color: white;
    opacity: ${(props) => props.active ? "1" : "0.3"};
  
  &:hover {
    opacity: 0.6;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
`;

const Th = styled.th`
  padding: 12px;
  background-color: ${(props) => props.theme.colors.darkGray};
  color: white;
  text-align: left;
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #ddd;
  text-align: left;
`;

const TableRow = styled.tr`
  transition: background 0.2s ease-in-out;
  
  &:hover {
    background: #f7f7f7;
  }
`;

const Image = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`;

const Status = styled.span`
  padding: 4px 8px;
  border-radius: 5px;
  font-size: 12px;
  font-weight: bold;
  color: white;
  background-color: ${(props) =>
    props.status === "PROGRESSING" ? "#28a745" :
    props.status === "INSPECTING" ? "#ffc107" :
    props.status === "WAITING" ? "#a663c5" :
    props.status === "REJECTED" ? "#dc3545" :
    props.status === "COMPLETED" ? "#007bff" :
    "#ff8400"};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 5px;
  margin-top: 5px;
`;

const Button = styled.button`
  padding: 6px 10px;
  font-size: 14px;
  border: 1px solid ${(props) => (props.reject ? props.theme.colors.darkGray : props.theme.colors.lightGray)};
  border-radius: 5px;
  cursor: pointer;
  color: ${(props) => (props.reject ? props.theme.colors.darkGray : props.theme.colors.lightGray)};
  background-color: ${(props) => (props.reject ? props.theme.colors.lightGray : props.theme.colors.darkGray)};

  &:hover {
    opacity: 0.8;
  }
`;

const Admin = () => {
  const statusList = ["INSPECTING", "REJECTED", "WAITING", "PROGRESSING", "COMPLETED", "NON_TRADED"];
  const navigate = useNavigate();
  const context = useAuth();
  const [auctionItems, setAuctionItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState(["INSPECTING"]);

  if (context.user.userRole !== "ADMIN") {
    alert("관리자만 접근 가능합니다!");
    navigate("/");
  }

  useEffect(() => {
    fetchAuctionItems(currentPage, statusFilter);
  }, [currentPage, statusFilter]);

  const fetchAuctionItems = async (page, status) => {
    setLoading(true);
    const response = await fetchAdminAuctionItems(page, status);
    setAuctionItems(response.data.content);
    setTotalPages(response.data.page.totalPages);
    setLoading(false);
  };

  const handleAction = async (id, action) => {
    const response = await setStatusAdminAuctionItems(id, action);
    if (response.success) {
      alert(action === "approve" ? "승인되었습니다!" : "거절되었습니다!");
      fetchAuctionItems(currentPage, statusFilter);
    } 
    else {
      alert(response.message);
    }
  };

  const handleStatusToggle = (status) => {
    setStatusFilter((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  return (
    <Container>
      <Title>📌 경매 물품 관리</Title>

      <FilterContainer>
        {statusList.map((status) => (
          <FilterButton
            key={status}
            active={statusFilter.includes(status)}
            onClick={() => handleStatusToggle(status)}
            status={status}
          >
            {status}
          </FilterButton>
        ))}
      </FilterContainer>

      {loading ? (
          <LoadingSpinner />
      ) : (
        <>
          <Table>
            <thead>
              <tr>
                <Th>이미지</Th>
                <Th>상품명</Th>
                <Th>사이즈</Th>
                <Th>카테고리</Th>
                <Th>브랜드</Th>
                <Th>시작가</Th>
                <Th>시작 시간</Th>
                <Th>종료 시간</Th>
                <Th>상태</Th>
              </tr>
            </thead>
            <tbody>
              {auctionItems.map((item) => (
                <TableRow key={item.auctionItemId}>
                  <Td>
                    <Image
                      src={getItemImageSrc(item.imageUrl)}
                      alt={item.name}
                      onClick={() => navigate(`/auction/${item.auctionItemId}`)}
                    />
                  </Td>
                  <Td>{item.name}</Td>
                  <Td>{item.size}</Td>
                  <Td>{item.category}</Td>
                  <Td>{item.brand}</Td>
                  <Td>{item.startPrice.toLocaleString()}원</Td>
                  <Td>{new Date(item.startTime).toLocaleString("ko-KR")}</Td>
                  <Td>{new Date(item.endTime).toLocaleString("ko-KR")}</Td>
                  <Td>
                    {
                      item.status === "INSPECTING" ? (
                        <ActionButtons>
                          <Button onClick={() => handleAction(item.auctionItemId, "approve")}>승인</Button>
                          <Button reject onClick={() => handleAction(item.auctionItemId, "reject")}>거절</Button>
                        </ActionButtons>
                      ) 
                      : <Status status={item.status}>{item.status}</Status>
                    }
                  </Td>
                </TableRow>
              ))}
            </tbody>
          </Table>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </Container>);
};

export default Admin;
