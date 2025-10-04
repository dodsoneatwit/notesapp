
"use client"

import { useState, useEffect } from "react"
import SignInForm from "../components/signinForm"
import { Button, Image } from "@heroui/react";
import { Nav } from "@/components/nav";
import "./styles.css"


export default function Home() {

  // localStorage.clear()
  const [signingUp, changeForm] = useState(true)

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.clear();
    }
  }, []);

  let styles: { [key: string]: React.CSSProperties } = {
    signInInfo: { 
      marginLeft: "0.5rem", padding: "0.5rem",
      fontFamily: "Josefin Slab",
      fontOpticalSizing: "auto",
      fontWeight: "600",
      fontStyle: "normal"
    },
    formWelcomeMessage: {
      fontFamily: "Josefin Slab",
      fontOpticalSizing: "auto",
      fontWeight: "700",
      fontStyle: "normal"
    },
    imageMessage: {
      fontFamily: "Josefin Slab",
      fontOpticalSizing: "auto",
      fontWeight: "500",
      fontStyle: "normal"
    },
  }

  return (
    <div className="bg-[#FDF6E3] min-h-screen">
      <main className="bg-[#FDF6E3]">
        <Nav />
        <div className="flex flex-row m-auto mt-2 p-10 flex-container" >
          <div className="basis-2/4">
            <center className="m-5">
              <Image
                className="shadow-md border-2 border-[#8D6E63] h-45 w-45 md:h-125 md:w-125"
                alt="Flash Notes welcome icon image"
                src="images/signinpage/notesappicon.png"
              />
              <h1 className="text-[#2C1810] mt-5" style={styles.imageMessage}>Where Your Thoughts Are Written in a Flash</h1>
            </center>
          </div>
          <div className="basis-2/4 flex flex-col bg-[#FFFFFF] shadow-md rounded-md p-4">
            <div className="basis-2/3">
              <h1 className="font-medium text-[1rem] text-[#2C1810] m-10" style={styles.formWelcomeMessage}>
                <center>
                  WELCOME TO THE BEST NOTES APP
                  <br></br>
                  Ready to Start?
                </center>
              </h1>
              <SignInForm
                signingUp={signingUp} 
              />
            </div>
            <div className="flex items-center justify-center basis-1/3 text-[#2C1810]" style={styles['signInInfo']}>
              {
                signingUp ? (
                  <>
                    Already have an account?
                    <Button
                      onClick={() => changeForm(false)}
                      style={styles['signInInfo']}
                      radius="full"
                      variant="shadow"
                      className="bg-[#3E2723] text-[#FFFFFF]"
                      aria-label="login to account"
                    >
                      Login Here
                    </Button>
                  </>
                ) : (
                  <>
                    Don't have an account?
                    <Button 
                      onClick={() => changeForm(true)}
                      style={styles['signInInfo']}
                      radius="full"
                      variant="shadow"
                      className="bg-[#3E2723] text-[#FFFFFF]"
                      aria-label="Create account"
                    >
                      Create One
                    </Button>
                  </>
                )
              }
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
