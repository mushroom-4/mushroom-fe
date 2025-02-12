import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import backgroundImage from "../assets/background.png";

const Container = styled.div`
  position: relative;
  width: 100%;
  min-height: 100vh;
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url(${backgroundImage});
    background-size: cover;
    background-position: center;
    opacity: 7%;
    z-index: -1;
  }
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: ${(props) => props.theme.colors.gray};
  color: white;
  position: absolute;
  width: 100%;
  box-shadow: 0 0 10px ${(props) => props.theme.colors.gray};
  z-index: 999;
`;

const HeaderDummy = styled.div`
  height: 80px;
  width: 100%;
`;

const Nav = styled.nav`
  display: flex;
  gap: 16px;
`;

const StyledLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 16px;
  display: flex;
  align-items: center;

  &:hover {
    color: ${(props) => props.theme.colors.darkGray};
  }
`;

const HomeLogoLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 24px;
  
  &:hover {
    color: ${(props) => props.theme.colors.darkGray};
  }
`;

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const context = useAuth();

  const handleLogout = () => {
    context.logout();
    alert("로그아웃되었습니다.");
    navigate("/");
  };

  return (
    <Container>
      <Header>
        <HomeLogoLink to="/">멋이룸</HomeLogoLink>
        <Nav>
          {context.isAuthenticated ? (
            <>
              <StyledLink to="/mypage">마이페이지</StyledLink>
              <button onClick={handleLogout}>로그아웃</button>
            </>
          ) : (
            <>
              <StyledLink to="/login">로그인</StyledLink>
              <StyledLink to="/register">회원가입</StyledLink>
            </>
          )}
        </Nav>
      </Header>
      <HeaderDummy />
      {children}
    </Container>
  );
};

export default Layout;