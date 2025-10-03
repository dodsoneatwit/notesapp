"use client"

import "./styles.css"
import { useState, useEffect } from "react"    
import { 
  Button,
  Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, 
  Form, Input, Listbox, ListboxItem, ListboxSection,
  Modal, ModalContent, ModalBody
} from "@heroui/react";
import { useRouter } from "next/navigation";
import { setNotes } from '../../store/notesSlice'
import { setSpaces, setSpIndex } from "@/store/spacesSlice";
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { clearCredentials } from '../../store/credentialsSlice'

/**
 * includes section for different areas of notetaking 
 * @returns Spaces component
 */
export const Spaces = () => {

  // routing to other pages
  const router = useRouter();

  // global store variables
  const curr_username = useSelector((state: any) => state.cred.username);
  const curr_password = useSelector((state: any) => state.cred.password);
  const curr_spaces = useSelector((state: any) => state.spaces.spaces);
  const dispatch = useDispatch();

  // type for defining notes  and spaces
  type Spaces = { index: number, name: string, notes: Array<Object> }

  // custom CSS styles
  let styles: { [key: string]: React.CSSProperties } = {
    button_style: { 
      fontFamily: "Josefin Slab",
      fontOpticalSizing: "auto",
      fontWeight: "600",
      fontStyle: "normal"
    },
    space: { 
      fontFamily: "Josefin Slab",
      fontOpticalSizing: "auto",
      fontWeight: "600",
      fontStyle: "normal"
    }
  }

  // space section and index instance management
  const [spaceIndex, setSpaceIndex] = useState<number>(0)

  // managing active space titles and section updates
  const [activeSpaceTitleEdit, setSpaceTitleEdit] = useState<boolean>(false)
  const [activeSpaceNewTitle, setSpaceNewTitle] = useState<boolean>(false)
  const [spaceUpdate, setSpaceUpdate] = useState<boolean>(false)

  useEffect(() => {
    // runs when the component mounts
    console.log("-- *SPACE* SPACES--")
    console.log(curr_spaces)
    dispatch(setNotes(curr_spaces[0]?.notes ?? []))
  }, []);

  useEffect(() => {
    // runs when current spaces array is mutated
    console.log("--NEW UDPATED SPACES--")
    console.log(curr_spaces)

    // saves spaces after additions, title change, and/or deletions
    if (spaceUpdate) {
      saveSpaces()
      setSpaceUpdate(false)
    }
  }, [curr_spaces]);

  /**
   * clears credentials in store and switches
   * routing to login/sign up screen
   */
  function logOut() {
    // triggers store function
    dispatch(clearCredentials())
    router.push('/')
  }

  /**
   * switches to space based on given index
   * @param index index of current space
   */
  function switchSpace(index: number) {
    // sets new index
    setSpaceIndex(index)
    // sets space index and current notes globally
    dispatch(setSpIndex(index))

    // sets notes global state
    dispatch(setNotes(curr_spaces[index]?.notes ?? []))
  }

  /**
   * creates new space with given name
   * @param name name of new space to be added
   */
  function addSpace(name: string) {
    // adds new spaces to global space variable
    dispatch(
      setSpaces([
        ...curr_spaces,
        {
          index: curr_spaces.length,
          name: name,
          notes: [ // gives default values
            {
              index: 0,
              title: "Note #1",
              content: "",
            }
          ]
        }
      ])
    )
    // triggers boolean to ensure save on space addition
    setSpaceUpdate(true)
  }

  /**
   * deletes space in array based on index
   * @param index index of new space to be deleted
   */
  function deleteSpace(index: number) {
    // creates temporary 
    let new_spaces = curr_spaces
        .filter((space: Spaces) => {
          return index !== space.index
        })
        .map((space: Spaces, i: number) => {
          return {...space, index: i}
        })

    // saves mutated spaces to global variable
    dispatch(setSpaces(new_spaces))

    // triggers boolean to save after deletion
    setSpaceUpdate(true)

    // decrease index if recent space
    if (spaceIndex >= curr_spaces.length) { // switch to last available space
      switchSpace(curr_spaces.length - 1)
    } else if (spaceIndex === index) { // switch to previous space
      switchSpace(index - 1)
    }
  }

  /**
   * changes name of space
   * @param index current space index
   * @param name new name for current space
   */
  function changeSpaceTitleVal(index: number, name: string) {
    // changes title and saves space to global variable
    dispatch(
      setSpaces(
        curr_spaces.map((space: Spaces, i: number) =>
          i === index ? { ...space, name: name } : space // changes only index match
        )
      )
    )
    // triggers boolean for ensuring save on title change
    setSpaceUpdate(true)
  }

  /**
   * saves spaces to MongoDB database
   */
  async function saveSpaces() {
      // saves changes to spaces in MongoDB through API request
      await fetch (`http://localhost:5000/update_spaces`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: curr_username, password: curr_password, Spaces: curr_spaces })
      })
  }
  return (
    <main className="bg-[url('/images/gallery/background_design_wave.png')] border-3 border-[#3E2723] rounded-lg mx-auto mt-10 p-5 shadow-lg" style={styles['space']}>
      <center className="font-bold text-xl">
        <div>MY SPACES</div>
      </center>
      <Listbox key="spaces_box" className="p-10" selectionMode="single" variant="shadow" aria-label="spaces section">
        <ListboxSection key="spaces" className="flex flex-col justify-center text-lg" showDivider>
            {
              curr_spaces.map((space: any, index: number) => (
                  <ListboxItem  textValue="space" color="warning" className="flex items-center justify-between pt-5 pb-5 pr-1 pl-5 right-0" key={index} onPress={() => switchSpace(index) }>
                    <div className="flex-1 text-lg text-center">
                        {space.name}
                        <Dropdown className="w-2 ml-auto" disableAnimation>
                          <DropdownTrigger aria-label="open space menu options">
                              <FontAwesomeIcon icon={faCaretDown} 
                                  className="cursor-pointer ml-10"
                                  size="2xs"
                              />
                          </DropdownTrigger>
                          <DropdownMenu>
                              <DropdownItem
                              key="edit_title"
                              description="Edit space title"
                              onPress={() => setSpaceTitleEdit(true)}
                              startContent={
                                  <FontAwesomeIcon icon={faPenToSquare} 
                                  className="cursor-pointer"
                                  />
                              }
                              >
                              Edit
                              </DropdownItem>
                              <DropdownItem
                              key="delete"
                              onClick={() => deleteSpace(index)}
                              description="Delete entire space element"
                              startContent={<FontAwesomeIcon icon={faTrash} 
                                  className="cursor-pointer"
                              />}
                              >
                              Delete
                              </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                        <Modal isOpen={activeSpaceTitleEdit} onOpenChange={() => setSpaceTitleEdit(false)} className="p-2 pb-0">
                          <ModalContent>
                              <ModalBody>
                                <Form 
                                    className="w-full max-w-xs font-extrabold" 
                                    style={styles['button_style']}
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        let data = Object.fromEntries(new FormData(e.currentTarget));
                                        setSpaceTitleEdit(false)
                                        changeSpaceTitleVal(index, String(data.title))
                                    }}
                                >
                                    <Input
                                      isRequired
                                      errorMessage="Please enter a valid title"
                                      label="Edit Title for Space"
                                      labelPlacement="outside"
                                      name="title"
                                      placeholder="Enter title"
                                      type="text"   
                                      style={styles['button_style']}
                                      autoComplete="off"
                                    />
                                    <Button 
                                      type="submit" 
                                      variant="bordered"
                                      className="bg-[#3E2723] text-[#FFFFFF]"
                                      style={styles['button_style']}
                                      aria-label="save title"
                                    >
                                      Save Title
                                    </Button>
                                </Form>
                              </ModalBody>
                          </ModalContent>
                        </Modal>
                    </div>
                  </ListboxItem>
              ))
            }
        </ListboxSection>
        <ListboxSection className="flex justify-center" showDivider>
            <ListboxItem
              key="add"
              color="warning"
              onPress={() => setSpaceNewTitle(true)}
              textValue="Add Space"
            >
              <div className="text-lg font-bold">Add Space</div>
              <Modal isOpen={activeSpaceNewTitle} onOpenChange={() => setSpaceNewTitle(false)} className="p-2 pb-0">
                  <ModalContent>
                      <ModalBody>
                        <Form 
                            className="w-full max-w-xs font-extrabold" 
                            style={styles['button_style']}
                            onSubmit={(e) => {
                                e.preventDefault();
                                let data = Object.fromEntries(new FormData(e.currentTarget));
                                setSpaceNewTitle(false)
                                addSpace(String(data.title))
                            }}
                        >
                            <Input
                              isRequired
                              errorMessage="Please enter a valid title"
                              label="CREATE YOUR SPACE"
                              labelPlacement="outside"
                              name="title"
                              placeholder="Enter title"
                              type="text"   
                              style={styles['button_style']}
                              autoComplete="off"
                            />
                            <Button 
                              type="submit" 
                              variant="bordered"
                              className="bg-[#3E2723] text-[#FFFFFF]"
                              style={styles['button_style']}
                              aria-label="create space"
                            >
                              Submit
                            </Button>
                        </Form>
                      </ModalBody>
                  </ModalContent>
              </Modal>
            </ListboxItem>
        </ListboxSection>
        <ListboxSection className="flex justify-center">
            <ListboxItem
              key="log_out"
              color="warning"
              onPress={() => logOut()}
              textValue="log out"
            >
              <div className="text-lg font-bold">Log Out</div>
            </ListboxItem>
        </ListboxSection>
      </Listbox>
    </main>
  )
}
