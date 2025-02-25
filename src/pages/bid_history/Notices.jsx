import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { fetchUserNotices } from "../../api/auctionItem";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const NoticeContainer = styled.div`
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 16px;
  text-align: center;
`;

const NoticeList = styled.ul`
  list-style: none;
  padding: 0;
`;

const NoticeItem = styled.li`
  background: ${(props) => props.theme.colors.lightGray};
  padding: 14px 16px;
  border-radius: 8px;
  margin-bottom: 10px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s ease-in-out;
  
  &:hover {
    background: ${(props) => props.theme.colors.gray};
  }
`;

const NoNoticeMessage = styled.p`
  text-align: center;
  color: ${(props) => props.theme.colors.darkGray};
  font-size: 16px;
`;

const Notices = () => {
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNotices = async () => {
      const response = await fetchUserNotices();
      if (response.success) {
        setNotices(response.data);
      }
      setLoading(false);
    };

    loadNotices();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <NoticeContainer>
      <Title>📭 공지사항</Title>
      {notices.length === 0 ? (
        <NoNoticeMessage>공지가 없습니다.</NoNoticeMessage>
      ) : (
        <NoticeList>
          {notices.map(({ noticeId, message, auctionItemId }) => (
            <NoticeItem key={noticeId} onClick={() => navigate(`/auction/${auctionItemId}`)}>
              {message}
            </NoticeItem>
          ))}
        </NoticeList>
      )}
    </NoticeContainer>
  );
};

export default Notices;
