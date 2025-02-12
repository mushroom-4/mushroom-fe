import styled from "styled-components";
import Layout from "../components/Layout";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  font-size: 24px;
  color: ${(props) => props.theme.colors.darkGray};
`;

const Home = () => {
  return (
    <Layout>
      <Wrapper>
        <h2>홈 페이지입니다!</h2>
      </Wrapper>
    </Layout>
  );
};

export default Home;