
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from 'react-redux';
import { clearCredentials } from '../store/credentialsSlice'
import { Avatar, Image, Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, DropdownItem, DropdownTrigger, Dropdown, DropdownMenu, } from "@heroui/react";

/**
 * displays nav bar with profile, app name, and logging out function
 * @returns navigation bar component
 */
export const Nav = () => {

  // routing and store dispatch instantiation
  const router = useRouter();
  const dispatch = useDispatch();

  // Redux state profile initial selectors
  const username = useSelector((state: any) => state.cred.username);
  const signedIn = useSelector((state: any) => state.cred.signedIn);

  // custom CSS styles
  let styles: { [key: string]: React.CSSProperties } = {
    button_style: { 
      fontFamily: "Josefin Slab",
      fontOpticalSizing: "auto",
      fontWeight: "600",
      fontStyle: "normal"
    }
  }

  /**
   * functionatity to log out and clear credentials
   */
  function logOut() {
    dispatch(clearCredentials())
    router.push('/')
  }
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
            <DropdownTrigger aria-label="profile options">
              <div>
                { !signedIn ? null : (<Avatar name={username ?? 'User'} color="warning" isBordered radius="sm" showFallback isFocusable/>)}
              </div>
            </DropdownTrigger>
            <DropdownMenu style={styles["button_style"]}>
              <DropdownItem key="profile">
                Profile
              </DropdownItem>
              <DropdownItem
                onPress={() => logOut()} 
                key="Logout"
              >
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
      </NavbarContent>
    </Navbar>
  );
};
