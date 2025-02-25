import defaultProfileImage from "../assets/default-profile.png";
import { IMAGE_BASE_URL } from "../config";

export const getProfileImageSrc = (imageUrl) => {
  return imageUrl ? (imageUrl.startsWith("http") ? imageUrl : `${IMAGE_BASE_URL}${imageUrl}`)
  : defaultProfileImage;
}