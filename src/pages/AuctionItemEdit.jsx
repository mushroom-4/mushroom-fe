import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { fetchAuctionItemDetail, updateAuctionItem, deleteAuctionItem } from "../api/auctionRegistration";
import { IMAGE_BASE_URL } from "../api/auctionRegistration";

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

const Textarea = styled.textarea`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
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
  background-color: ${(props) => props.primary ? props.theme.colors.darkGray : "white"};
  color: ${(props) => props.primary ? "white" : props.theme.colors.darkGray};
  border: ${(props) => props.primary ? "none" : `1px solid ${props.theme.colors.darkGray}`};

  &:hover {
    background-color: ${(props) => props.primary ? props.theme.colors.gray : "#eee"};
  }
`;

const ImagePreview = styled.img`
  width: 100%;
  height: auto;
  margin-bottom: 10px;
  border-radius: 8px;
`;

const AuctionItemEdit = () => {
  const { auctionItemId } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [formData, setFormData] = useState(new FormData());
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const loadItem = async () => {
      const response = await fetchAuctionItemDetail(auctionItemId);
      if (response.success) {
        setItem(response.data);
        const initialFormData = new FormData();
        initialFormData.set("name", response.data.name);
        initialFormData.set("description", response.data.description);
        initialFormData.set("auctionItemSize", response.data.size);
        initialFormData.set("auctionItemCategory", response.data.category);
        initialFormData.set("brand", response.data.brand);
        initialFormData.set("startPrice", response.data.startPrice);
        initialFormData.set("startTime", response.data.startTime);
        initialFormData.set("endTime", response.data.endTime);
        setFormData(initialFormData);

        if (response.data.imageUrl) {
          setImagePreview(`${IMAGE_BASE_URL}${response.data.imageUrl}`);
        }
      } else {
        alert(response.message);
      }
    };

    loadItem();
  }, [auctionItemId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    formData.set(name, value);
    setFormData(formData);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    formData.set("image", file);
    setFormData(formData);

    // 이미지 미리보기 설정
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    const response = await updateAuctionItem(auctionItemId, formData);
    if (response.success) {
      alert("경매 아이템이 수정되었습니다.");
      navigate("/registrations");
    } else {
      alert(response.message);
    }
  };

  const handleDelete = async () => {
    const response = await deleteAuctionItem(auctionItemId);
    if (response.success) {
      alert("경매 아이템이 삭제되었습니다.");
      navigate("/registrations");
    } else {
      alert(response.message);
    }
  };

  if (!item) return <p>로딩 중...</p>;

  return (
    <Container>
      <Title>경매 아이템 수정</Title>
      <Input type="file" name="image" onChange={handleImageChange} />
      {imagePreview && <ImagePreview src={imagePreview} alt="Preview" />}
      <Input type="text" name="name" defaultValue={item.name} onChange={handleInputChange} />
      <Textarea name="description" defaultValue={item.description} onChange={handleInputChange} />
      <Input type="text" name="auctionItemSize" defaultValue={item.size} onChange={handleInputChange} />
      <Input type="text" name="auctionItemCategory" defaultValue={item.category} onChange={handleInputChange} />
      <Input type="text" name="brand" defaultValue={item.brand} onChange={handleInputChange} />
      <Input type="number" name="startPrice" defaultValue={item.startPrice} onChange={handleInputChange} />
      <Input type="datetime-local" name="startTime" defaultValue={item.startTime} onChange={handleInputChange} />
      <Input type="datetime-local" name="endTime" defaultValue={item.endTime} onChange={handleInputChange} />
      
      <ButtonGroup>
        <Button onClick={handleDelete}>삭제</Button>
        <Button primary onClick={handleSubmit}>수정</Button>
      </ButtonGroup>
    </Container>
  );
};

export default AuctionItemEdit;