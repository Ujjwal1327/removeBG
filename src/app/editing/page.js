"use client";
import { useImageContext } from "../../context/ImageContextProvider.jsx";
import React, { useEffect, useState } from "react";
import { IoIosGitCompare, IoMdAdd, IoMdGitCompare } from "react-icons/io";
import Loadingtate from '../components/LoadingState.jsx'
import { Stage, Layer, Image, Rect, Group } from "react-konva";
import useRemoveBgAlt from "../hooks/useRemoveBgAlt";
import useSampleImages from "../hooks/useSampleImage.js";
import { useRouter } from "next/navigation";
import { MdAdd, MdHeartBroken, MdAutoFixHigh, MdDownload } from "react-icons/md";
import { RiSubtractLine } from "react-icons/ri";
import { PiArrowBendUpLeftBold } from "react-icons/pi";
import { PiArrowBendUpRightBold } from "react-icons/pi";
import { RiDeleteBin5Line } from "react-icons/ri";
import { useRef } from "react";
import { SketchPicker } from "react-color";
import { IoBanOutline, IoDownload } from "react-icons/io5";
import { checkerboardPattern, reduFun, handleDownload, handleCheckboxChange, handleOpacityCheckboxChange, handleSliderRelease, handleOpacitySliderRelease, handleImageClick, undoFun } from "../../utils/functions.js"
import { FaArrowDown } from "react-icons/fa6";




const EditingPage = () => {
    const [scale, setScale] = useState(1); // Default scale 1 (Normal)
    const [color, setColor] = useState("#4F4F4F");
    const [showPicker, setShowPicker] = useState(false);
    const [imageDimensions, setImageDimensions] = useState({ width: 400, height: 400 });
    const { images: sampleImages } = useSampleImages(20);
    const { images, activeImage, setActiveImage, deleteImage, addSnap, handleRedo, handleUndo } = useImageContext();
    const [loading, setLoading] = useState(false);
    const [currentImage, setCurrentImage] = useState({})
    const [selectedPhoto, setSelectedPhoto] = useState(true)
    const [isBgOn, setIsBgOn] = useState(false)
    const [isMetrics, setIsMetrics] = useState(false)
    const [konvaRemImage, setKonvaRemImage] = useState(null);
    const router = useRouter();
    const stageRef = useRef(null); // Stage ka reference
    const [compare, setCompare] = useState(true);
    const [tempBlurValue, setTempBlurValue] = useState(0);
    const [tempOpacityValue, setTempOpacityValue] = useState(0);
    const [scaledDimensions, setScaledDimensions] = useState({ width: 400, height: 400 });

    const MAX_WIDTH = 400; // UI me Stage ka max width
    const MAX_HEIGHT = 400; // UI me max height
    // ✅ Ensure `imageObj` is always defined
    const imageObj = images.find(img => img.id === activeImage) || { history: [], activeSnap: 0 };
    // ✅ Check if BG Removal is needed
    const shouldRemoveBg = imageObj.history.length === 0 ? activeImage : null;
    // ✅ Call `useRemoveBgAlt()` only if needed
    const { processedImageUrl, error, setError } = useRemoveBgAlt(shouldRemoveBg, setLoading);



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
                isOpacity: false,
                opacityValue: 0,

            });
        }
        // console.log(currentImage)

    }, [processedImageUrl]);
    useEffect(() => {
        if (activeImage) {
            const img = new window.Image();
            img.crossOrigin = "anonymous";
            img.src = activeImage;

            img.onload = () => {
                const aspectRatio = img.width / img.height;
                let newWidth = MAX_WIDTH;
                let newHeight = MAX_WIDTH / aspectRatio;

                if (newHeight > MAX_HEIGHT) {
                    newHeight = MAX_HEIGHT;
                    newWidth = MAX_HEIGHT * aspectRatio;
                }

                setImageDimensions({ width: img.width, height: img.height }); // Original Size
                setScaledDimensions({ width: newWidth, height: newHeight }); // UI ke liye Proportionate Size
            };
        }
    }, [activeImage]);
    //converting image for canvas
    useEffect(() => {
        if (!currentImage || !currentImage.history || !currentImage.history[currentImage.activeSnap]) return;
        const snapData = currentImage.history[currentImage.activeSnap];

        const img = new window.Image();
        img.crossOrigin = "anonymous";
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
        <div className=" w-full relative flex gap-2 flex-col items-center justify-center min-h-screen bg-white pt-5">
            {
                loading && (
                    <Loadingtate width={scaledDimensions.width}
                        height={scaledDimensions.height} />
                )
            }
            <div className="block lg:hidden w-full">
                <div className="flex items-center justify-start w-10/12 mx-auto   gap-3">
                    <button className="text-2xl text-blue-500 p-4 rounded-lg bg-blue-100" onClick={() => {
                        router.push("/")
                    }}>
                        <IoMdAdd />
                    </button>
                    <div className="flex gap-3">
                        {

                            images.map((img, index) => (
                                <div className="relative">
                                    <img
                                        key={index}
                                        src={img.id}
                                        className={`w-14 cursor-pointer h-14 rounded-lg border-2 ${activeImage === img.id ? "border-blue-500" : "border-transparent"}`}
                                        onClick={() => setActiveImage(img.id)}
                                    />
                                    {
                                        activeImage === img.id &&

                                        (<div className="w-8 h-8 flex items-center justify-center bg-blue-600 rounded-full absolute -top-3 -right-3 text-white">
                                            <RiDeleteBin5Line className="cursor-pointer" onClick={() => {
                                                setError(null)
                                                deleteImage(activeImage)
                                            }
                                            } />
                                        </div>)
                                    }
                                </div>

                            ))

                        }
                    </div>
                </div>
            </div>
            {error && <p className="absolute top-1 lg:top-10 bg-gray-500 px-3 py-1 w-[96%] text-white right-[2%] text-lg font-bold">{error}
                <MdAdd onClick={() => setError(null)} className="absolute top-1 right-1 bg-white rotate-45 text-lg text-gray-600 font-bold  rounded-full" />
            </p>}
            {!loading && currentImage.history && (
                <div className="w-full h-full bg-white">
                    {/*image section*/}
                    <div className=" min-w-96 px-10  items-center flex flex-col lg:flex-row w-full mb-10 gap-10 lg:items-stretch justify-center  rounded-lg">
                        {/*image left section*/}
                        <div className="flex-1 flex flex-col items-end ">
                            <Stage
                                ref={stageRef}
                                width={scaledDimensions.width}
                                height={scaledDimensions.height}
                                className="rounded-2xl shadow-2xl min-w-40   overflow-hidden"
                                scaleX={scale} // Applying scale
                                scaleY={scale}
                            ><Layer >

                                    {currentImage &&
                                        currentImage.id &&
                                        currentImage.history &&
                                        currentImage.history[currentImage.activeSnap] && (
                                            <Image
                                                image={(() => {
                                                    const img = new window.Image();
                                                    img.crossOrigin = "Anonymous"; // Prevent CORS issues
                                                    img.onload = () => {
                                                        console.log("Image Loaded Successfully"); // Debugging
                                                    };
                                                    img.onerror = () => {
                                                        console.error("Failed to load image:", currentImage.id);
                                                    };
                                                    img.src = currentImage.id; // Ensure this is a valid URL
                                                    return img;
                                                })()}
                                                width={imageDimensions.width}
                                                height={imageDimensions.height}
                                                ref={(node) => {
                                                    if (node) {
                                                        node.cache(); // Apply filters correctly
                                                        node.getLayer().batchDraw(); // Update the canvas
                                                    }
                                                }}
                                            />
                                        )}

                                    {/* Transparent tru ho tab */}
                                    {compare && currentImage.history && currentImage.history[currentImage.activeSnap] && currentImage.history[currentImage.activeSnap].transparent && (
                                        <Rect
                                            width={imageDimensions.width}
                                            height={imageDimensions.height}
                                            fillPatternImage={checkerboardPattern()}
                                        />
                                    )}
                                    {/* ✅bg me koi color selected ho tab */}
                                    {compare && currentImage.history && currentImage.history[currentImage.activeSnap] && currentImage.history[currentImage.activeSnap].color && (
                                        <Rect
                                            width={imageDimensions.width}
                                            height={imageDimensions.height}
                                            fill={currentImage.history[currentImage.activeSnap].color}
                                        />
                                    )}
                                    {/*  background me koi image save ho tab */}
                                    {compare && currentImage.history && currentImage.history[currentImage.activeSnap] && currentImage.history[currentImage.activeSnap].bgImage && <Image
                                        image={currentImage.history[currentImage.activeSnap].bgImage}
                                        filters={[Konva.Filters.Blur]} // Blur filter apply kar raha hai
                                        blurRadius={currentImage.history[currentImage.activeSnap].isBlur ? currentImage.history[currentImage.activeSnap].blurValue : 0} // Blur intensity
                                        width={imageDimensions.width}
                                        height={imageDimensions.height}

                                        ref={(node) => {
                                            if (node) {
                                                node.cache(); // Filters ko properly apply karne ke liye
                                                node.getLayer().batchDraw(); // Canvas ko update karne ke liye
                                            }
                                        }}
                                    />}
                                    {/* ✅removed bg Image show karo top pe */}
                                    {konvaRemImage && <Image image={konvaRemImage} shadowColor="black"
                                        shadowBlur={20}
                                        shadowOffset={{ x: 15, y: 15 }}
                                        width={imageDimensions.width}
                                        height={imageDimensions.height}
                                        shadowOpacity={currentImage.history[currentImage.activeSnap].isOpacity ? currentImage.history[currentImage.activeSnap].opacityValue : 0} />}
                                </Layer>
                            </Stage>

                            {/* Buttons for Undo/Redo (Optional) */}
                            <div className="mt-5 flex flex-wrap gap-8 lg:gap-6 text-xl px-3 lg:px-0 text-blackw-full items-center  justify-between  lg:justify-end text-black" style={{ width: scaledDimensions.width }}>
                                <button
                                    className={`hover:scale-110 ${scale <= 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                                    onClick={() => {
                                        setScale((prevScale) => (prevScale > 1 ? prevScale - 0.1 : 1));
                                    }}
                                    disabled={scale <= 1} // Button disable kar diya
                                >
                                    <RiSubtractLine />
                                </button>
                                <button
                                    className={`hover:scale-110 ${scale >= 2 ? "opacity-50 cursor-not-allowed" : ""}`}
                                    onClick={() => {
                                        setScale((prevScale) => Math.min(prevScale + 0.1, 2)); // Max zoom level 3
                                    }}
                                    disabled={scale >= 2} // Button disable jab max zoom ho
                                >
                                    <MdAdd />
                                </button>

                                <button className="hover:scale-110" onClick={() => {
                                    setCompare((prev) => !prev)
                                }} >

                                    {
                                        compare ? <IoIosGitCompare /> : <IoMdGitCompare />
                                    }
                                </button>
                                {
                                    currentImage.activeSnap == 0 ? (<button className=" text-gray-500 cursor-not-allowed" onClick={undoFun}><PiArrowBendUpLeftBold /></button>) : (<button className="hover:scale-110 text-black" onClick={undoFun}><PiArrowBendUpLeftBold /></button>)
                                }
                                {
                                    currentImage.activeSnap == currentImage.history.length - 1 ? (<button className="text-gray-500 cursor-not-allowed" onClick={reduFun} ><PiArrowBendUpRightBold /></button>) : (<button className="hover:scale-110 text-black" onClick={reduFun} ><PiArrowBendUpRightBold /></button>)
                                }
                                <button onClick={handleDownload} className="hover:bg-blue-600 hidden lg:block py-1 px-8 rounded-3xl text-nowrap bg-blue-500 text-white">Download </button>
                            </div>
                        </div>
                        {/*responsive section*/}
                        <div className=" w-full flex-1 lg:hidden">
                            <div className="w-10/12 mx-auto flex flex-row items-start justify-around">
                                <div className="flex items-center flex-col justify-center gap-2">
                                    <div className="w-10 h-10 rounded-full border-2 border-blue-600 bg-blue-600 flex items-center justify-center">
                                        <FaArrowDown className="text-white text-2xl" />
                                    </div>
                                    <span className="text-xs italic" onClick={handleDownload}>Download</span>
                                </div>
                                <div className="flex items-center flex-col justify-center gap-2" onClick={() => setIsBgOn(true)}>
                                    <div className="w-10 h-10 rounded-full border-2 border-blue-600 bg-white flex items-center justify-center">
                                        <MdAdd className="text-blue-600 text-2xl" />
                                    </div>
                                    <span className="text-xs italic">Background</span>
                                </div>
                                {
                                    isBgOn ? (<div className={`${isBgOn ? "block" : "hidden"} absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-2xl bg-gray-200 overflow-auto p-3 min-w-80 min-h-96 rounded-2xl`}>
                                        <div onClick={() => {
                                            console.log("clicked in cut");
                                            setIsBgOn((prev) => {
                                                return false;
                                            });
                                            setShowPicker((prev) => {
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
                                                <div className="cursor-pointer flex items-center justify-center w-20 h-20 rounded-lg border-2 bg-white border-gray-300" onClick={() => {
                                                    addSnap({
                                                        removeBgUrl: currentImage.history[currentImage.activeSnap].removeBgUrl,
                                                        color: null,
                                                        isBlur: false,
                                                        blurValue: 0,
                                                        bgImage: null,
                                                        transparent: true,
                                                        isOpacity: false,
                                                        opacityValue: 0,
                                                    });
                                                }} >
                                                    <IoBanOutline className="text-black font-bold " />
                                                </div>
                                                {sampleImages.map((img, index) => (
                                                    <img
                                                        key={index}
                                                        src={img}
                                                        alt={`Sample ${index + 1}`}
                                                        className="w-20 h-20 object-cover rounded-lg cursor-pointer border"
                                                        onClick={() => {
                                                            handleImageClick(img)
                                                            setIsBgOn(false)
                                                        }



                                                        }


                                                    />
                                                ))}
                                            </div>) : (<div className="p-2 grid grid-cols-3 gap-4 overflow-auto max-h-[300px]">

                                                <div className="cursor-pointer flex items-center justify-center w-20 h-20 rounded-lg border-2 bg-white border-gray-300" onClick={() => {
                                                    addSnap({
                                                        removeBgUrl: currentImage.history[currentImage.activeSnap].removeBgUrl,
                                                        color: null,
                                                        isBlur: false,
                                                        blurValue: 0,
                                                        bgImage: null, // ✅ Corrected Image URL
                                                        transparent: true,
                                                        isOpacity: false,
                                                        opacityValue: 0,
                                                    });
                                                }} >
                                                    <IoBanOutline className="text-black font-bold " />
                                                </div>
                                                <div
                                                    className="w-20 h-20 rounded-lg border-2"
                                                    style={{
                                                        background: "conic-gradient(red, yellow, lime, aqua, blue, magenta, red)",
                                                    }} onClick={() => {

                                                        setShowPicker(!showPicker)

                                                    }

                                                    }
                                                ></div>
                                                {showPicker && (
                                                    <div className="absolute top-12 right-0 z-50 shadow-lg text-black bg-white border-2 rounded-lg">
                                                        <div onClick={() => {
                                                            console.log("clicked on cut");
                                                            setShowPicker((prev) => {
                                                                return false;
                                                            });
                                                        }} className=" right-2 top-2 z-20 bg-black text-white text-2xl absolute rounded-full rotate-45 cursor-pointer">
                                                            <MdAdd />
                                                        </div>
                                                        <div className="m-10">
                                                        </div>
                                                        <SketchPicker

                                                            color={color}
                                                            onChangeComplete={(updatedColor) => {
                                                                setColor(updatedColor.hex)
                                                                addSnap({
                                                                    removeBgUrl: currentImage.history[currentImage.activeSnap].removeBgUrl,
                                                                    color: updatedColor.hex,
                                                                    isBlur: false,
                                                                    blurValue: 0,
                                                                    bgImage: null, // ✅ Corrected Image URL
                                                                    transparent: false,
                                                                    isOpacity: false,
                                                                    opacityValue: 0,
                                                                });

                                                            }}


                                                        />
                                                    </div>
                                                )}
                                                {
                                                    ["green", "orange", "pink", "brown", "white", "red", "blue", "yellow", "gray",
                                                        "purple", "cyan", "magenta", "lime", "teal", "maroon", "navy", "olive", "gold", "silver", "indigo", "violet"]
                                                        .map((item, index) => (
                                                            <div
                                                                onClick={() => {
                                                                    addSnap({
                                                                        removeBgUrl: currentImage.history[currentImage.activeSnap].removeBgUrl,
                                                                        color: item,
                                                                        isBlur: false,
                                                                        blurValue: 0,
                                                                        bgImage: null, // ✅ Corrected Image URL
                                                                        transparent: false,
                                                                        isOpacity: false,
                                                                        opacityValue: 0,
                                                                    });
                                                                    setIsBgOn(false)
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
                                <div className="flex items-center flex-col justify-center gap-2">
                                    <div className="w-10 h-10 rounded-full border-2 border-blue-600 bg-blue-600 flex items-center justify-center">
                                        <MdAutoFixHigh className="text-white text-2xl" />
                                    </div>
                                    <span className="text-xs italic">Effects</span>
                                </div>
                            </div>
                        </div>
                        {/*image right section*/}
                        <div className="hidden lg:block relative flex-1 items-center">
                            <div className="group mb-5 flex items-center gap-2 cursor-pointer p-2" onClick={() => setIsBgOn(true)}>
                                <div className="border-4 border-gray-300 rounded-full transition-transform duration-200 group-hover:scale-105">
                                    <MdAdd className="p-1 text-3xl text-gray-500" />
                                </div>
                                <span className="text-gray-600 font-semibold transition-transform duration-200 group-hover:scale-105">
                                    Background <span className="p-1 bg-yellow-400 rounded-2xl">New</span>
                                </span>
                            </div>
                            {
                                isBgOn ? (<div className={`${isBgOn ? "block" : "hidden"} absolute top-0 left-0 shadow-2xl bg-gray-200 overflow-auto p-3 min-w-80 min-h-96 rounded-2xl`}>
                                    <div onClick={() => {
                                        console.log("clicked in cut");
                                        setIsBgOn((prev) => {
                                            return false;
                                        });
                                        setShowPicker((prev) => {
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
                                            <div className="cursor-pointer flex items-center justify-center w-20 h-20 rounded-lg border-2 bg-white border-gray-300" onClick={() => {
                                                addSnap({
                                                    removeBgUrl: currentImage.history[currentImage.activeSnap].removeBgUrl,
                                                    color: null,
                                                    isBlur: false,
                                                    blurValue: 0,
                                                    bgImage: null, // ✅ Corrected Image URL
                                                    transparent: true,
                                                    isOpacity: false,
                                                    opacityValue: 0,
                                                });
                                            }} >
                                                <IoBanOutline className="text-black font-bold " />
                                            </div>
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

                                            <div className="cursor-pointer flex items-center justify-center w-20 h-20 rounded-lg border-2 bg-white border-gray-300" onClick={() => {
                                                addSnap({
                                                    removeBgUrl: currentImage.history[currentImage.activeSnap].removeBgUrl,
                                                    color: null,
                                                    isBlur: false,
                                                    blurValue: 0,
                                                    bgImage: null, // ✅ Corrected Image URL
                                                    transparent: true,
                                                    isOpacity: false,
                                                    opacityValue: 0,
                                                });
                                            }} >
                                                <IoBanOutline className="text-black font-bold " />
                                            </div>
                                            <div
                                                className="w-20 h-20 rounded-lg border-2"
                                                style={{
                                                    background: "conic-gradient(red, yellow, lime, aqua, blue, magenta, red)",
                                                }} onClick={() => setShowPicker(!showPicker)}
                                            ></div>
                                            {showPicker && (
                                                <div className="absolute top-12 right-0 z-50 shadow-lg text-black bg-white border-2 rounded-lg">
                                                    <div onClick={() => {
                                                        console.log("clicked on cut");
                                                        setShowPicker((prev) => {
                                                            return false;
                                                        });
                                                    }} className=" right-2 top-2 z-20 bg-black text-white text-2xl absolute rounded-full rotate-45 cursor-pointer">
                                                        <MdAdd />
                                                    </div>
                                                    <div className="m-10">
                                                    </div>
                                                    <SketchPicker

                                                        color={color}
                                                        onChangeComplete={(updatedColor) => {
                                                            setColor(updatedColor.hex)
                                                            addSnap({
                                                                removeBgUrl: currentImage.history[currentImage.activeSnap].removeBgUrl,
                                                                color: updatedColor.hex,
                                                                isBlur: false,
                                                                blurValue: 0,
                                                                bgImage: null, // ✅ Corrected Image URL
                                                                transparent: false,
                                                                isOpacity: false,
                                                                opacityValue: 0,
                                                            });

                                                        }}


                                                    />
                                                </div>
                                            )}
                                            {
                                                ["green", "orange", "pink", "brown", "white", "red", "blue", "yellow", "gray",
                                                    "purple", "cyan", "magenta", "lime", "teal", "maroon", "navy", "olive", "gold", "silver", "indigo", "violet"]
                                                    .map((item, index) => (
                                                        <div
                                                            onClick={() => {
                                                                addSnap({
                                                                    removeBgUrl: currentImage.history[currentImage.activeSnap].removeBgUrl,
                                                                    color: item,
                                                                    isBlur: false,
                                                                    blurValue: 0,
                                                                    bgImage: null, // ✅ Corrected Image URL
                                                                    transparent: false,
                                                                    isOpacity: false,
                                                                    opacityValue: 0,
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
                                        value={currentImage.history[currentImage.activeSnap].blurValue || 0}
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
                                    <div className="mb-10">
                                    </div>
                                    <div>
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={currentImage.history[currentImage.activeSnap].isOpacity}
                                                onChange={(e) => handleOpacityCheckboxChange(e.target.checked)}
                                            />

                                            <div className="w-12 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-500 relative transition-all duration-300">
                                                <div className="w-5 h-5 bg-white rounded-full shadow-md absolute top-0.5 left-1 transition-all duration-300 peer-checked:left-6"></div>
                                            </div>

                                            <span className="ml-2 text-lg font-medium text-gray-700">Opacity Value</span>
                                        </label>

                                    </div>
                                    <div className="my-4">
                                    </div>
                                    <label className="ml-2 text-lg font-medium text-gray-700"> Opacity amount
                                    </label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.01"
                                        value={currentImage.history[currentImage.activeSnap].opacityValue || 0}
                                        onChange={(e) => setTempOpacityValue(e.target.value)} // ✅ Temporary update, no snap yet
                                        onMouseUp={handleOpacitySliderRelease} // ✅ Snap added only when slider stops
                                        onTouchEnd={handleOpacitySliderRelease} // ✅ Mobile support
                                        disabled={!currentImage.history[currentImage.activeSnap].isOpacity} // ✅ Disabled if isBlur is false
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
                                </div>) : null
                            }

                        </div>
                    </div>
                    {/*footer  section*/}
                    <div className="hidden  w-full h-20 lg:flex items-end justify-between gap-3 px-10 absolute bottom-5">
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
