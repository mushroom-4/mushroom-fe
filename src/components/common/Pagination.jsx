import { useState } from "react";
import styled from "styled-components";

const PaginationWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  gap: 10px;
`;

const PageButton = styled.button`
  padding: 8px 12px;
  border: none;
  cursor: pointer;
  background: ${(props) => props.theme.colors.darkGray};
  color: white;
  border-radius: 5px;

  &:disabled {
    background: #bbb;
    cursor: not-allowed;
  }
`;

const PageInput = styled.input`
  width: 50px;
  text-align: center;
  padding: 5px;
  font-size: 14px;
  border: 1px solid ${(props) => props.theme.colors.gray};
  border-radius: 5px;
  outline: none;
`;

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const [inputPage, setInputPage] = useState(currentPage);

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setInputPage(value); // 숫자만 입력 가능
    }
  };

  const handlePageSubmit = (e) => {
    if (e.key === "Enter") {
      const newPage = parseInt(inputPage, 10);
      if (newPage >= 1 && newPage <= totalPages) {
        onPageChange(newPage);
      } else {
        setInputPage(currentPage); // 유효하지 않은 값이면 원래 값으로 복구
      }
    }
  };

  return (
    <PaginationWrapper>
      <PageButton
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        이전
      </PageButton>
      <PageInput
        type="text"
        value={inputPage}
        onChange={handleInputChange}
        onKeyDown={handlePageSubmit}
        placeholder={`${currentPage}`}
      />
      <span>/ {totalPages}</span>
      <PageButton
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        다음
      </PageButton>
    </PaginationWrapper>
  );
};

export default Pagination;
