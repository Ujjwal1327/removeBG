import { useImageContext } from "../context/ImageContextProvider";

const { images, activeImage, setActiveImage, deleteImage, addSnap, handleRedo, handleUndo } = useImageContext();

export const checkerboardPattern = () => {


    const canvas = document.createElement("canvas");
    canvas.width = 20;
    canvas.height = 20;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#ddd";
    ctx.fillRect(0, 0, 20, 20);
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, 10, 10);
    ctx.fillRect(10, 10, 10, 10);

    // ✅ Convert canvas to Image
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = canvas.toDataURL();  // Convert canvas to data URL
    return img;
};


export const reduFun = () => {
    if (currentImage.activeSnap < currentImage.history.length - 1) {
        console.log("redu is calling")
        handleRedo()
    }
}
export const handleDownload = () => {
    if (stageRef.current) {
        const uri = stageRef.current.toDataURL({
            pixelRatio: 1,
            width: imageDimensions.width,  // Original Width
            height: imageDimensions.height, // Original Height
            mimeType: "image/png",
            quality: 1,
        });

        const link = document.createElement("a");
        link.href = uri;
        link.download = "edited-image.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};


export const handleCheckboxChange = (isChecked) => {
    addSnap({
        removeBgUrl: currentImage.history[currentImage.activeSnap].removeBgUrl,
        color: currentImage.history[currentImage.activeSnap].color, // Current color
        isBlur: isChecked, // ✅ Checkbox ka value
        blurValue: currentImage.history[currentImage.activeSnap].blurValue, // ✅ Blur ka default value
        bgImage: currentImage.history[currentImage.activeSnap].bgImage,
        transparent: currentImage.history[currentImage.activeSnap].transparent,
        isOpacity: currentImage.history[currentImage.activeSnap].isOpacity,
        opacityValue: currentImage.history[currentImage.activeSnap].opacityValue,
    });
};
export const handleOpacityCheckboxChange = (isChecked) => {
    addSnap({
        removeBgUrl: currentImage.history[currentImage.activeSnap].removeBgUrl,
        color: currentImage.history[currentImage.activeSnap].color, // Current color
        isBlur: currentImage.history[currentImage.activeSnap].isBlur, // ✅ Checkbox ka value
        blurValue: currentImage.history[currentImage.activeSnap].blurValue, // ✅ Blur ka default value
        bgImage: currentImage.history[currentImage.activeSnap].bgImage,
        transparent: currentImage.history[currentImage.activeSnap].transparent,
        isOpacity: isChecked,
        opacityValue: currentImage.history[currentImage.activeSnap].opacityValue,
    });
};
export const handleSliderRelease = () => {
    addSnap({
        removeBgUrl: currentImage.history[currentImage.activeSnap].removeBgUrl,
        color: currentImage.history[currentImage.activeSnap].color, // Current color
        isBlur: currentImage.history[currentImage.activeSnap].isBlur, // ✅ Checkbox ka value
        blurValue: Number(tempBlurValue), // ✅ Blur ka default value
        bgImage: currentImage.history[currentImage.activeSnap].bgImage,
        transparent: currentImage.history[currentImage.activeSnap].transparent,
        isOpacity: currentImage.history[currentImage.activeSnap].isOpacity,
        opacityValue: currentImage.history[currentImage.activeSnap].opacityValue,
    });
}
export const handleOpacitySliderRelease = () => {
    addSnap({
        removeBgUrl: currentImage.history[currentImage.activeSnap].removeBgUrl,
        color: currentImage.history[currentImage.activeSnap].color, // Current color
        isBlur: currentImage.history[currentImage.activeSnap].isBlur, // ✅ Checkbox ka value
        blurValue: currentImage.history[currentImage.activeSnap].blurValue, // ✅ Blur ka default value
        bgImage: currentImage.history[currentImage.activeSnap].bgImage,
        transparent: currentImage.history[currentImage.activeSnap].transparent,
        isOpacity: currentImage.history[currentImage.activeSnap].isOpacity,
        opacityValue: Number(tempOpacityValue),
    });
}
export const handleImageClick = (imgSrc) => {
    const imageObj = new window.Image();
    imageObj.crossOrigin = "Anonymous"; // CORS issue avoid करने के लिए
    imageObj.src = imgSrc;

    imageObj.onload = () => {

        // Send to addSnap with Valid URL
        addSnap({
            removeBgUrl: currentImage.history[currentImage.activeSnap].removeBgUrl,
            color: null,
            isBlur: false,
            blurValue: 0,
            bgImage: imageObj, // ✅ Corrected Image URL
            transparent: false,
            isOpacity: false,
            opacityValue: 0,

        });
    };

    imageObj.onerror = (error) => {
        console.error("Failed to load image:", imgSrc, error);
    };
};
export const undoFun = () => {
    if (currentImage.activeSnap > 0) {
        console.log("undo is calling")
        handleUndo()

    }
}