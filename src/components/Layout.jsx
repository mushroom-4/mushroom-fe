import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import mainLogo from "../assets/mainLogo.png";
import backgroundImage from "../assets/background.png";
import defaultProfile from "../assets/default-profile.png"; // 기본 프로필 이미지

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

const HeaderContainer = styled.div`
  background-color: ${(props) => props.theme.colors.lightGray};
  position: fixed;
  width: 100%;
  padding: 16px;
  box-shadow: 0 0 10px ${(props) => props.theme.colors.gray};
  z-index: 999;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1050px;
  margin: 0 auto;
`;

const HeaderDummy = styled.div`
  height: 100px;
  width: 100%;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 30px;
`;

const Section = styled.section`
  margin: 0 auto;
  max-width: 1100px;
  padding: 0 0 20px;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  font-size: 18px;
  color: black;
  -webkit-user-drag: none;

  &:hover {
    color: ${(props) => props.theme.colors.gray};
  }
`;

const HomeLogoLink = styled(Link)`
  text-decoration: none;
  font-size: 24px;
  display: flex;
  align-items: center;
  -webkit-user-drag: none;
`;

const LogoImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 10%;
  -webkit-user-drag: none;
`;

const ProfileContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const ProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid ${(props) => props.theme.colors.gray};
  -webkit-user-drag: none;
  &:hover {
    opacity: ${(props) => (props.hover ? "0.5" : "1")};
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 50px;
  right: 0;
  background: white;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
`;

const DropdownItem = styled.div`
  padding: 12px 16px;
  font-size: 14px;
  cursor: pointer;
  align-items: center;
  transition: background 0.5s;
  white-space: nowrap;
  background-color: ${(props) => (props.dark ? props.theme.colors.darkGray : "white")};
  color: ${(props) => (props.dark ? "white" : props.theme.colors.darkGray)};

  &:first-child {
    border-bottom: 1px solid ${(props) => props.theme.colors.lightGray};
    display: flex;
    align-items: center;
    gap: 10px;
  }

  &:hover {
    background: ${(props) => (props.dark ? props.theme.colors.gray : props.theme.colors.lightGray)};
  }
`;

const LogoutButton = styled(DropdownItem)`
  border-top: 1px solid ${(props) => props.theme.colors.lightGray};
  color: ${(props) => props.theme.colors.gray};
`;

const Layout = () => {
  const navigate = useNavigate();
  const context = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);


  const handleLogout = () => {
    context.logout();
    alert("로그아웃되었습니다.");
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  return (
    <Container>
      <HeaderContainer>
        <Header>
          <HomeLogoLink to="/">
            <LogoImage src={mainLogo} alt="멋이룸" />
          </HomeLogoLink>
          <Nav>
            {context.isAuthenticated ? (
              <>
                <StyledLink to="/search">검색</StyledLink>
                {context.user.userRole === "ADMIN" && <StyledLink to="/admin">관리자 물품 관리</StyledLink>}
                <ProfileContainer ref={dropdownRef} onClick={() => setDropdownOpen(!dropdownOpen)}>
                  <ProfileImage src={context.user.imageUrl || defaultProfile} alt="프로필" hover />
                  {dropdownOpen && (
                    <DropdownMenu>
                      <DropdownItem onClick={() => navigate("/profile")} dark><ProfileImage src={context.user.imageUrl || defaultProfile} alt="프로필" /><strong>{context.user.nickname}</strong></DropdownItem>
                      <DropdownItem onClick={() => navigate("/wishlist")}>관심있는 물품 보기</DropdownItem>
                      <DropdownItem onClick={() => navigate("/bids")}>입찰 내역 관리</DropdownItem>
                      <DropdownItem onClick={() => navigate("/registrations")}>경매 물품 관리</DropdownItem>
                      <DropdownItem onClick={() => navigate("/notices")}>공지 사항</DropdownItem>
                      <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
                    </DropdownMenu>
                  )}
                </ProfileContainer>
              </>
            ) : (
              <>
                <StyledLink to="/login">로그인</StyledLink>
                <StyledLink to="/register">회원가입</StyledLink>
              </>
            )}
          </Nav>
        </Header>
      </HeaderContainer>
      <HeaderDummy />
      <Section>
        <Outlet />
      </Section>
    </Container>
  );
};

export default Layout;