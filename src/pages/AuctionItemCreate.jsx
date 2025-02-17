import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { createAuctionItem } from "../api/auctionRegistration";

const Form = styled.form`
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

const Label = styled.label`
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 5px;
  display: block;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
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

  // 🔹 일반 입력 필드 상태
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    auctionItemSize: "M",
    auctionItemCategory: "TOP",
    brand: "",
    startPrice: 1000,
    startTime: getFutureTime(10),
    endTime: getFutureTime(20),
  });

  const [image, setImage] = useState(null);

  // 🔹 옵션 목록
  const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL", "FREE"];
  const categoryOptions = ["SHOES", "TOP", "BOTTOM", "OUTER", "BAG", "ACCESSORIES", "ETC"];

  function getFutureTime(minutes) {
    const date = new Date();
    date.setMinutes(date.getMinutes() + minutes);
  
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutesStr = String(date.getMinutes()).padStart(2, "0");
  
    return `${year}-${month}-${day}T${hours}:${minutesStr}`;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]); // 개별적으로 이미지 상태 저장
  };

  const handlePriceChange = (e) => {
    let value = Number(e.target.value);
    
    setFormData((prev) => ({ ...prev, startPrice: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔹 새로운 FormData 객체 생성
    const form = new FormData();
    Object.keys(formData).forEach((key) => form.append(key, formData[key]));
    if (image) {
      form.append("image", image);
    }

    const response = await createAuctionItem(form);

    if (response.success) {
      alert("경매 아이템이 등록되었습니다.");
      navigate("/registrations");
    } else {
      alert(response.message);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Title>경매 아이템 등록</Title>

      <Label>이미지</Label>
      <Input type="file" name="image" onChange={handleImageChange} />
      
      <Label>상품명</Label>
      <Input type="text" name="name" placeholder="필수" value={formData.name} onChange={handleInputChange} required />
      
      <Label>설명</Label>
      <Input type="text" name="description" value={formData.description} onChange={handleInputChange} />
      
      <Label>사이즈</Label>
      <Select name="auctionItemSize" value={formData.auctionItemSize} onChange={handleInputChange}>
        {sizeOptions.map((size) => (
          <option key={size} value={size}>{size}</option>
        ))}
      </Select>
      
      <Label>카테고리</Label>
      <Select name="auctionItemCategory" value={formData.auctionItemCategory} onChange={handleInputChange}>
        {categoryOptions.map((category) => (
          <option key={category} value={category}>{category}</option>
        ))}
      </Select>

      <Label>브랜드</Label>
      <Input type="text" name="brand" placeholder="필수" value={formData.brand} onChange={handleInputChange} required/>
      
      <Label>시작 가격</Label>
      <Input
        type="number"
        name="startPrice"
        value={formData.startPrice}
        onChange={handlePriceChange}
        step="1000"
        min="1000"
        required
      />
      
      <Label>시작 시간</Label>
      <Input 
        type="datetime-local" 
        name="startTime" 
        value={formData.startTime} 
        onChange={handleInputChange}
        required
      />
      
      <Label>종료 시간</Label>
      <Input 
        type="datetime-local" 
        name="endTime" 
        value={formData.endTime} 
        onChange={handleInputChange}
        required
      />

      <ButtonGroup>
        <Button type="button" onClick={() => navigate("/registrations")}>취소</Button>
        <Button type="submit" primary>등록</Button>
      </ButtonGroup>
    </Form>
  );
};

export default AuctionItemCreate;