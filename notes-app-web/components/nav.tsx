

import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button } from "@heroui/react";

export const Nav = () => {


  return (
    <Navbar shouldHideOnScroll maxWidth="full" style={{marginTop: "0.5rem", border: "2px solid red"}}>
      <NavbarContent justify="center" className="w-full">
        <NavbarItem>
          <Link>
            <div style={{fontSize: "2.5rem"}}>GOLDEN NOTES</div>
          </Link>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};
