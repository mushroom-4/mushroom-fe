import { useEffect, useState } from "react";
import styled from "styled-components";
import { fetchAuctionItems } from "../../api/auctionItem";
import defaultImage from "../../assets/background.png";
import { useNavigate, useSearchParams } from "react-router-dom";
import {IMAGE_BASE_URL} from "../../config";
import filterIcon from "../../assets/icon-filter.svg";

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 10px;
  justify-content: center;
`;

const FilterToggleButton = styled.button`
  position: fixed;
  top: 100px;
  right: 16px;
  background: transparent;
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  cursor: pointer;
  z-index: 1000;
  transition: 0.3s;

  &:hover {
    opacity: 0.7;
  }

  img {
    width: 32px;
    height: 32px;
    filter: invert(30%);
  }
`;

const FilterContainer = styled.div`
  position: fixed;
  top: 0;
  right: ${(props) => (props.visible ? "0" : "-320px")};
  width: 300px;
  height: 100%;
  background: white;
  box-shadow: -3px 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 100px 20px 20px;
  transition: right 0.3s ease-in-out;
  z-index: 997;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
`;

const FilterLabel = styled.label`
  font-size: 12px;
  color: ${(props) => props.theme.colors.darkGray};
  margin-bottom: 4px;
`;

const FilterInput = styled.input`
  padding: 8px;
  font-size: 14px;
  border: 1px solid ${(props) => props.theme.colors.gray};
  border-radius: 5px;
  width: 120px;
`;

const FilterSelect = styled.select`
  padding: 8px;
  font-size: 14px;
  border: 1px solid ${(props) => props.theme.colors.gray};
  border-radius: 5px;
  width: 140px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
`;

const FilterButton = styled.button`
  padding: 8px 14px;
  font-size: 14px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: ${(props) => props.dark ? props.theme.colors.darkGray : props.theme.colors.lightGray};
  color: ${(props) => !props.dark ? props.theme.colors.darkGray : props.theme.colors.lightGray};
  transition: 0.2s ease-in-out;

  &:hover {
    background-color: ${(props) => props.theme.colors.gray};
  }
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
  const [searchParams, setSearchParams] = useSearchParams();
  const [auctionItems, setAuctionItems] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    brand: searchParams.get("brand") || "",
    category: searchParams.get("category") || "",
    size: searchParams.get("size") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    startDate: searchParams.get("startDate") || "",
    endDate: searchParams.get("endDate") || "",
    page: searchParams.get("page") || "1",
  });
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const toggleFilter = () => setIsFilterVisible((prev) => !prev);

  useEffect(() => {
    if (!searchParams.has("page")) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("page", "1");
  
      setFilters((prev) => ({ ...prev, page: "1" }));
      setSearchParams(newParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    const fetchItems = async () => {
      const response = await fetchAuctionItems(Object.fromEntries(searchParams));
      if (response.success) {
        setAuctionItems(response.data.content);
        setTotalPages(response.data.page.totalPages);
      }
    };
    fetchItems();
  }, [searchParams]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage.toString(),
    }));
    const newParams = new URLSearchParams({ ...filters, page: newPage.toString() });
    setSearchParams(newParams);
  };

  const handleSearch = () => {
    const newParams = new URLSearchParams(filters);
    setSearchParams(newParams);
  };

  const resetFilters = () => {
    setFilters({
      brand: "",
      category: "",
      size: "",
      minPrice: "",
      maxPrice: "",
      startDate: "",
      endDate: "",
      page: "1",
    });
    setSearchParams(new URLSearchParams());
  };

  return (
    <>
    {/* 필터 열기 버튼 */}
    <FilterToggleButton onClick={toggleFilter}>
      <img src={filterIcon} alt="필터" />
    </FilterToggleButton>
    {/* 필터 UI */}
    <FilterContainer visible={isFilterVisible}>
        <FilterGroup>
          <FilterLabel>브랜드</FilterLabel>
          <FilterInput
            type="text"
            placeholder="브랜드"
            value={filters.brand}
            onChange={(e) => handleFilterChange("brand", e.target.value)}
          />
        </FilterGroup>
        <FilterGroup>
          <FilterLabel>카테고리</FilterLabel>
          <FilterSelect value={filters.category} onChange={(e) => handleFilterChange("category", e.target.value)}>
            <option value="">전체</option>
            <option value="SHOES">신발</option>
            <option value="TOP">상의</option>
            <option value="BOTTOM">하의</option>
            <option value="OUTER">아우터</option>
            <option value="BAG">가방</option>
            <option value="ACCESSORIES">액세서리</option>
            <option value="ETC">기타</option>
          </FilterSelect>
        </FilterGroup>
        <FilterGroup>
          <FilterLabel>사이즈</FilterLabel>
          <FilterSelect value={filters.size} onChange={(e) => handleFilterChange("size", e.target.value)}>
            <option value="">전체</option>
            <option value="XS">XS</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
            <option value="XXL">XXL</option>
            <option value="FREE">FREE</option>
          </FilterSelect>
        </FilterGroup>
        <FilterGroup>
          <FilterLabel>최소 가격</FilterLabel>
          <FilterInput
            type="number"
            placeholder="최소 가격"
            value={filters.minPrice}
            step="1000"
            min="0"
            onChange={(e) => handleFilterChange("minPrice", e.target.value)}
          />
        </FilterGroup>
        <FilterGroup>
          <FilterLabel>최대 가격</FilterLabel>
          <FilterInput
            type="number"
            placeholder="최대 가격"
            value={filters.maxPrice}
            step="10000"
            min="0"
            onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
          />
        </FilterGroup>
        <FilterGroup>
          <FilterLabel>시작 날짜</FilterLabel>
          <FilterInput
            type="date"
            value={filters.startDate}
            onChange={(e) => handleFilterChange("startDate", e.target.value)}
          />
        </FilterGroup>
        <FilterGroup>
          <FilterLabel>종료 날짜</FilterLabel>
          <FilterInput
            type="date"
            value={filters.endDate}
            onChange={(e) => handleFilterChange("endDate", e.target.value)}
          />
        </FilterGroup>
        <ButtonGroup>
          <FilterButton onClick={handleSearch} dark>필터링</FilterButton>
          <FilterButton onClick={resetFilters}>초기화</FilterButton>
        </ButtonGroup>
      </FilterContainer>
      {/* 경매 아이템 리스트 */}
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

      {/* 페이지네이션 */}
      <Pagination>
        {[...Array(totalPages)].map((_, index) => (
          <PageButton
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}  // ✅ 페이지 변경 함수 호출
            active={index + 1 === parseInt(searchParams.get("page") || "1", 10)}
          >
            {index + 1}
          </PageButton>
        ))}
      </Pagination>
    </>
  );
};

export default Home;
