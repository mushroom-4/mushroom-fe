import { useState, useRef, useEffect, useCallback } from "react";
import styled from "styled-components";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import mainLogo from "../assets/mainLogo.png";
import backgroundImage from "../assets/default-item.png";
import searchIcon from "../assets/icon-search.svg";
import { fetchPopularKeywords } from "../api/auctionItem";
import { getProfileImageSrc } from "../utils/image";

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

const SearchContainer = styled.div`
  position: fixed;
  top: 30%;
  left: 50%;
  width: 320px;
  transform: translate(-50%, -50%);
  background: white;
  padding: 10px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  opacity: ${(props) => (props.visible ? 1 : 0)};
  transition: opacity 0.3s ease-in-out;
  z-index: ${(props) => (props.visible ? "999" : "-1")};
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid ${(props) => props.theme.colors.gray};
  border-radius: 8px;
  font-size: 16px;
`;

const PopularKeywordsContainer = styled.div`
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const KeywordTag = styled.button`
  background: ${(props) => props.theme.colors.lightGray};
  color: ${(props) => props.theme.colors.darkGray};
  border: none;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  
  &:hover {
    background: ${(props) => props.theme.colors.gray};
  }
`;

const SearchImg = styled.img`
  width: 28px;
  height: 28px;
  cursor: pointer;
  margin-left: 8px;
`;

const Section = styled.section`
  margin: 0 auto;
  max-width: 1100px;
  padding: 0 0 20px;
  position: relative;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  font-size: 18px;
  color: black;

  &:hover {
    color: ${(props) => props.theme.colors.gray};
  }
`;

const HomeLogoLink = styled(Link)`
  text-decoration: none;
  font-size: 24px;
  display: flex;
  align-items: center;
`;

const LogoImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 10%;
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
  const location = useLocation();
  const context = useAuth();
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [popularKeywords, setPopularKeywords] = useState([]);

  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);

  /** ✅ 로그아웃 핸들러 (useCallback으로 최적화) */
  const handleLogout = useCallback(() => {
    context.logout();
    alert("로그아웃되었습니다.");
    navigate("/");
  }, [context, navigate]);

  /** ✅ 검색 실행 (useCallback 적용) */
  const handleSearch = useCallback(
    (query) => {
      if (query.trim()) {
        const searchParams = new URLSearchParams(location.search);
        searchParams.set("keyword", query);
        navigate(`/?${searchParams.toString()}`);
        setSearchOpen(false);
      }
    },
    [navigate, location.search]
  );

  /** ✅ 검색어 변경 핸들러 */
  const handleInputChange = useCallback((e) => setKeyword(e.target.value), []);

  /** ✅ 인기 검색어 클릭 시 실행 */
  const handleKeywordClick = useCallback(
    (word) => {
      setKeyword(word);
      handleSearch(word);
    },
    [handleSearch]
  );

  /** ✅ 검색창 열릴 때 인기 검색어 가져오기 */
  useEffect(() => {
    if (!searchOpen) return;

    let isMounted = true;

    const getPopularKeywords = async () => {
      const response = await fetchPopularKeywords();
      if (response.success && isMounted) {
        setPopularKeywords(response.data);
      }
    };

    getPopularKeywords();

    return () => {
      isMounted = false;
    };
  }, [searchOpen]);

  /** ✅ 검색창 & 드롭다운 바깥 클릭 시 닫기 */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target) && event.target.id !== "search-button") {
        setSearchOpen(false);
        searchInputRef.current?.blur();
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /** ✅ 검색창이 열릴 때 자동 focus */
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [searchOpen]);

  return (
    <Container>
      {/* ✅ 헤더 */}
      <HeaderContainer>
        <Header>
          <HomeLogoLink to="/?page=1&status=PROGRESSING">
            <LogoImage src={mainLogo} alt="멋이룸" />
          </HomeLogoLink>
          <Nav>
            {/* ✅ "/" 경로에서만 검색 버튼 표시 */}
            {location.pathname === "/" && (
              <SearchImg id="search-button" src={searchIcon} alt="검색" onClick={() => setSearchOpen(!searchOpen)} />
            )}
            {context.isAuthenticated ? (
              <>
                {context.user.userRole === "ADMIN" && <StyledLink to="/admin">관리자 물품 관리</StyledLink>}
                <ProfileContainer ref={dropdownRef} onClick={() => setDropdownOpen(!dropdownOpen)}>
                  <ProfileImage src={getProfileImageSrc(context.user.imageUrl)} alt="프로필" hover />
                  {dropdownOpen && (
                    <DropdownMenu>
                      <DropdownItem onClick={() => navigate("/profile")} dark>
                        <ProfileImage src={getProfileImageSrc(context.user.imageUrl)} alt="프로필" />
                        <strong>{context.user.nickname}</strong>
                      </DropdownItem>
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

      {/* ✅ 검색창 */}
      <SearchContainer ref={searchRef} visible={searchOpen}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <SearchInput
              ref={searchInputRef}
              type="text"
              placeholder="검색어 입력..."
              value={keyword}
              onChange={handleInputChange}
              onKeyUp={(e) => e.key === "Enter" && handleSearch(keyword)}
            />
            <SearchImg src={searchIcon} alt="검색" onClick={() => handleSearch(keyword)} />
          </div>
          {/* ✅ 인기 검색어 */}
          {popularKeywords.length > 0 && (
            <PopularKeywordsContainer>
              {popularKeywords.map((word, index) => (
                <KeywordTag key={index} onClick={() => handleKeywordClick(word)}>
                  {word}
                </KeywordTag>
              ))}
            </PopularKeywordsContainer>
          )}
        </SearchContainer>

      <HeaderDummy />
      <Section>
        <Outlet />
      </Section>
    </Container>
  );
};

export default Layout;