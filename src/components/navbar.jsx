"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { auth } from "@/firebase/firebaseClient";
import { onAuthStateChanged } from "firebase/auth";

export const Navbar = () => {
  const [logggedIn, setLogggedIn] = useState(false);
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setLogggedIn(true);
      } else {
        setLogggedIn(false);
      }
    });
  }, []);
  // State to manage the navbar's visibility
  const [nav, setNav] = useState(false);

  // Toggle function to handle the navbar's display
  const handleNav = () => {
    setNav(!nav);
  };

  return (
    <nav className="bg-slate-900 flex justify-between items-center h-24 mx-auto px-4 text-white">
      {/* Logo */}
      <Link href="/" className="flex items-center space-x-3">
        <h1 className="self-center md:text-2xl text-lg font-semibold whitespace-nowrap text-white">
          main{" "}
        </h1>
      </Link>

      {/* Desktop Navigation */}
      <ul className="hidden md:flex bg-slate-900 items-center">
        <NavItems logggedIn={logggedIn}></NavItems>
      </ul>

      {/* Mobile Navigation Icon */}
      <div onClick={handleNav} className="block md:hidden">
        {nav ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            viewBox="0 0 50 50"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M 7.71875 6.28125 L 6.28125 7.71875 L 23.5625 25 L 6.28125 42.28125 L 7.71875 43.71875 L 25 26.4375 L 42.28125 43.71875 L 43.71875 42.28125 L 26.4375 25 L 43.71875 7.71875 L 42.28125 6.28125 L 25 23.5625 Z"
            ></path>
          </svg>
        ) : (
          <svg
            className="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        )}
      </div>

      {/* Mobile Navigation Menu */}
      <ul
        onClick={handleNav}
        className={
          nav
            ? "fixed md:hidden left-0 top-0 w-[55%] h-full border-r border-r-gray-900 bg-slate-900 ease-in-out duration-500 flex flex-col items-center z-50 space-y-3"
            : "ease-in-out w-[60%] duration-500 fixed top-0 bottom-0 left-[-100%] flex flex-col items-center z-50 space-y-3"
        }
      >
        {/* Mobile Logo */}
        <Link href="/" className="flex items-center space-x-3 pt-5 pb-10">
          <h1 className="self-center md:text-2xl text-lg font-semibold whitespace-nowrap text-white">
            main
          </h1>
        </Link>

        {/* Mobile Navigation Items */}
        <NavItems logggedIn={logggedIn}></NavItems>
      </ul>
    </nav>
  );
};

function NavItems({ logggedIn }) {
  return (
    <>
      <li>
        <Link
          href="/"
          className="font-bold block m-3 mx-6 text-white hover:text-yellow-300"
        >
          Home
        </Link>
      </li>
      <li>
        {!logggedIn ? (
          <div>
            <Link href="/login">
              <span>LOGIN</span>
            </Link>
          </div>
        ) : (
          <Link href="/mypage">
            <svg
              viewBox="0 0 448 512"
              width="20px"
              height="20px"
              fill="#ffffff"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M224 256c70.7 0 128-57.31 128-128s-57.3-128-128-128C153.3 0 96 57.31 96 128S153.3 256 224 256zM274.7 304H173.3C77.61 304 0 381.6 0 477.3c0 19.14 15.52 34.67 34.66 34.67h378.7C432.5 512 448 496.5 448 477.3C448 381.6 370.4 304 274.7 304z"></path>
            </svg>
          </Link>
        )}
      </li>
    </>
  );
}
