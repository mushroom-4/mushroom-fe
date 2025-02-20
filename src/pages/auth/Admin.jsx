import styled from "styled-components";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  font-size: 24px;
  color: ${(props) => props.theme.colors.darkGray};
`;

const Admin = () => {
  const navigate = useNavigate();
  const context = useAuth();

  if (context.user.userRole !== "ADMIN") {
    alert("관리자만 접근 가능합니다!");
    navigate("/");
  }

  return (
    <Wrapper>
      <h2>어드민만 들어올 수 있는 페이지 입니다.</h2>
    </Wrapper>
  );
};

export default Admin;
