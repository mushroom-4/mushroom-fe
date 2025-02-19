import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  font-size: 24px;
  color: ${(props) => props.theme.colors.darkGray};
`;

const Notices = () => {

  return (
    <Wrapper>
      <h2>공지 목록을 보는 페이지 입니다.</h2>
    </Wrapper>
  );
};

export default Notices;
