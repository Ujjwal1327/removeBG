
// {
//     removeBgUrl: null,
//     color: null,
//     bgImage: null,
//     transparent: null,
//     opacity: null,
//     blur: null,
// },
"use client"

import React, { useState, useContext } from 'react';
import ImageContext from './ImageContext';

export const ImageContextProvider = ({ children }) => {
    const [images, setImages] = useState([]) // to store all the images here. 
    const [activeImage, setActiveImage] = useState(null);
    //delete active image
    const deleteImage = (id) => {
        setImages((prev) => {
            const updatedImages = prev.filter((img) => img.id !== id);
            // Set active image to the first image in the updated array (if any)
            setActiveImage(updatedImages.length > 0 ? updatedImages[0].id : null);
            return updatedImages;
        });
    };
    //when adding new image on canvas
    const addImage = (imageUrl) => {
        setImages((prev) => {
            // if images allready exist in that  
            const exists = prev.find((img) => img.id === imageUrl)
            if (exists) return prev;
            return [
                ...prev,
                {
                    id: imageUrl,
                    history: [],
                    activeSnap: -1,

                }
            ]
        })
        setActiveImage(imageUrl)

    }
    //when adding new snap
    const addSnap = (updatedData) => {
        setImages((prev) =>
            prev.map((img) =>
                img.id === activeImage
                    ? {
                        ...img,
                        history: [...img.history.slice(0, img.activeSnap + 1), updatedData], // Undo ke baad redo delete
                        activeSnap: img.activeSnap + 1,
                    }
                    : img
            )
        );
    };

    // ✅ Undo Function
    const handleUndo = () => {
        setImages((prev) =>
            prev.map((img) =>
                img.id === activeImage && img.activeSnap > 0
                    ? { ...img, activeSnap: img.activeSnap - 1 }
                    : img
            )
        );
    };

    // ✅ Redo Function
    const handleRedo = () => {
        setImages((prev) =>
            prev.map((img) =>
                img.id === activeImage && img.activeSnap < img.history.length - 1
                    ? { ...img, activeSnap: img.activeSnap + 1 }
                    : img
            )
        );
    };
    // ✅ Active Image Ka Current Snap 
    const getActiveSnap = () => {
        const img = images.find((img) => img.id === activeImage);
        return img ? img.history[img.activeSnap] : null;
    };
    return (
        <ImageContext.Provider value={{ images, activeImage, deleteImage, setActiveImage, addImage, addSnap, handleUndo, handleRedo, getActiveSnap }}>{children}</ImageContext.Provider>
    )
}

// ✅ Custom Hook 
export const useImageContext = () => {
    return useContext(ImageContext);
};