import { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { register } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';
import defaultProfileImage from "../../assets/default-profile-select.png";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const Form = styled.form`
  background-color: white;
  padding: 30px 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px ${(props) => props.theme.colors.gray};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const Input = styled.input`
  display: block;
  width: 300px;
  padding: 8px;
  border-radius: 10px;
  outline: none;
  border: 1px solid ${(props) => props.theme.colors.gray};
`;

const FileInput = styled.input`
  display: none;
`;

const FileLabel = styled.label`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 150px;
  height: 150px;
  border-radius: 100%;
  border: 2px dashed ${(props) => props.theme.colors.gray};
  cursor: pointer;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;


const Button = styled.button`
  background-color: ${(props) => props.theme.colors.darkGray};
  color: white;
  padding: 8px 16px;
  border: none;
  cursor: pointer;
`;

const Register = () => {
  const navigate = useNavigate();
  const context = useAuth();
  const [form, setForm] = useState({ nickname: "", email: "", password: "" });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(defaultProfileImage);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setImage(file);

    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(form).forEach((key) => formData.append(key, form[key]));
    if (image) {
      formData.append("image", image);
    }
    formData.append("userRole", "USER");
    
    const data = await register(formData);
    if (data.success) {
      context.login(data.data.bearerToken);
      alert("회원가입 성공");
      navigate("/");
    } else {
      alert(data.message);
    }
  };

  return (
    <Wrapper>
      <Form onSubmit={handleSubmit}>
        <FileLabel htmlFor="imageUpload">
          <img src={imagePreview} alt="프로필 이미지" />
        </FileLabel>
        <FileInput id="imageUpload" type="file" onChange={handleImageChange} />

        <Input type="text" name="nickname" placeholder="닉네임" onChange={handleChange} required />
        <Input type="email" name="email" placeholder="이메일" onChange={handleChange} required />
        <Input type="password" name="password" placeholder="비밀번호" onChange={handleChange} required />
        <Button type="submit">회원가입</Button>
      </Form>
    </Wrapper>
  );
};

export default Register;
