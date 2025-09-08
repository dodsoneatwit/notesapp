"use client"

import { useState } from "react"    
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button } from "@heroui/react";
import { Nav } from "@/components/nav";
import { useSelector, useDispatch } from 'react-redux';


export default function Gallery() {

  const [signingUp, changeForm] = useState(true)
  const curr_email = useSelector((state: any) => state.cred.email);
  const curr_password = useSelector((state: any) => state.cred.password);

  let styles = {
    signInButton: { marginLeft: "0.5rem", padding: "0.5rem", border: "2px dodgerblue"}
  }

  return (
    <div style={{border: "2px solid red"}}>
      <Nav />
      <main>
        YOU MADE IT { curr_email }
      </main>
    </div>
  );
}