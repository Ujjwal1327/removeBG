"use client";

import { useState } from "react";

const useCloudinaryUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const uploadImage = async (file) => {
    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "upload_image"); // Set in Cloudinary

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dswknbbgz/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      if (data.secure_url) {
        return data.secure_url; // Return uploaded image URL
      } else {
        setError("Upload failed. Try again.");
        return null;
      }
    } catch (err) {
      setError("Error uploading image.");
      console.error("Upload Error:", err);
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { uploadImage, uploading, error };
};

export default useCloudinaryUpload;
