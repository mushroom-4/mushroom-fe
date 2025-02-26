import styled from "styled-components";

const PaginationWrapper = styled.div`
  display: flex;
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

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <PaginationWrapper>
      <PageButton
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        이전
      </PageButton>
      <span>{currentPage} / {totalPages}</span>
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
