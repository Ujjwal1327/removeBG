import { useEffect, useState } from "react";

const useSampleImages = (count = 5) => {
    const [images, setImages] = useState([]);
    const [error, setError] = useState(null)
    useEffect(() => {
        fetch(`https://api.unsplash.com/photos/random?count=${count}&client_id=6ipuoeJVIp-nRQBspNPd47VWWC9my6r9-8i98f2OT4g`)
            .then((res) => res.json())
            .then((data) => setImages(data.map((img) => img.urls.small)))
            .catch((err) => {
                console.error("Error fetching images:", err)
                setError("Problem in fetching image , see console for more.")
            }
            );
    }, [count]);

    return { images, error };
};

export default useSampleImages;
