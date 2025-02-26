import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { fetchAuctionItemDetail, updateAuctionItem, deleteAuctionItem } from "../../api/auctionRegistration";
import { getItemImageSrc } from "../../utils/image";

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
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    auctionItemSize: "S",
    auctionItemCategory: "TOP",
    brand: "",
    startPrice: "",
    startTime: "",
    endTime: "",
  });

  const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL", "FREE"];
  const categoryOptions = ["SHOES", "TOP", "BOTTOM", "OUTER", "BAG", "ACCESSORIES", "ETC"];

  useEffect(() => {
    const loadItem = async () => {
      const response = await fetchAuctionItemDetail(auctionItemId);
      if (response.success) {
        setItem(response.data);

        setFormData({
          name: response.data.name,
          description: response.data.description,
          auctionItemSize: response.data.size,
          auctionItemCategory: response.data.category,
          brand: response.data.brand,
          startPrice: response.data.startPrice,
          startTime: new Date(response.data.startTime).toISOString().slice(0, 16),
          endTime: new Date(response.data.endTime).toISOString().slice(0, 16),
        });

        if (response.data.imageUrl) {
          setImagePreview(getItemImageSrc(response.data.imageUrl));
        }
      } else {
        alert(response.message);
      }
    };

    loadItem();
  }, [auctionItemId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));

      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedFormData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      updatedFormData.append(key, value);
    });

    const response = await updateAuctionItem(auctionItemId, updatedFormData);
    if (response.success) {
      alert("경매 아이템이 수정되었습니다.");
      navigate("/registrations");
    } else {
      alert(response.message);
    }
  };

  const handlePriceChange = (e) => {
    let value = Number(e.target.value);
    
    setFormData((prev) => ({ ...prev, startPrice: value }));
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
    <Form onSubmit={handleSubmit}>
      <Title>경매 아이템 수정</Title>

      <Label>이미지</Label>
      <Input type="file" name="image" onChange={handleImageChange} />
      {imagePreview && <ImagePreview src={imagePreview} alt="Preview" />}

      <Label>상품명</Label>
      <Input type="text" name="name" value={formData.name} onChange={handleInputChange} required />

      <Label>설명</Label>
      <Input type="text" name="description" value={formData.description} onChange={handleInputChange} />

      <Label>사이즈</Label>
      <Select name="auctionItemSize" value={formData.auctionItemSize} onChange={handleInputChange}>
        {sizeOptions.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </Select>

      <Label>카테고리</Label>
      <Select name="auctionItemCategory" value={formData.auctionItemCategory} onChange={handleInputChange}>
        {categoryOptions.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </Select>

      <Label>브랜드</Label>
      <Input type="text" name="brand" value={formData.brand} onChange={handleInputChange} required />

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
      <Input type="datetime-local" name="startTime" value={formData.startTime} onChange={handleInputChange} required />

      <Label>종료 시간</Label>
      <Input type="datetime-local" name="endTime" value={formData.endTime} onChange={handleInputChange} required />

      <ButtonGroup>
        <Button type="button" onClick={handleDelete}>
          삭제
        </Button>
        <Button type="submit" primary>
          수정
        </Button>
      </ButtonGroup>
    </Form>
  );
};

export default AuctionItemEdit;
