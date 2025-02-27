// import React, { useRef, useState, useEffect } from "react";
// import { Stage, Layer, Image, Rect } from "react-konva";

// const KonvaCanvas = () => {
//   const [image, setImage] = useState(null);
//   const imgRef = useRef(null);

//   useEffect(() => {
//     const loadImage = new window.Image();
//     loadImage.src = "https://images.unsplash.com/photo-1736173155834-6cd98d8dc9fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MTMyNjl8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDAzMzg2MTJ8&ixlib=rb-4.0.3&q=80&w=400"; // 🔄 Replace with your image URL
//     loadImage.crossOrigin = "Anonymous"; // To avoid CORS issues
//     loadImage.onload = () => setImage(loadImage);
//   }, []);

//   return (
//     <Stage  width={400} height={400}>
//       <Layer>
//         {/* Background Color Change */}
//         <Rect width={window.innerWidth} height={window.innerHeight} fill="purple" />
//         {/* Image */}
//         {image && <Image image={image} ref={imgRef} x={0} y={0} width={400} height={400} />}
//       </Layer>
//     </Stage>
//   );
// };

// export default KonvaCanvas;


"use client";
import React, { useState, useEffect } from "react";
import { Stage, Layer, Image, Rect, Group } from "react-konva";

const KonvaCanvas = () => {
  const [originalImage, setOriginalImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [wipeProgress, setWipeProgress] = useState(300); // Start from Right
  const [isWiping, setIsWiping] = useState(false);

  useEffect(() => {
    const img = new window.Image();
    img.src =
      "https://images.unsplash.com/photo-1736173155834-6cd98d8dc9fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MTMyNjl8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDAzMzg2MTJ8&ixlib=rb-4.0.3&q=80&w=400";
    img.crossOrigin = "anonymous";
    img.onload = () => setOriginalImage(img);
  }, []);

  const removeBg = async () => {
    try {
      setIsWiping(true); // Start wipe animation

      const formData = new FormData();
      formData.append(
        "image_url",
        "https://images.unsplash.com/photo-1736173155834-6cd98d8dc9fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MTMyNjl8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDAzMzg2MTJ8&ixlib=rb-4.0.3&q=80&w=400"
      );
      formData.append("size", "auto");

      const response = await fetch("https://api.remove.bg/v1.0/removebg", {
        method: "POST",
        headers: {
          "X-Api-Key": "XiY8Fzu7boTv5dnc7XWTjUg1",
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} - ${response.statusText}`);
      }

      const blob = await response.blob();
      const img = new window.Image();
      img.src = URL.createObjectURL(blob);
      img.onload = () => {
        setProcessedImage(img);
        animateWipe(); // Start wipe effect
      };
    } catch (error) {
      console.error("BG Removal Error:", error);
    }
  };

  const animateWipe = () => {
    let progress = 300;

    const wipeAnimation = () => {
      if (progress <= 0) {
        setIsWiping(false);
        return;
      }
      progress -= 10;
      setWipeProgress(progress);
      requestAnimationFrame(wipeAnimation);
    };

    requestAnimationFrame(wipeAnimation);
  };

  return (
    <div className="bg-white">
      <button
        onClick={removeBg}
        className="p-2 bg-blue-500 text-white rounded mb-4"
      >
        Remove BG
      </button>
      <Stage width={400} height={400} className="">
        <Layer className="border-2 border-red-700">
          {originalImage  && (
            <Group>
              {/* BG Removed Image (Fixed) */}
              <Image image={processedImage} x={50} y={50} width={300} height={300} />

              {/* Original Image (Hidden Gradually) */}
              <Group clipX={50} clipY={50} clipWidth={wipeProgress} clipHeight={300}>
                <Image image={originalImage} x={50} y={50} width={300} height={300} />
              </Group>
            </Group>
          )}
        </Layer>
      </Stage>
    </div>
  );
};

export default KonvaCanvas;
