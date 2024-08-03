"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/firebaseClient";

export default function Login() {
  const router = useRouter();
  auth;
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-100">
      <div className="bg-white p-layout rounded-layout shadow-md w-full max-w-md">
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
          <div className="text-center">
            <h2 className="text-3xl font-bold text-secondary-700">LOGO</h2>
          </div>
          <div className="space-y-4">
            <div>
              <input
                placeholder="E-mail"
                id="email"
                type="text"
                className="w-full p-3 border border-secondary-300 rounded-layout focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <input
                placeholder="Password"
                id="pass"
                type="password"
                className="w-full p-3 border border-secondary-300 rounded-layout focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          <div className="space-y-4">
            <button
              type="submit"
              className="w-full bg-primary-500 text-white font-bold py-3 px-4 rounded-layout hover:bg-primary-700 transition duration-300"
            >
              로그인
            </button>
            <div className="text-center text-secondary-500">or</div>
            <div className="text-center">
              <Link
                href="/signup"
                className="text-primary-500 hover:text-primary-700 font-semibold"
              >
                회원 가입
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
