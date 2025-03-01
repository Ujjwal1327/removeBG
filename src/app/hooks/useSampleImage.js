import { useEffect, useState } from "react";

const useSampleImages = (count = 5) => {
    const [images, setImages] = useState([]);
    const [error, setError] = useState(null)
    useEffect(() => {
        fetch(`https://api.unsplash.com/photos/random?count=${count}&client_id=cZnWWZ2pKbKECD6_EA2fmiXqSVruxvCyLol0vsoXMek`)
            .then((res) => res.json())
            .then((data) => setImages(data.map((img) => img.urls.small)))
            .catch((err) => {
                console.error("Error fetching images:", err)
                setError("Problem in fetching image , see console for more.")
            }
            );
    }, [count]);

    return { images, error , setError };
};

export default useSampleImages;
