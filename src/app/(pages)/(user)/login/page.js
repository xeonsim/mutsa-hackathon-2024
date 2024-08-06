"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/firebaseClient";
import Image from "next/image";
import LogoImage from "/public/aichImage.png";
import LogoText from "/public/aichText.png";

export default function Login() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-100 z-0">
      <div className="relative w-full max-w-md">
        <div className="absolute -top-20 left-1/4 transform -translate-x-1/2 z-10">
          <Image
            src={LogoImage}
            width={150}
            height={150}
            alt="Character Logo"
          />
        </div>
        <div className="relative bg-white p-layout rounded-layout shadow-md w-full z-20">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              signInWithEmailAndPassword(
                auth,
                e.target.email.value,
                e.target.pass.value
              )
                .then(() => {
                  router.push("/");
                })
                .catch((e) => console.log(e));
            }}
            className="space-y-6"
          >
            {/* <h2 className="text-3xl font-bold text-secondary-700">LOGO</h2> */}
            <div className="flex justify-center items-center">
              <Image src={LogoText} width={150} height={100} alt="Logo" />
            </div>
            <div className="space-y-4">
              <div>
                <input
                  placeholder="E-mail"
                  id="email"
                  type="text"
                  className="w-full p-3 border bg-secondary-100 border-secondary-300 rounded-layout focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <input
                  placeholder="Password"
                  id="pass"
                  type="password"
                  className="w-full p-3 border bg-secondary-100 border-secondary-300 rounded-layout focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            <div className="space-y-4">
              <button
                type="submit"
                className="w-full bg-purple-500 text-white font-bold py-3 px-4 rounded-layout hover:bg-purple-700 transition duration-300"
              >
                로그인
              </button>
              <div className="text-center text-secondary-500">or</div>
              <div className="text-center">
                <Link
                  href="/signup"
                  className="text-purple-500 hover:text-purple-700 font-semibold"
                >
                  회원 가입
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
