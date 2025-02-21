import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import mainLogo from "../assets/mainLogo.png";
import backgroundImage from "../assets/background.png";
import defaultProfile from "../assets/default-profile.png"; // 기본 프로필 이미지
import searchIcon from "../assets/icon-search.svg";



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
  z-index: 998;
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

const SearchImg = styled.img`
  background: none;
  border: none;
  cursor: pointer;
  margin-left: 1rem;

  width: 25px;
  height: 25px;
  filter: invert(30%);
  -webkit-user-drag: none;

  &:hover {
    opacity: 0.7;
  }
`;

const SearchContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  width: 300px;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  background: white;
  padding: 10px;
  border-radius: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  opacity: ${(props) => (props.visible ? 1 : 0)};
  transform: ${(props) => (props.visible ? "translate(-50%, -50%)" : "translate(-50%, -60%)")};
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
  z-index: ${(props) => (props.visible ? '999' : '-1')};
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  padding: 8px;
  font-size: 16px;
  border-radius: 10px;
  background: ${(props) => props.theme.colors.lightGray};
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
  const [searchOpen, setSearchOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);


  const handleLogout = () => {
    context.logout();
    alert("로그아웃되었습니다.");
    navigate("/");
  };

  const handleSearch = () => {
    if (keyword.trim()) {
      const currentParams = new URLSearchParams(window.location.search);
  
      if (currentParams.has("keyword")) {
        currentParams.set("keyword", encodeURIComponent(keyword));
      } else {
        currentParams.append("keyword", encodeURIComponent(keyword));
      }
  
      navigate(`/?${currentParams.toString()}`);
      setSearchOpen(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current && !searchRef.current.contains(event.target) && 
        event.target !== document.getElementById("search-button") 
      ) {
        setSearchOpen(false);
      }
    };

    if (searchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchOpen]);

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
                <SearchImg onClick={() => setSearchOpen(!searchOpen)} id="search-button" src={searchIcon} alt="검색" />
                {context.user.userRole === "ADMIN" && <StyledLink to="/admin">관리자 물품 관리</StyledLink>}
                <ProfileContainer ref={dropdownRef} onClick={() => setDropdownOpen(!dropdownOpen)}>
                  <ProfileImage src={context.user.imageUrl || defaultProfile} alt="프로필" hover />
                  {dropdownOpen && (
                    <DropdownMenu>
                      <DropdownItem onClick={() => navigate("/profile")} dark><ProfileImage src={context.user.imageUrl || defaultProfile} alt="프로필" /><strong>{context.user.nickname}</strong></DropdownItem>
                      <DropdownItem onClick={() => navigate("/notices")}>공지 사항</DropdownItem>
                      <DropdownItem onClick={() => navigate("/wishlist")}>관심있는 물품</DropdownItem>
                      <DropdownItem onClick={() => navigate("/registrations")}>물품 관리</DropdownItem>
                      <DropdownItem onClick={() => navigate("/bids")}>입찰 내역 관리</DropdownItem>
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
      <SearchContainer ref={searchRef} visible={searchOpen}>
        <SearchInput
          type="text"
          placeholder="검색어 입력..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyUp={handleKeyPress}
        />
        <SearchImg onClick={handleSearch} src={searchIcon} alt="검색" />
      </SearchContainer>
      <HeaderDummy />
      <Section>
        <Outlet />
      </Section>
    </Container>
  );
};

export default Layout;