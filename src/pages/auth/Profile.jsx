import { useEffect, useState } from "react";
import styled from "styled-components";
import { updateUserInfo, updateUserPassword } from "../../api/auth";
import { useAuth } from "../../context/AuthContext";
import defaultProfileImage from "../../assets/default-profile-select.png";
import { useNavigate } from "react-router-dom";

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
  width: 350px;
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
  border-radius: 50%;
  border: 2px dashed ${(props) => props.theme.colors.gray};
  cursor: pointer;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid ${(props) => props.theme.colors.gray};
  font-size: 14px;
`;

const Button = styled.button`
  background-color: ${(props) => props.theme.colors.darkGray};
  color: white;
  padding: 10px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 16px;
`;

const Profile = () => {
  const navigate = useNavigate();
  const context = useAuth();
  const [nickname, setNickname] = useState(context.user.nickname || "");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(context.user.imageUrl || defaultProfileImage);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    setNickname(context.user.nickname || "");
    setImagePreview(context.user.imageUrl || defaultProfileImage);
  }, [context.user]);

  // 프로필 이미지 변경
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  // 닉네임 & 프로필 이미지 업데이트
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nickname", nickname);
    if (image) {
      formData.append("image", image);
    }

    const response = await updateUserInfo(formData);
    if (response.success) {
      alert("프로필 정보가 수정되었습니다.");
      context.login(response.data.bearerToken);
      navigate(0);
    } else {
      alert(response.message);
    }
  };

  // 비밀번호 변경 요청
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      alert("비밀번호를 입력해주세요.");
      return;
    }

    const response = await updateUserPassword({ oldPassword, newPassword });
    if (response.success) {
      alert("비밀번호가 변경되었습니다.");
      setOldPassword("");
      setNewPassword("");
    } else {
      alert(response.message);
    }
  };

  return (
    <Wrapper>
      <Form onSubmit={handleProfileUpdate}>
        <FileLabel htmlFor="imageUpload">
          <img src={imagePreview} alt="프로필 이미지" />
        </FileLabel>
        <FileInput id="imageUpload" type="file" onChange={handleImageChange} />

        <Input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="닉네임" required />
        <Button type="submit">프로필 수정</Button>
      </Form>

      <Form onSubmit={handlePasswordChange}>
        <Input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} placeholder="현재 비밀번호" required />
        <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="새 비밀번호" required />
        <Button type="submit">비밀번호 변경</Button>
      </Form>
    </Wrapper>
  );
};

export default Profile;