"use client";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/firebaseClient";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Signup() {
  const router = useRouter();
  const [phoneNum, setPhoneNum] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handlePress = (e) => {
    const regex = /^[0-9\b -]{0,13}$/;
    if (regex.test(e.target.value)) {
      setPhoneNum(e.target.value);
    }
  };
  useEffect(() => {
    if (phoneNum.length === 10) {
      setPhoneNum(phoneNum.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3"));
    }
    if (phoneNum.length === 13) {
      setPhoneNum(
        phoneNum.replace(/-/g, "").replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3")
      );
    }
  }, [phoneNum]);
  return (
    <div style={{ height: "80vh" }}>
      <div>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const inputs = e.target;
            // Firebase fire storeage user database implement
            const phone_regex = new RegExp(
              "01(?:0|1|[6-9])[.-]?(\\d{3}|\\d{4})[.-]?(\\d{4})"
            );

            if (inputs.name.value == null || inputs.name.value == "") {
              alert("Enter Your Name Please");
              return;
            } else if (inputs.email.value == null || inputs.email.value == "") {
              alert("Enter Your E-mail Please");
              return;
            } else if (phoneNum == null || phoneNum == "") {
              alert("Enter Your Phone Number Please");
              return;
            } else if (!phone_regex.test(phoneNum)) {
              alert("Enter Your Phone Number Please22");
              return;
            } else if (inputs.pass.value == null || inputs.email.value == "") {
              alert("Enter Your Password Please");
              return;
            } else if (inputs.pass.value.length < 6) {
              alert("Enter Your Password More Than 6 Letters Please");
              return;
            } else if (inputs.pass.value != inputs.passCheck.value) {
              alert("Your Passwords Are Not Same. Please Try Again");
              return;
            } else {
              if (!submitted) {
                const userData = {
                  name: inputs.name.value,
                  email: inputs.email.value,
                  phone: phoneNum,
                };
                setSubmitted(true);
                createUserWithEmailAndPassword(
                  auth,
                  inputs.email.value,
                  inputs.pass.value
                )
                  .then(async (userCredential) => {
                    const ref = doc(
                      db,
                      "users",
                      userCredential.user.uid.toString()
                    );
                    await setDoc(ref, userData);
                    router.push("/login");
                  })
                  .catch((e) => {
                    alert(e.message);
                    setSubmitted(false);
                  });
              }
            }
          }}
        >
          <div>
            <div>
              <div>Sign Up to join us</div>
            </div>
            <div>
              <div>
                <input placeholder="Name" id="name" type="text" />
              </div>

              <div>
                <input placeholder="E-mail" id="email" type="text" />
              </div>
              <div>
                <input
                  placeholder="Phone Number"
                  onChange={handlePress}
                  value={phoneNum}
                  type="text"
                />
              </div>
              <div>
                <input placeholder="Password" id="pass" type="password" />
              </div>
              <div>
                <input
                  placeholder="Password Check"
                  id="passCheck"
                  type="password"
                />
              </div>
            </div>
            <div>
              <button type="submit">SignUp</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
