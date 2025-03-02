"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import useSampleImages from "./hooks/useSampleImage";
import { useImageContext } from "../context/ImageContextProvider";
import useCloudinaryUpload from "./hooks/useCloudinaryUpload"; // Import Hook
import { MdAdd } from "react-icons/md";

const Page = () => {
  const { images: sampleImages, error, setError } = useSampleImages(4);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { addImage } = useImageContext();
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
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => console.error("Autoplay failed:", error));
    }
  }, []);
  return (
    <div className=" min-h-screen p-0 flex items-start w-full md:w-11/12  lg:w-9/12 mx-auto overflow-hidden flex-col lg:flex-row bg-white justify-center">
      {/* top - left*/}
      <div className=" flex-1 flex flex-col sm:flex-col items-center  md:flex-row lg:flex-col p-0 lg:px-10 overflow-hidden  w-full ">
        <video ref={videoRef} src="/video.mp4" className=" rounded-3xl mb-5 object-cover mx-auto" height={400} width={400} muted autoPlay playsInline></video>
        <div className="">
          <h1 className="text-2xl  sm:w-full w-1/2 md:text-[40px] lg:text-[60px] text-center md:text-left m-auto text-[#454545] font-bold leading-[1]">
            Remove Image Background
          </h1>
          <p className="text-gray-400 text-lg lg:text-2xl mt-2 font-semibold text-center md:text-left">100% Automatically and Free</p>
        </div>

      </div>
      {/* right - bottom*/}
      <div className=" flex flex-1 p-0 items-center flex-col justify-center w-full px-5">
        {/* Drag & Drop Upload */}
        <div className="hidden lg:block h-28">
        </div>
        <div onDragOver={(e) => e.preventDefault()}
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
          className="w-full rounded-xl flex items-center justify-center flex-col  lg:h-96 lg:w-96 lg:shadow-2xl"
        >
          <label className="text-2xl px-6 w-full lg:w-9/12 py-2 mb-2 bg-blue-600 text-white rounded-full text-center cursor-pointer hover:bg-blue-700 transition">
            {uploading ? "Uploading..." : "Upload Image"}
            <input type="file" className="hidden" onChange={handleFileChange} />
          </label>
          {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
          <p className="hidden text-gray-500 text-xl font-bold lg:block">or drop a file,</p>
          <p className="text-sm text-gray-600 hidden lg:block">
            Paste image from
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
          <p className="text-gray-500 text-sm text-center font-bold mb-2">No image? Try one of these.</p>
          <div className="flex gap-4 items-center justify-center">
            {loading
              ? [1, 2, 3, 4].map((_, index) => (
                <div className="w-12 h-12 md:w-12 md:h-12 lg:w-20 lg:h-20 bg-gray-300" key={index}></div>
              ))
              : sampleImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Sample ${index + 1}`}
                  className="w-12 h-12 md:w-16 md:h-16 lg:h-20 lg:w-20 object-cover rounded-xl cursor-pointer border"
                  onClick={() => {
                    addImage(img);
                    router.push("/editing");
                  }}
                />
              ))}
          </div>
          {error && <p className="absolute top-10 bg-gray-500 px-3 py-1 w-[96%] text-white right-[2%] text-lg font-bold">{error}
            <MdAdd onClick={() => setError(null)} className="absolute top-1 right-1 bg-white rotate-45 text-lg text-gray-600 font-bold  rounded-full" />
          </p>}
        </div>
      </div>
    </div>
  );
};

export default Page;
