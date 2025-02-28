import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Button = styled.div`
  position: absolute;
  top: -1.5rem;
  left: 2.5rem;
  display: block;
  padding: 0;
  border-radius: 0;
  border: none;
  width: 20px;
  height: 20px;
  outline: none;
  rotate: -45deg;
  background: none;
  z-index: 5;
  
  border-top: 5px solid ${(props) => props.theme.colors.gray};
  border-left: 5px solid ${(props) => props.theme.colors.gray};
  transform: translateY(-50%);
  cursor: pointer;
  
  &:hover {
    border-color: ${(props) => props.theme.colors.darkGray};
  }
`;

const BackButton = () => {
  const navigate = useNavigate();
  return <Button onClick={() => navigate(-1)}/>
}


export default BackButton;