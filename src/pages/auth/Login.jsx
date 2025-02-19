import { useState } from 'react';
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

const Input = styled.input`
  display: block;
  width: 300px;
  padding: 8px;
  border-radius: 10px;
  outline: none;
  border: 1px solid ${(props) => props.theme.colors.gray};
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await login(form.email, form.password);
    if (data.success) {
      context.login(data.data.bearerToken);
      alert("로그인 성공");
      navigate("/");
    } else {
      alert(data.message);
    }
  };


  return (
      <Wrapper>
        <Form onSubmit={handleSubmit}>
          <Input type="email" name="email" placeholder="이메일" onChange={handleChange} required />
          <Input type="password" name="password" placeholder="비밀번호" onChange={handleChange} required />
          <Button type="submit">로그인</Button>
        </Form>
      </Wrapper>
  );
};

export default Login;
