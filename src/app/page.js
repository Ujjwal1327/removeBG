"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useSampleImages from "./hooks/useSampleImage";
import { useImageContext } from "../context/ImageContextProvider";
import useCloudinaryUpload from "./hooks/useCloudinaryUpload"; // Import Hook

const Page = () => {
  const { images: sampleImages, error  } = useSampleImages(5);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { addImage  } = useImageContext();
  const { uploadImage, uploading, error: uploadError } = useCloudinaryUpload(); // Hook Usage

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = await uploadImage(file); // Cloudinary Upload via Hook
      if (imageUrl) {
        addImage(imageUrl);
        router.push("/editing");
      }
    }
  };

  useEffect(() => {
    if (sampleImages.length > 0) {
      console.log("hello")
      setLoading(false);
    }
  }, [sampleImages, setLoading]);

  return (
    <div className="border-2 bg-white border-red-600 min-h-[100vh] flex items-center flex-col justify-center">
      {/* Drag & Drop Upload */}
      <div  onDragOver={(e) => e.preventDefault()}
        onDrop={async (e) => {
          e.preventDefault();
          const file = e.dataTransfer.files[0];
          if (file) {
            const imageUrl = await uploadImage(file);
            if (imageUrl) {
              addImage(imageUrl);
              router.push("/editing");
            }
          }
        }}
        className="w-96 h-96 bg-white shadow-2xl rounded-lg flex items-center justify-center flex-col"
      >
        <label className="text-2xl px-6 py-4 mb-10 bg-blue-600 text-white rounded-lg shadow-md cursor-pointer hover:bg-blue-700 transition">
          {uploading ? "Uploading..." : "Upload Image"}
          <input type="file" className="hidden" onChange={handleFileChange} />
        </label>
        {uploadError && <p className="text-red-600">{uploadError}</p>}
        <p className="text-gray-500 text-xl font-bold">or drop a file,</p>
        <p className="text-sm text-gray-600">
          Paste image from{" "}
          <span
            className="underline text-blue-600 cursor-pointer"
            onClick={async () => {
              const url = prompt("Enter Image URL:");
              if (url) {
                addImage(url);
                router.push("/editing");
              }
            }}
          >
            URL
          </span>
        </p>
      </div>

      {/* Sample Images */}
      <div className="mt-4">
        <p className="text-gray-500 text-xl font-bold mb-2">No image? Try one of these.</p>
        <div className="flex gap-2">
          {loading
            ? [1, 2, 3, 4, 5].map((_, index) => (
              <div className="w-20 h-20 bg-gray-300" key={index}></div>
            ))
            : sampleImages.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Sample ${index + 1}`}
                className="w-20 h-20 object-cover rounded-lg cursor-pointer border"
                onClick={() => {
                  addImage(img);
                  router.push("/editing");
                }}
              />
            ))}
        </div>
        <p className="text-lg text-red-700 font-bold">{error}</p>
      </div>
    </div>
  );
};

export default Page;
