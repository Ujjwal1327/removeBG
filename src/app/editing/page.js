"use client";
import { useImageContext } from "../../context/ImageContextProvider.jsx";
import React, { useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import Loadingtate from '../components/LoadingState.jsx'
import { Stage, Layer, Image, Rect, Group } from "react-konva";
import useRemoveBg from "../hooks/useRemoveBg";
import useSampleImages from "../hooks/useSampleImage.js";
import { useRouter } from "next/navigation";
import { MdOutlineCompare } from "react-icons/md";
import { MdAdd, MdHeartBroken, MdAutoFixHigh } from "react-icons/md";
import { RiSubtractLine } from "react-icons/ri";
import { PiArrowBendUpLeftBold } from "react-icons/pi";
import { PiArrowBendUpRightBold } from "react-icons/pi";
import { RiDeleteBin5Line } from "react-icons/ri";



const EditingPage = () => {
    const { images: sampleImages } = useSampleImages(20);
    const { images, activeImage, setActiveImage, deleteImage, addSnap, handleRedo, handleUndo } = useImageContext();
    const [loading, setLoading] = useState(false);
    const [currentImage, setCurrentImage] = useState({})
    const [selectedPhoto, setSelectedPhoto] = useState(true)
    const [isBgOn, setIsBgOn] = useState(false)
    const [isMetrics, setIsMetrics] = useState(false)
    const [konvaRemImage, setKonvaRemImage] = useState(null);
    const router = useRouter();
    const [tempBlurValue, setTempBlurValue] = useState(0);
    // ✅ Ensure `imageObj` is always defined
    const imageObj = images.find(img => img.id === activeImage) || { history: [], activeSnap: 0 };
    // ✅ Check if BG Removal is needed
    const shouldRemoveBg = imageObj.history.length === 0 ? activeImage : null;
    // ✅ Call `useRemoveBg()` only if needed
    const { processedImageUrl, error, setError } = useRemoveBg(shouldRemoveBg, setLoading);
    const reduFun = () => {
        if (currentImage.activeSnap < currentImage.history.length - 1) {
            console.log("redu is calling")
            handleRedo()
        }
    }
    const handleCheckboxChange = (isChecked) => {
        addSnap({
            removeBgUrl: currentImage.history[currentImage.activeSnap].removeBgUrl,
            color: currentImage.history[currentImage.activeSnap].color, // Current color
            isBlur: isChecked, // ✅ Checkbox ka value
            blurValue: currentImage.history[currentImage.activeSnap].blurValue, // ✅ Blur ka default value
            bgImage: currentImage.history[currentImage.activeSnap].bgImage,
            transparent: currentImage.history[currentImage.activeSnap].transparent,
            opacity: currentImage.history[currentImage.activeSnap].opacity,
        });
    };
    const handleSliderRelease = () => {
        addSnap({
            removeBgUrl: currentImage.history[currentImage.activeSnap].removeBgUrl,
            color: currentImage.history[currentImage.activeSnap].color, // Current color
            isBlur: currentImage.history[currentImage.activeSnap].isBlur, // ✅ Checkbox ka value
            blurValue: Number(tempBlurValue), // ✅ Blur ka default value
            bgImage: currentImage.history[currentImage.activeSnap].bgImage,
            transparent: currentImage.history[currentImage.activeSnap].transparent,
            opacity: currentImage.history[currentImage.activeSnap].opacity,
        });
    }
    const handleImageClick = (imgSrc) => {
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
                opacity: null,

            });
        };

        imageObj.onerror = (error) => {
            console.error("Failed to load image:", imgSrc, error);
        };
    };
    const undoFun = () => {
        if (currentImage.activeSnap > 0) {
            console.log("undo is calling")
            handleUndo()

        }
    }
    const checkerboardPattern = () => {
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
        img.src = canvas.toDataURL();  // Convert canvas to data URL
        return img;
    };

    // ✅ Add  Removed Background Image to History
    useEffect(() => {
        if (processedImageUrl && imageObj.history.length === 0) {
            addSnap({
                removeBgUrl: processedImageUrl,
                color: null,
                isBlur: false,
                blurValue: 0,
                bgImage: null,
                transparent: true,
                opacity: null,

            });
        }
        // console.log(currentImage)

    }, [processedImageUrl]);
    //converting image for canvas
    useEffect(() => {
        if (!currentImage || !currentImage.history || !currentImage.history[currentImage.activeSnap]) return;
        const snapData = currentImage.history[currentImage.activeSnap];

        const img = new window.Image();
        img.src = snapData.removeBgUrl || "";
        img.onload = () => setKonvaRemImage(img);
    }, [currentImage, activeImage]);
    // saving current image 
    useEffect(() => {
        const foundImage = images.find(img => img.id === activeImage) || { id: null, history: [], activeSnap: 0 };
        setCurrentImage(foundImage);
    }, [activeImage, images]);
    useEffect(() => {
        console.log("Updated isBgOn:", isBgOn);
    }, [isBgOn]);
    console.log(images)
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white">
            {
                loading && (
                    <Loadingtate />
                )
            }
            {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-100 border border-red-400 text-red-700">
                    ❌ <span>{error}</span>
                </div>
            )}
            {!loading && currentImage.history && (
                <div className="w-full h-full bg-white">
                    {/*image section*/}
                    <div className="flex w-full mb-10 gap-10 items-stretch justify-center  rounded-lg overflow-hidden">
                        {/*image left section*/}
                        <div className="flex-1 flex flex-col items-end">
                            <Stage width={400} height={400} className="rounded-2xl shadow-xl border-1 border-gray-400 overflow-hidden">
                                <Layer >
                                    {/* Transparent tru ho tab */}
                                    {currentImage.history && currentImage.history[currentImage.activeSnap] && currentImage.history[currentImage.activeSnap].transparent && (
                                        <Rect
                                            width={400}
                                            height={400}
                                            fillPatternImage={checkerboardPattern()}
                                        />
                                    )}
                                    {/* ✅bg me koi color selected ho tab */}
                                    {currentImage.history && currentImage.history[currentImage.activeSnap] && currentImage.history[currentImage.activeSnap].color && (
                                        <Rect
                                            width={400}
                                            height={400}
                                            fill={currentImage.history[currentImage.activeSnap].color}
                                        />
                                    )}
                                    {/*  background me koi image save ho tab */}
                                    {currentImage.history && currentImage.history[currentImage.activeSnap] && currentImage.history[currentImage.activeSnap].bgImage && <Image
                                        image={currentImage.history[currentImage.activeSnap].bgImage}
                                        filters={[Konva.Filters.Blur]} // Blur filter apply kar raha hai
                                        blurRadius={currentImage.history[currentImage.activeSnap].isBlur ? currentImage.history[currentImage.activeSnap].blurValue : 0} // Blur intensity
                                        width={400}
                                        height={400}
                                        ref={(node) => {
                                            if (node) {
                                                node.cache(); // Filters ko properly apply karne ke liye
                                                node.getLayer().batchDraw(); // Canvas ko update karne ke liye
                                            }
                                        }}
                                    />}
                                    {/* ✅removed bg Image show karo top pe */}
                                    {konvaRemImage && <Image image={konvaRemImage} width={400} height={400} />}
                                </Layer>
                            </Stage>
                            {/* Buttons for Undo/Redo (Optional) */}
                            <div className="mt-5 flex gap-6 text-xl text-blackw-full items-center justify-end text-black">
                                <button className="hover:scale-110" ><RiSubtractLine /></button>
                                <button className="hover:scale-110" ><MdAdd /></button>
                                <button className="hover:scale-110" ><MdOutlineCompare /></button>
                                {
                                    currentImage.activeSnap == 0 ? (<button className=" text-gray-500 cursor-not-allowed" onClick={undoFun}><PiArrowBendUpLeftBold /></button>) : (<button className="hover:scale-110 text-black" onClick={undoFun}><PiArrowBendUpLeftBold /></button>)
                                }
                                {
                                    currentImage.activeSnap == currentImage.history.length - 1 ? (<button className="text-gray-500 cursor-not-allowed" onClick={reduFun} ><PiArrowBendUpRightBold /></button>) : (<button className="hover:scale-110 text-black" onClick={reduFun} ><PiArrowBendUpRightBold /></button>)
                                }
                                <button className="hover:bg-blue-600 py-1 px-8 rounded-3xl text-nowrap bg-blue-500 text-white">Download </button>
                            </div>
                        </div>
                        {/*image right section*/}
                        <div className=" relative flex-1 items-center">
                            <div className="group mb-5 flex items-center gap-2 cursor-pointer p-2" onClick={() => setIsBgOn(true)}>
                                <div className="border-4 border-gray-300 rounded-full transition-transform duration-200 group-hover:scale-105">
                                    <MdAdd className="p-1 text-3xl text-gray-500" />
                                </div>
                                <span className="text-gray-600 font-semibold transition-transform duration-200 group-hover:scale-105">
                                    Background <span className="p-1 bg-yellow-400 rounded-2xl">New</span>
                                </span>
                            </div>
                            {
                                isBgOn ? (<div className={`${isBgOn ? "block" : "hidden"} absolute top-0 left-0 shadow-2xl bg-gray-200 overflow-auto p-3 min-w-80 rounded-2xl`}>
                                    <div onClick={() => {
                                        console.log("clicked in cut");
                                        setIsBgOn((prev) => {
                                            return false;
                                        });
                                    }} className=" right-2 top-2 bg-black text-white text-2xl absolute rounded-full rotate-45 cursor-pointer">
                                        <MdAdd />
                                    </div>
                                    <div className="flex gap-3 items-center justify-start my-2">
                                        <span
                                            className={`px-5 text-gray-600 text-md py-1 rounded-xl cursor-pointer ${selectedPhoto ? "bg-white" : "bg-transparent"
                                                }`}
                                            onClick={() => setSelectedPhoto(true)}
                                        >
                                            Photo
                                        </span>
                                        <span
                                            className={`px-5 text-gray-600 text-md py-1 rounded-xl cursor-pointer ${!selectedPhoto ? "bg-white" : "bg-transparent"
                                                }`}
                                            onClick={() => setSelectedPhoto(false)}
                                        >
                                            Color
                                        </span>

                                    </div>
                                    <hr className="h-[2px] bg-white" />
                                    {
                                        selectedPhoto == true ? (<div className="my-2 grid grid-cols-3 gap-2 overflow-auto max-h-[300px]" >
                                            {sampleImages.map((img, index) => (
                                                <img
                                                    key={index}
                                                    src={img}
                                                    alt={`Sample ${index + 1}`}
                                                    className="w-20 h-20 object-cover rounded-lg cursor-pointer border"
                                                    onClick={() => handleImageClick(img)}
                                                />
                                            ))}
                                        </div>) : (<div className="p-2 grid grid-cols-3 gap-4 overflow-auto max-h-[300px]">
                                            {
                                                ["red", "blue", "yellow", "gray"].map((item, index) => (
                                                    <div
                                                        onClick={() => {
                                                            addSnap({
                                                                removeBgUrl: currentImage.history[currentImage.activeSnap].removeBgUrl,
                                                                color: item,
                                                                isBlur: false,
                                                                blurValue: 0,
                                                                bgImage: null, // ✅ Corrected Image URL
                                                                transparent: false,
                                                                opacity: null,


                                                            });
                                                        }}
                                                        style={{ backgroundColor: `${item}` }}
                                                        className="w-20 h-20 rounded-lg border-2"
                                                        key={item + index}
                                                    >
                                                    </div>
                                                ))
                                            }

                                        </div>)
                                    }
                                </div>) : null
                            }
                            <div className="group mb-5 flex items-center gap-2 cursor-pointer p-2" onClick={() => setIsMetrics(true)}>
                                <div className="border-4 border-gray-300 rounded-full transition-transform duration-200 group-hover:scale-105">
                                    <MdAutoFixHigh className="p-1 text-3xl text-gray-500" />
                                </div>
                                <span className="text-gray-600 font-semibold transition-transform duration-200 group-hover:scale-105">
                                    Effects
                                </span>
                            </div>
                            {
                                isMetrics && currentImage && currentImage.history[currentImage.activeSnap] ? (<div className={`${isMetrics ? "block" : "hidden"} absolute top-0 left-0 shadow-2xl bg-gray-200 overflow-auto p-3 px-6 min-w-80  min-h-64 rounded-2xl`}>

                                    <div onClick={() => {
                                        console.log("clicked on cut");
                                        setIsMetrics((prev) => {
                                            return false;
                                        });
                                    }} className=" right-2 top-2 bg-black text-white text-2xl absolute rounded-full rotate-45 cursor-pointer">
                                        <MdAdd />
                                    </div>
                                    <div className="mb-10">

                                    </div>
                                    <div>
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={currentImage.history[currentImage.activeSnap].isBlur}
                                                onChange={(e) => handleCheckboxChange(e.target.checked)}
                                            />

                                            <div className="w-12 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-500 relative transition-all duration-300">
                                                <div className="w-5 h-5 bg-white rounded-full shadow-md absolute top-0.5 left-1 transition-all duration-300 peer-checked:left-6"></div>
                                            </div>

                                            <span className="ml-2 text-lg font-medium text-gray-700">Blur background</span>
                                        </label>

                                    </div>
                                    <div className="my-4">

                                    </div>
                                    <label className="ml-2 text-lg font-medium text-gray-700"> Blur amount
                                    </label>
                                    <input
                                        type="range"
                                        min="1"
                                        max="50"
                                        value={currentImage.history[currentImage.activeSnap].blurValue}
                                        onChange={(e) => setTempBlurValue(e.target.value)} // ✅ Temporary update, no snap yet
                                        onMouseUp={handleSliderRelease} // ✅ Snap added only when slider stops
                                        onTouchEnd={handleSliderRelease} // ✅ Mobile support
                                        disabled={!currentImage.history[currentImage.activeSnap].isBlur} // ✅ Disabled if isBlur is false
                                        className="w-full h-2 rounded-lg bg-gray-300 dark:bg-blue-500 
                                        appearance-none cursor-pointer 
                                        disabled:opacity-50 disabled:cursor-not-allowed 
                                        [&::-webkit-slider-thumb]:appearance-none 
                                        [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 
                                        [&::-webkit-slider-thumb]:bg-blue-500 
                                        [&::-webkit-slider-thumb]:rounded-full 
                                        [&::-webkit-slider-thumb]:transition-all 
                                        [&::-webkit-slider-thumb]:hover:bg-blue-600 
                                        [&::-webkit-slider-thumb]:active:scale-110"
                                    />
                                    <div>
                                    </div>
                                </div>) : null
                            }

                        </div>
                    </div>
                    {/*footer  section*/}
                    <div className="w-full h-20 flex items-end justify-between gap-3 px-10 ">
                        <div className="flex items-center justify-center gap-3">
                            <button className="text-2xl text-blue-500 p-4 rounded-lg bg-blue-100" onClick={() => {
                                router.push("/")
                            }}>
                                <IoMdAdd />
                            </button>
                            <div className="flex gap-3">
                                {
                                    images.map((img, index) => (
                                        <img
                                            key={index}
                                            src={img.id}
                                            className={`w-14 cursor-pointer h-14 rounded-lg border-2 ${activeImage === img.id ? "border-blue-500" : "border-transparent"}`}
                                            onClick={() => setActiveImage(img.id)}
                                        />
                                    ))
                                }
                            </div>
                        </div>

                        <div className="text-xl  text-gray-500 flex items-center 
                        justify-center">
                            <span className="text-lg mr-10">
                                Rate this result <MdHeartBroken className="inline-block cursor-pointer ml-4" />
                            </span>
                            <button className="cursor-pointer" onClick={() => {
                                setError(null)
                                deleteImage(activeImage)
                            }
                            }

                            ><RiDeleteBin5Line />

                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
// Checkerboard Pattern Function



export default EditingPage;
