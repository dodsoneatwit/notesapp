
"use client"

import { useState } from "react"
import SignInForm from "../components/signinForm"
import { Button } from "@heroui/react";
import { Nav } from "@/components/nav";


export default function Home() {

  const [signingUp, changeForm] = useState(true)

  let styles = {
    signInButton: { marginLeft: "0.5rem", padding: "0.5rem", border: "2px dodgerblue"}
  }

  return (
    <div style={{border: "2px solid red"}}>
      <main>
        <Nav />
        <SignInForm signingUp={signingUp} />
        <div>
          <div>
            {
              signingUp ? (
                <>
                  Already have an account?
                  <Button 
                    onClick={() => changeForm(false)}
                    style={styles['signInButton']}
                    radius="full"
                    variant="shadow"
                    color="primary"
                  >
                    Login Here
                  </Button>
                </>
              ) : (
                <>
                  Don't have an account?
                  <Button 
                    onClick={() => changeForm(true)}
                    style={styles['signInButton']}
                    radius="full"
                    variant="shadow"
                    color="primary"
                  >
                    Create One
                  </Button>
                </>
              )
            }
          </div>
        </div>
      </main>
    </div>
  );
}
