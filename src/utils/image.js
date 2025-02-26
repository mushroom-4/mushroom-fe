import defaultProfileImage from "../assets/default-profile.png";
import defaultItemImage from "../assets/default-item.png";
import { IMAGE_BASE_URL } from "../config";

export const getProfileImageSrc = (imageUrl) => {
  return imageUrl ? (imageUrl.startsWith("http") ? imageUrl : `${IMAGE_BASE_URL}${imageUrl}`)
  : defaultProfileImage;
}

export const getItemImageSrc = (imageUrl) => {
  return imageUrl ? (imageUrl.startsWith("http") ? imageUrl : `${IMAGE_BASE_URL}${imageUrl}`)
  : defaultItemImage;
}