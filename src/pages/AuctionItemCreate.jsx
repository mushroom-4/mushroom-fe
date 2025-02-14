import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { createAuctionItem } from "../api/auctionRegistration";

const Container = styled.div`
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 5px;
  display: block;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 10px 16px;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background-color: ${(props) => (props.primary ? props.theme.colors.darkGray : "white")};
  color: ${(props) => (props.primary ? "white" : props.theme.colors.darkGray)};
  border: ${(props) => (props.primary ? "none" : `1px solid ${props.theme.colors.darkGray}`)};

  &:hover {
    background-color: ${(props) => (props.primary ? props.theme.colors.gray : "#eee")};
  }
`;

const AuctionItemCreate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(new FormData());

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    formData.set(name, value);
    setFormData(formData);
  };

  const handleImageChange = (e) => {
    formData.set("image", e.target.files[0]);
    setFormData(formData);
  };

  const handleSubmit = async () => {
    const response = await createAuctionItem(formData);
    if (response.success) {
      alert("경매 아이템이 등록되었습니다.");
      navigate("/registrations");
    } else {
      alert(response.message);
    }
  };

  return (
    <Container>
      <Title>경매 아이템 등록</Title>
      <Label>이미지</Label>
      <Input type="file" name="image" onChange={handleImageChange} />
      
      <Label>상품명</Label>
      <Input type="text" name="name" onChange={handleInputChange} />
      
      <Label>설명</Label>
      <Input type="text" name="description" onChange={handleInputChange} />
      
      <Label>사이즈</Label>
      <Input type="text" name="auctionItemSize" onChange={handleInputChange} />
      
      <Label>카테고리</Label>
      <Input type="text" name="auctionItemCategory" onChange={handleInputChange} />
      
      <Label>브랜드</Label>
      <Input type="text" name="brand" onChange={handleInputChange} />
      
      <Label>시작 가격</Label>
      <Input type="number" name="startPrice" onChange={handleInputChange} />
      
      <Label>시작 시간</Label>
      <Input type="datetime-local" name="startTime" onChange={handleInputChange} />
      
      <Label>종료 시간</Label>
      <Input type="datetime-local" name="endTime" onChange={handleInputChange} />

      <ButtonGroup>
        <Button onClick={() => navigate("/registrations")}>취소</Button>
        <Button onClick={handleSubmit} primary>등록</Button>
      </ButtonGroup>
    </Container>
  );
};

export default AuctionItemCreate;