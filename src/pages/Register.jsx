import { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { register } from '../api/auth';
import { useAuth } from '../context/AuthContext';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const Form = styled.form`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px ${(props) => props.theme.colors.gray};
`;

const Input = styled.input`
  display: block;
  width: 100%;
  margin-bottom: 10px;
  padding: 8px;
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await register(form.nickname, form.email, form.password);
    if (data.success) {
      context.login(data.data.bearerToken);
      alert("회원가입 성공");
      navigate("/");
    } else {
      alert(data.message);
    }
  };

  return (
    <Layout>
      <Wrapper>
        <Form onSubmit={handleSubmit}>
          <Input type="text" name="nickname" placeholder="닉네임" onChange={handleChange} required />
          <Input type="email" name="email" placeholder="이메일" onChange={handleChange} required />
          <Input type="password" name="password" placeholder="비밀번호" onChange={handleChange} required />
          <Button type="submit">회원가입</Button>
        </Form>
      </Wrapper>
    </Layout>
  );
};

export default Register;