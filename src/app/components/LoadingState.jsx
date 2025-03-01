import React from 'react'
import { IoIosGitCompare, IoMdAdd } from 'react-icons/io'
import { MdAdd, MdAutoFixHigh, MdHeartBroken, MdOutlineCompare } from 'react-icons/md'
import { PiArrowBendUpLeftBold, PiArrowBendUpRightBold } from 'react-icons/pi'
import { RiDeleteBin5Line, RiSubtractLine } from 'react-icons/ri'
const LoadingState = ({ width, height }) => {
    return (
        <div className='relative flex flex-col items-center justify-center min-h-screen bg-white border-2 border-red-600 w-full'>
            <div className="w-full h-full bg-white">
                {/*image section*/}
                <div className="flex mb-10 gap-10 items-stretch justify-center  rounded-lg overflow-hidden">
                    {/*image left section*/}
                    <div className="flex-1 flex flex-col items-end">
                        <div className="relative rounded-2xl h-full">
                            {/* Background Layer */}
                            <div className="absolute inset-0 bg-gray-300 rounded-2xl"></div>
                            {/* GIF Layer */}
                            <div
                                className="absolute inset-0 bg-cover bg-center opacity-50 rounded-2xl"
                                style={{ backgroundImage: "url('https://www.textures4photoshop.com/tex/thumbs/animated-sparkle-overlay-for-photoshop-thumb38.gif')" }}
                            ></div>

                            {/* Backdrop Layer */}
                            {/* Your Existing Div (Unchanged) */}
                            <div className="bg-gray-400 opacity-5 rounded-2xl relative" style={{ width: width, height: height }}>
                            </div>
                        </div>
                        {/* Buttons for Undo/Redo (Optional) */}
                        <div className="mt-5 flex gap-6 text-xl text-blackw-full items-center justify-end text-black">
                            <button><RiSubtractLine /></button>
                            <button>  <MdAdd /></button>
                            <button><IoIosGitCompare /></button>
                            <button><PiArrowBendUpLeftBold /></button>
                            <button ><PiArrowBendUpRightBold /></button>
                            <button className='text-white py-1 px-8 rounded-3xl bg-white' >Download </button>
                        </div>
                    </div>
                    {/*image right section*/}
                    <div className="relative flex-1  flex flex-col items-start">
                        <span className="bg-gray-300 text-gray-300 mb-5 gap-2 cursor-pointer p-2 rounded-lg">
                            <span className="border-4 border-gray-300 rounded-full transition-transform duration-200 group-hover:scale-105">
                                <MdAdd className=" inline-block p-1 text-3xl text-gray-300" />
                            </span>
                            <span className=" font-semibold transition-transform duration-200 group-hover:scale-105">
                                Background
                            </span>
                        </span>
                        <span className="bg-gray-300 text-gray-300 mb-5 gap-2 cursor-pointer p-2 rounded-lg">
                            <span className="border-4 border-gray-300 rounded-full transition-transform duration-200 group-hover:scale-105">
                                <MdAdd className=" inline-block p-1 text-3xl text-gray-300" />
                            </span>
                            <span className=" font-semibold transition-transform duration-200 group-hover:scale-105">
                                Background
                            </span>
                        </span>


                    </div>
                </div>
                {/*footer  section*/}
                <div className="w-full h-20 flex items-end justify-between gap-3 px-10 absolute bottom-5 ">
                    <div className="flex items-center justify-center gap-3">
                        <button className="text-2xl text-blue-500 p-4 rounded-lg bg-blue-100">
                            <IoMdAdd />
                        </button>
                    </div>

                    <div className="text-xl  text-gray-500 flex items-center 
                                    justify-center">
                        <span className="text-lg mr-10">
                            Rate this result <MdHeartBroken className="inline-block cursor-pointer ml-4" />
                        </span>
                        <button className="cursor-pointer"><RiDeleteBin5Line /></button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoadingState