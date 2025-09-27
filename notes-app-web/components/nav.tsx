
import { useSelector } from 'react-redux';
import { Avatar, Image, Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, DropdownItem, DropdownTrigger, Dropdown, DropdownMenu, } from "@heroui/react";

export const Nav = () => {

  // Redux state profile initial selectors
  const username = useSelector((state: any) => state.cred.username);
  const signedIn = useSelector((state: any) => state.cred.signedIn);

  return (
    <Navbar isBordered shouldHideOnScroll maxWidth="full" style={{marginTop: "0.5rem", border: ""}}>
      <NavbarBrand className="max-w-11">
        <Image
          className="shadow-md border-2 border-[#8D6E63] h-10 w-auto object-contain"
          alt="Flash Notes welcome icon image"
          src="images/signinpage/notesappicon.png"
        />
      </NavbarBrand>
      <NavbarContent justify="start" className="w-full">
        <NavbarItem>
          <Link>
            <div 
              style={{
                fontSize: "2.5rem", 
                fontFamily: "Delius, cursive",
                fontWeight: "400",
                fontStyle: "normal",
                color: "black"
              }}
            >
              FLASH NOTES
            </div>
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end"
          style={{
            fontSize: "2.5rem", 
            fontFamily: "Delius, cursive",
            fontWeight: "400",
            fontStyle: "normal",
            color: "black",
          }}
        >
          <Dropdown backdrop='blur' style={{ marginRight: "1rem", cursor: "pointer" }}>
            <DropdownTrigger>
              <NavbarItem
                style={{ cursor: "pointer", marginRight: "1rem", backgroundColor: "rgb(210, 105, 30, 0.7)"}}
              >
                  { !signedIn ? null : (<Avatar name={username ?? ''} color="warning" isBordered radius="sm" showFallback isFocusable/>)}
              </NavbarItem>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem key="profile">
                Profile
              </DropdownItem>
              <DropdownItem key="Logout">
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
      </NavbarContent>
    </Navbar>
  );
};
