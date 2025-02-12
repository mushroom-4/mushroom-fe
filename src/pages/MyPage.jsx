import styled from "styled-components";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  font-size: 24px;
  color: ${(props) => props.theme.colors.darkGray};
`;

const MyPage = () => {
  const { nickname } = useAuth();

  return (
    <Layout>
      <Wrapper>
        <h2>{nickname}님의 마이페이지 입니다.</h2>
      </Wrapper>
    </Layout>
  );
};

export default MyPage;