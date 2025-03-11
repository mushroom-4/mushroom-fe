import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { login } from '../../api/auth';

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

const Button = styled.button`
  background-color: ${(props) => props.theme.colors.darkGray};
  color: white;
  padding: 8px 16px;
  border: none;
  cursor: pointer;
`;

const Login = () => {
  const navigate = useNavigate();
  const context = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // localStorage에서 회원가입한 정보 가져오기
    const storedUser = JSON.parse(localStorage.getItem("userInfo"));
    if (storedUser) {
      setForm({ email: storedUser.email, password: storedUser.password });
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await login(form.email, form.password);
    if (data.success) {
      context.login(data.data.bearerToken);
      localStorage.setItem("userInfo", JSON.stringify(form));
      alert("로그인 성공");
      navigate("/");
    } else {
      alert(data.message);
    }
  };


  return (
      <Wrapper>
        <Form onSubmit={handleSubmit}>
          <Input type="email" name="email" value={form.email} placeholder="이메일" onChange={handleChange} required />
          <InputContainer>
            <Input type={showPassword ? "text" : "password"} placeholder="비밀번호" name="password" value={form.password} onChange={handleChange} required />
            <ToggleButton type="button" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? "👁️" : "🙈"}
            </ToggleButton>
          </InputContainer>
          <Button type="submit">로그인</Button>
        </Form>
      </Wrapper>
  );
};

export default Login;
