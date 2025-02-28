import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { register } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';
import defaultProfileImage from "../../assets/default-profile-select.png";
import { generateEmail, generateNickname, generatePassword } from '../../utils/randomInfo';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const Notice = styled.p`
  font-size: 14px;
  color: red;
  text-align: center;
  max-width: 1000px;
  margin-bottom: 10px;
  white-space: nowrap;
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

const InputContainer = styled.div`
  position: relative;
  width: 300px;
`;

const Input = styled.input`
  display: block;
  width: 100%;
  padding: 8px;
  border-radius: 10px;
  outline: none;
  border: 1px solid ${(props) => props.theme.colors.gray};
`;

const ToggleButton = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
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
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // 랜덤한 값 자동 입력
    const randomNickname = generateNickname();
    const randomEmail = generateEmail(randomNickname);
    const randomPassword = generatePassword();
    setForm({ nickname: randomNickname, email: randomEmail, password: randomPassword });
  }, []);

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
      localStorage.setItem("userInfo", JSON.stringify(form));
      alert("회원가입 성공");
      navigate("/");
    } else {
      alert(data.message);
    }
  };

  return (
    <Wrapper>
      <Notice>이 서비스는 베타 서비스이며, 원활한 서비스 체험을 위해 가입 정보를 자동 생성합니다. <br/>생성된 가입 정보는 7일 뒤 자동 삭제됩니다.</Notice>
      <Form onSubmit={handleSubmit}>
        <FileLabel htmlFor="imageUpload">
          <img src={imagePreview} alt="프로필 이미지" />
        </FileLabel>
        <FileInput id="imageUpload" type="file" onChange={handleImageChange} />

        <Input type="text" name="nickname" placeholder="닉네임" value={form.nickname} onChange={handleChange} maxLength={10} required />
        <Input type="email" name="email" placeholder="이메일" value={form.email} onChange={handleChange} required />
        <InputContainer>
          <Input type={showPassword ? "text" : "password"} placeholder="비밀번호" name="password" value={form.password} onChange={handleChange} required />
          <ToggleButton type="button" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? "🙈" : "👁️"}
          </ToggleButton>
        </InputContainer>
        <Button type="submit">회원가입</Button>
      </Form>
    </Wrapper>
  );
};

export default Register;
