
"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ImageContextProvider } from "../context/ImageContextProvider.jsx"
import { IoIosArrowDown } from "react-icons/io";
import { useState } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export default function RootLayout({ children }) {
  const [dropdown, setDropdown] = useState(false)
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <nav className="fixed top-0 bg-white opacity-90 w-full flex items-center justify-between px-10 h-20 z-10"  >
          <span id="logo" className="text-4xl font-bold  text-gray-800 flex-1">
            remove <span className="text-gray-600">bg</span>
          </span>
          <ul className="flex items-center justify-center gap-2  text-gray-600 cursor-pointer">
            <li className="hover:bg-gray-200 hover:rounded-3xl hover:text-black px-6 py-2">
              Remove Background
            </li>
            <li onClick={()=>setDropdown(!dropdown)} className="relative flex gap-5 items-center justify-center hover:bg-gray-200 hover:rounded-3xl hover:text-black px-6 py-2">
              Features <IoIosArrowDown />
            </li>
            {
              dropdown && <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-white shadow-2xl p-3 rounded-2xl">
                <ul className="flex flex-col w-96 gap-2 ">
                  <li className="flex gap-2 hover:bg-gray-200 p-3 rounded-xl">
                    <img className="h-16 w-20 rounded-lg" src="https://images.unsplash.com/photo-1739056656210-7c3cab6fff42?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MTMyNjl8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDA5ODEwOTZ8&ixlib=rb-4.0.3&q=80&w=400" alt="asdfghj" />
                    <div className="flex flex-col items-start">
                      <h2 className="text-black">ggh kljk j</h2>
                      <p className="leading-4">Lorem ipsum dolor sit amet cloribus est veniam! Sapiente.</p>
                    </div>
                  </li>
                  <li className="flex gap-2 hover:bg-gray-200 p-2 rounded-xl">
                    <img className="h-16 w-20 rounded-lg" src="https://images.unsplash.com/photo-1739056656210-7c3cab6fff42?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MTMyNjl8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDA5ODEwOTZ8&ixlib=rb-4.0.3&q=80&w=400" alt="asdfghj" />
                    <div className="flex flex-col items-start">
                      <h2 className="text-black">ggh kljk j</h2>
                      <p className="leading-4">Lorem ipsum dolor sit amet cloribus est veniam! Sapiente.</p>
                    </div>
                  </li>
                  <li className="flex gap-2 hover:bg-gray-200 p-2 rounded-xl">
                    <img className="h-16 w-20 rounded-lg" src="https://images.unsplash.com/photo-1739056656210-7c3cab6fff42?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MTMyNjl8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDA5ODEwOTZ8&ixlib=rb-4.0.3&q=80&w=400" alt="asdfghj" />
                    <div className="flex flex-col items-start">
                      <h2 className="text-black">ggh kljk j</h2>
                      <p className="leading-4">Lorem ipsum dolor sit amet cloribus est veniam! Sapiente.</p>
                    </div>
                  </li>
                </ul>
              </div>
            }
            <li className="hover:bg-gray-200 hover:rounded-3xl hover:text-black px-6 py-2">
              For Business
            </li>
            <li className="hover:bg-gray-200 hover:rounded-3xl hover:text-black px-6 py-2">
              pricing
            </li>

          </ul>
          <ul className="flex items-center justify-end flex-1 gap-1 text-gray-600 cursor-pointer">
            <li className="hover:bg-gray-200 hover:rounded-3xl hover:text-black px-6 py-2">Login</li>
            <li className=" hover:bg-gray-300 bg-gray-200 rounded-3xl text-black  px-6 py-2">SignUp</li>
          </ul>
        </nav>
        <ImageContextProvider>{children}</ImageContextProvider>
      </body>
    </html>
  );
}
