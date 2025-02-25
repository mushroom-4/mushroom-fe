import styled from "styled-components";

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px; /* 적당한 높이 지정 */
  
  &::after {
    content: "";
    width: 40px;
    height: 40px;
    border: 5px solid ${(props) => props.theme.colors.gray};
    border-top-color: ${(props) => props.theme.colors.darkGray};
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

export default LoadingSpinner;