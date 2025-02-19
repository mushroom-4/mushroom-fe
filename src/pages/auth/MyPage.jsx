import styled from "styled-components";
import { useAuth } from "../../context/AuthContext";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  font-size: 24px;
  color: ${(props) => props.theme.colors.darkGray};
`;

const MyPage = () => {
  const { user } = useAuth();

  return (
    <Wrapper>
      <h2>{user.nickname}님의 마이페이지 입니다.</h2>
      <img src={user.imageUrl} alt="profileImage"/>
    </Wrapper>
  );
};

export default MyPage;
