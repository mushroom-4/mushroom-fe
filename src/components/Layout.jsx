import styled from "styled-components";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import backgroundImage from "../assets/background.png";
import mainLogo from "../assets/mainLogo.png";

const Container = styled.div`
  position: relative;
  width: 100%;
  min-height: 100vh;

  &::before {
    content: "";
    position: fixed;
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
  &::after {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: white;
    z-index: -2;
  }
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: ${(props) => props.theme.colors.lightGray};
  position: fixed;
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

const Section = styled.section`
  margin: 0 auto;
  max-width: 1100px;
  padding: 0 0 20px;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  font-size: 16px;
  display: flex;
  align-items: center;
  color: black;

  &:hover {
    color: ${(props) => props.theme.colors.gray};
  }
`;

const HomeLogoLink = styled(Link)`
  text-decoration: none;
  font-size: 24px;
  display: flex;
  
  &:hover {
    color: ${(props) => props.theme.colors.gray};
  }
`;

const LogoImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 10%;
`;

const StyledText = styled.span`
  font-size: 16px;
  display: flex;
  align-items: center;
`;

const Layout = () => {
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
      <HomeLogoLink to="/">
          <LogoImage src={mainLogo} alt="멋이룸" />
        </HomeLogoLink>
        <Nav>
          {context.isAuthenticated ? (
            <>
              <StyledLink to="/registrations">경매물품 관리</StyledLink>
              <StyledLink to="/bids">입찰내역 확인</StyledLink>
              <button onClick={handleLogout}>로그아웃</button>
              <StyledText>이름: {context.user.nickname}</StyledText>
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
      <Section>
        <Outlet />
      </Section>
    </Container>
  );
};

export default Layout;