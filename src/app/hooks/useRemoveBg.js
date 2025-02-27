import { useState, useEffect } from "react";
import useCloudinaryUpload from "./useCloudinaryUpload"; // ✅ Tumhara Cloudinary Hook

const useRemoveBg = (imageUrl, setLoading) => {
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
            const formData = new FormData();
            formData.append("image_url", imageUrl);
            formData.append("size", "auto");

            const res = await fetch("https://api.remove.bg/v1.0/removebg", {
                method: "POST",
                headers: {
                    "X-Api-Key": "x849qnAjMPZnzFhW6Rkhp8bS", // 🔑 Replace with valid API Key
                },
                body: formData,
            });

            if (!res.ok) {
                throw new Error("Failed to remove background.");
            }

            const blob = await res.blob(); // ✅ Image blob le rahe hain remove.bg se

            console.log("🔵 Remove.bg Processed Image Blob:", blob);

            // 🟢 Cloudinary pe upload kar rahe hain
            const cloudinaryUrl = await uploadImage(blob);

            if (cloudinaryUrl) {
                console.log("🟢 Final Cloudinary URL:", cloudinaryUrl);
                setProcessedImageUrl(cloudinaryUrl); // ✅ Permanent Cloudinary URL
            } else {
                console.log("error in cloudin")
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

export default useRemoveBg;
