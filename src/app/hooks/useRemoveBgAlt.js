import { useState, useEffect } from "react";
import useCloudinaryUpload from "./useCloudinaryUpload"; // ✅ Tumhara Cloudinary Hook

const useRemoveBgAlt = (imageUrl, setLoading) => {
    const [processedImageUrl, setProcessedImageUrl] = useState(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [error, setError] = useState("");
    const { uploadImage } = useCloudinaryUpload(); // ✅ Cloudinary Hook

    useEffect(() => {
        if (!imageUrl) return;
        removeBackground();
    }, [imageUrl]);

    const removeBackground = async () => {
        setLoading(true);
        setError("");

        try {
            // 🔵 Step 1: URL ko image Blob me convert karna
            const imageResponse = await fetch(imageUrl);
            if (!imageResponse.ok) throw new Error("Image fetch failed");
            const imageBlob = await imageResponse.blob();

            // ✅ Step 2: FormData banakar Blob send karna
            const formData = new FormData();
            formData.append("image_file", imageBlob, "image.png");

            const res = await fetch("https://clipdrop-api.co/remove-background/v1", {
                method: "POST",
                headers: {
                    "x-api-key": "f6e513d29b18b4429f6beb22b5b8edf7828e0a69b37e0d1b3b342001a8d7fd79c12d3c7d404dba08d84a8d6dbadf6c66", // ✅ ClipDrop API Key
                },
                body: formData,
            });

            if (!res.ok) {
                throw new Error("Failed to remove background.");
            }

            const blob = await res.blob(); // ✅ Processed image blob le rahe hain

            console.log("🔵 ClipDrop Processed Image Blob:", blob);

            // 🟢 Cloudinary pe upload kar rahe hain
            const cloudinaryUrl = await uploadImage(blob);

            if (cloudinaryUrl) {
                console.log("🟢 Final Cloudinary URL:", cloudinaryUrl);
                setProcessedImageUrl(cloudinaryUrl); // ✅ Permanent Cloudinary URL
            } else {
                throw new Error("Cloudinary upload failed.");
            }

            // ✅ Image dimensions extract karna
            const img = new Image();
            img.src = URL.createObjectURL(blob);
            img.onload = () => {
                setDimensions({ width: img.width, height: img.height });
                console.log("🔵 Image Dimensions:", img.width, img.height);
            };

        } catch (error) {
            setError(error.message);
            setProcessedImageUrl(null);
            setDimensions({ width: 0, height: 0 });
            console.log("🔴 Error:", error.message);
        } finally {
            setLoading(false);
        }
    };

    return { processedImageUrl, dimensions, error, setError };
};

export default useRemoveBgAlt;
