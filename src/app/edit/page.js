"use client";

import React, { useEffect, useState, useRef } from "react";
import { Stage, Layer, Image, Rect, Group } from "react-konva";
import { GoZoomIn, GoZoomOut } from "react-icons/go";
import { MdOutlineCompare } from "react-icons/md";
import { FaUndo } from "react-icons/fa";
import { FaRedo } from "react-icons/fa";
import { IoAdd } from "react-icons/io5";
import useRemoveBgAlt from "../hooks/useRemoveBgAlt";
const EditPage = () => {
    const [history, setHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1); // -1 means no snapshot yet
    const [oImage, setOImage] = useState(null);
    const [color, setColor] = useState(null);
    const [origImage, setOrigImage] = useState(null);
    const [selectedPhoto, setSelectedPhoto] = useState(true)
    const [bgImage, setBgImage] = useState(null);
    const [wipeWidth, setWipeWidth] = useState(0);
    const [sampleImages, setSampleImages] = useState([]);
    const [loading, setLoading] = useState(false); // ✅ Loading state ab yahi manage hoga

    const stageRef = useRef(null);
    const handleColor = (color) => {
        saveToHistory({ bgImage: null, color }); // ✅ History me save karna
        setBgImage(null);
        setColor(color);
    };

    const saveToHistory = (newState) => {
        const updatedHistory = history.slice(0, historyIndex + 1); // Purane redo snapshots hatao
        updatedHistory.push(newState); // Naya state add karo
        setHistory(updatedHistory);
        setHistoryIndex(updatedHistory.length - 1); // Index update karo
    };
    const handleRedo = () => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex(historyIndex + 1); // ✅ Agle state pe jao
            const nextState = history[historyIndex + 1];
            setBgImage(nextState.bgImage);
            setColor(nextState.color);
        }
    };
    const handleUndo = () => {
        if (historyIndex > 0) {
            setHistoryIndex(historyIndex - 1); // ✅ Pichle state pe jao
            const prevState = history[historyIndex - 1];
            setBgImage(prevState.bgImage);
            setColor(prevState.color);
        }
    };

    const handleDownload = () => {
        if (stageRef.current) {
            const stage = stageRef.current;

            try {
                // Get original width & height
                const originalWidth = stage.width();
                const originalHeight = stage.height();

                // Preserve dimensions by setting pixelRatio dynamically
                const dataURL = stage.toDataURL({
                    pixelRatio: 1, // 1 means it keeps the same resolution
                    width: originalWidth,
                    height: originalHeight
                });

                const link = document.createElement("a");
                link.href = dataURL;
                link.download = "edited_image.png";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } catch (error) {
                console.error("Error downloading image:", error);
            }
        }
    };

    const handleNewBackground = (newImageSrc) => {
        setColor(null);
        const img = new window.Image();
        img.src = newImageSrc;
        img.crossOrigin = "anonymous";
        img.onload = () => {
            const scaleX = dimensions.width / img.width;
            const scaleY = dimensions.height / img.height;
            const scale = Math.max(scaleX, scaleY);

            const newBg = {
                image: img,
                width: img.width * scale,
                height: img.height * scale,
                x: (dimensions.width - img.width * scale) / 2,
                y: (dimensions.height - img.height * scale) / 2
            };

            saveToHistory({ bgImage: newBg, color: null }); // ✅ History me save karna
            setBgImage(newBg);
        };
    };
    // FETCH 20 IMAGES FROM UNSPLASH
    useEffect(() => {
        fetch("https://api.unsplash.com/photos/random?count=20&client_id=6ipuoeJVIp-nRQBspNPd47VWWC9my6r9-8i98f2OT4g")
            .then((res) => res.json())
            .then((data) => {
                const imageUrls = data.map((img) => img.urls.small); // Extract image URLs
                setSampleImages(imageUrls);
            })
            .catch((err) => console.error("Error fetching images:", err));
    }, []);

    useEffect(() => {
        const storedImage = localStorage.getItem("uploadedImage");
        if (!storedImage) {
            router.push("/");
        } else {
            setOImage(storedImage);
            const img = new window.Image();
            img.crossOrigin = "anonymous";
            img.src = storedImage;
            img.onload = () => setOrigImage(img);
        }
    }, [router]);

    const { processedImage, dimensions, error } = useRemoveBgAlt(oImage, setLoading);

    // Wipe Animation Trigger
    useEffect(() => {
        if (!loading && processedImage) {
            let animInterval = setInterval(() => {
                setWipeWidth((prev) => {
                    if (prev >= dimensions.width) {
                        clearInterval(animInterval);
                        return dimensions.width;
                    }
                    return prev + 40;
                });
            }, 50);
        }
    }, [loading, processedImage]);
    const showOrigImg = () => {
        setWipeWidth(0)
    }

    useEffect(() => {
        if (!loading && processedImage) {
            saveToHistory({ bgImage: null, color: null }); // ✅ Background remove hone par save karo
        }
    }, [processedImage, loading]);
    console.log(wipeWidth)
    return (
        <div className=" bg-white flex flex-col items-center justify-center min-h-screen">
            <div className=" text-black rounded-lg flex flex-row  relative">

                {
                    loading && (
                        <div className="flex flex-row items-start justify-center gap-4 ">
                            <div
                                className="rounded-xl bg-gray-200 border-2 border-red-300 shadow-xl"
                                style={{
                                    width: dimensions.width || 400,
                                    height: dimensions.height || 200
                                }}
                            >
                            </div>
                            <div className="flex flex-col gap-10">
                                <div className="flex gap-4">
                                    <div className="h-12 w-12 bg-gray-200 rounded-full">
                                    </div>
                                    <div className="h-12 w-96 bg-gray-200 rounded-2xl">
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="h-12 w-12 bg-gray-200 rounded-full">
                                    </div>
                                    <div className="h-12 w-96 bg-gray-200 rounded-2xl">
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="h-12 w-12 bg-gray-200 rounded-full">
                                    </div>
                                    <div className="h-12 w-96 bg-gray-200 rounded-2xl">
                                    </div>
                                </div>
                            </div>

                        </div>
                    )
                }
                {
                    !loading && (<div className="flex flex-row items-start justify-center gap-4">
                        <div className="flex flex-col gap-2 overflow-hidden">
                            <Stage ref={stageRef} width={dimensions.width} height={dimensions.height} className="overflow-hidden rounded-2xl">
                                <Layer>
                                    <Rect width={dimensions.width} height={dimensions.height} fillPatternImage={checkerboardPattern()} />
                                    {
                                        color && <Rect width={dimensions.width} height={dimensions.height} fill={color} />
                                    }
                                    {bgImage && (
                                        <Image image={bgImage.image} width={bgImage.width} height={bgImage.height} x={bgImage.x} y={bgImage.y} />
                                    )}
                                    {origImage && <Image image={origImage} x={-wipeWidth} height={dimensions.height} />}
                                    {!loading && processedImage && (
                                        <Group>
                                            <Image image={processedImage} width={dimensions.width} height={dimensions.height} />
                                        </Group>
                                    )}
                                </Layer>
                            </Stage>
                            <div className="flex gap-1 items-center w-full justify-between">
                                <button className="hover:scale-110" ><GoZoomIn /></button>
                                <button className="hover:scale-110" ><GoZoomOut /></button>
                                <button className="hover:scale-110" onMouseDown={() => showOrigImg()} onMouseUp={() => setWipeWidth(dimensions.width)} ><MdOutlineCompare /></button>
                                <button
                                    className={`hover:scale-110 transition-opacity ${historyIndex <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    onClick={handleUndo}
                                    disabled={historyIndex <= 0}
                                >
                                    <FaUndo />
                                </button>

                                <button
                                    className={`hover:scale-110 transition-opacity ${historyIndex >= history.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    onClick={handleRedo}
                                    disabled={historyIndex >= history.length - 1}
                                >
                                    <FaRedo />
                                </button>

                                <button className="hover:bg-blue-600 py-2 px-4 rounded-3xl text-nowrap bg-blue-500 text-white" onClick={() => handleDownload()}>Download </button>
                            </div>
                        </div>
                        <div className="relative flex flex-col gap-10 p-2">
                            <div className=" flex items-center justify-center gap-2 cursor-pointer transition-transform duration-300 ease-out hover:scale-105">
                                <div className=" font-extralight text-gray-400 w-8 h-8 flex items-center justify-center text-2xl border-2 border-gray-500 rounded-full transition-transform duration-300 ease-out">
                                    <IoAdd />
                                </div>
                                <p className=" text-gray-500 text-lg">Background</p>
                            </div>
                            <div className="absolute top-0 left-0 shadow-2xl bg-gray-200 overflow-auto p-3 min-w-80  rounded-3xl ">
                                <div className="flex gap-3 items-center justify-start my-2">
                                    <span
                                        className={`px-5 text-md py-1 rounded-xl cursor-pointer ${selectedPhoto ? "bg-white" : "bg-transparent"
                                            }`}
                                        onClick={() => setSelectedPhoto(true)}
                                    >
                                        Photo
                                    </span>
                                    <span
                                        className={`px-5 text-md py-1 rounded-xl cursor-pointer ${!selectedPhoto ? "bg-white" : "bg-transparent"
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
                                                onClick={() => handleNewBackground(img)}
                                            />
                                        ))}
                                    </div>) : (<div className="p-2 grid grid-cols-3 gap-4 overflow-auto max-h-[300px]">
                                        <div className="w-20 h-20 object-cover rounded-lg cursor-pointer border bg-red-600" onClick={() => handleColor("red")}>
                                        </div>
                                        <div className="w-20 h-20 object-cover rounded-lg cursor-pointer border bg-blue-600" onClick={() => handleColor("blue")}>
                                        </div>
                                        <div className="w-20 h-20 object-cover rounded-lg cursor-pointer border bg-green-600" onClick={() => handleColor("green")}>
                                        </div>
                                        <div className="w-20 h-20 object-cover rounded-lg cursor-pointer border bg-gray-600" onClick={() => handleColor("gray")}>
                                        </div>
                                        <div className="w-20 h-20 object-cover rounded-lg cursor-pointer border bg-red-600" onClick={() => handleColor("red")}>
                                        </div>
                                        <div className="w-20 h-20 object-cover rounded-lg cursor-pointer border bg-blue-600" onClick={() => handleColor("blue")}>
                                        </div>
                                        <div className="w-20 h-20 object-cover rounded-lg cursor-pointer border bg-green-600" onClick={() => handleColor("green")}>
                                        </div>
                                        <div className="w-20 h-20 object-cover rounded-lg cursor-pointer border bg-gray-600" onClick={() => handleColor("gray")}>
                                        </div>
                                        <div className="w-20 h-20 object-cover rounded-lg cursor-pointer border bg-red-600" onClick={() => handleColor("red")}>
                                        </div>
                                        <div className="w-20 h-20 object-cover rounded-lg cursor-pointer border bg-blue-600" onClick={() => handleColor("blue")}>
                                        </div>
                                        <div className="w-20 h-20 object-cover rounded-lg cursor-pointer border bg-green-600" onClick={() => handleColor("green")}>
                                        </div>
                                        <div className="w-20 h-20 object-cover rounded-lg cursor-pointer border bg-gray-600" onClick={() => handleColor("gray")}>
                                        </div>
                                    </div>)
                                }



                            </div>


                        </div>
                    </div>)
                }

            </div>

            {error && <p className="mt-4 text-red-500">{error}</p>}
        </div>
    );
};

// Checkerboard Pattern Function
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

    return canvas;
};

export default EditPage;
// <img src={
//     imageObj.history.length > 0
//         ? imageObj.history[imageObj.activeSnap].removeBgUrl || activeImage
//         : activeImage}
//     alt="Editing Preview"
//     className="w-full h-full object-contain" />