"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/app/firebase/firebaseClient";

export default function Login() {
  const router = useRouter();
  auth;
  return (
    <div style={{ height: "80vh" }}>
      <div>
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
        >
          <div>
            <div>
               <div>Login!</div>
            </div>
            <div>
              <div>
                <input placeholder="E-mail" id="email" type="text" />
              </div>
              <div>
                <input placeholder="Password" id="pass" type="password" />
              </div>
            </div>
            <div>
              <button type="submit">Login</button>
            </div>
            <p>or</p>
            <div>
              <Link href="/signup">Sign up</Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
