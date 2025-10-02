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
import { setSpaces } from "@/store/spacesSlice";
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { clearCredentials } from '../../store/credentialsSlice'

export const Spaces = () => {
  const router = useRouter();
  const curr_username = useSelector((state: any) => state.cred.username);
  const curr_password = useSelector((state: any) => state.cred.password);
  const curr_notes = useSelector((state: any) => state.notes.notes);
  const curr_spaces = useSelector((state: any) => state.spaces.spaces);
  const dispatch = useDispatch();

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

  type Note = {
    index: number;
    title: string;
    content: string;
  };

  type Spaces = {
    index: number,
    name: string,
    notes: Array<Object>
  }

  const [spaceIndex, setSpaceIndex] = useState<number>(0)
  const [noteCards, setNoteCard] = useState<Note[]>([])
  const [spaceSections, setSpacesSection] = useState<Spaces[]>([])

  const [activeSpaceTitleEdit, setSpaceTitleEdit] = useState<boolean>(false)
  const [activeSpaceNewTitle, setSpaceNewTitle] = useState<boolean>(false)
  const [spaceUpdate, setSpaceUpdate] = useState<boolean>(false)

  useEffect(() => {
    // runs when the component mounts
    console.log("--SPACES--")
    console.log(curr_spaces)
    setSpacesSection(curr_spaces)
    dispatch(setNotes(curr_spaces[0].notes))
  }, []);


  useEffect(() => {
    console.log("--NOTE CARDS (UPDATED)--", noteCards);
    // let new_spaces = spaceSections.map((space) => {
    //   if (space.name === curr_spaces.name) {
    //     return {
    //       ...space,
    //       notes: noteCards
    //     };
    //   }

    //   return space
    // })

    // setSpaces(new_spaces)
  }, [noteCards]);

  useEffect(() => {
    console.log("--SPACES (UPDATED)--", spaceSections);
    dispatch(setSpaces(spaceSections))
  }, [spaceSections]);

  useEffect(() => {
    console.log("--SPACES (UPDATED)--", spaceSections);
    dispatch(setSpaces(spaceSections))

    if (spaceUpdate) {
      saveSpaces()
      setSpaceUpdate(false)
    }
  }, [spaceSections]);

  function logOut() {
    dispatch(clearCredentials())
    router.push('/')
  }

  function switchSpace(index: number) {
    console.log('--SWITCHING SPACE--')
    console.log(curr_spaces)
    // console.log(curr_spaces[index].notes)
    dispatch(setNotes(curr_spaces[index].notes))
    setNoteCard(curr_notes)
    setSpaceIndex(index)
  }

  function addSpace(name: string) {
    setSpacesSection((prevSpaces: Spaces[]) =>
      [
        ...prevSpaces,
        {
          index: prevSpaces.length,
          name: name,
          notes: [
            {
              index: 0,
              title: "Note #1",
              content: "",
            }
          ],
        }
      ]
    )
    setSpaceUpdate(true)
  }

  function deleteSpace(index: number) {
    let new_spaces = spaceSections
        .filter((space) => {
          return index !== space.index
        })
        .map((space, i) => {
          return {...space, index: i}
        })
    console.log('UPDATED WITH DEL--')
    console.log(new_spaces)
    setSpacesSection(new_spaces)
    setSpaceUpdate(true)
  }

  function changeSpaceTitleVal(index: number, name: string) {
    console.log('--CHANGE SPACE TITLE--')
    console.log(spaceSections)
    setSpacesSection((prevItems) =>
      prevItems.map((item, i) =>
        i === index ? { ...item, name: name } : item
      )
    );
    setSpaceUpdate(true)
  }

  async function saveSpaces() {
      console.log('--SAVING SPACES--')
      console.log(spaceSections)

      await fetch (`http://localhost:5000/update_spaces`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: curr_username, password: curr_password, Spaces: spaceSections })
      })
      dispatch(setSpaces(spaceSections))
  }
  return (
    <main className="bg-[url('/images/gallery/background_design_wave.png')] border-3 border-[#3E2723] rounded-lg mx-auto mt-10 p-5 shadow-lg" style={styles['space']}>
        <center className="font-bold text-xl">
        <div>MY SPACES</div>
        </center>
        <Listbox key="spaces_box" className="p-10" selectionMode="single" variant="shadow">
        <ListboxSection key="spaces" className="flex flex-col justify-center text-lg" showDivider>
            {
            spaceSections.map((space: any, index: number) => (
                <ListboxItem color="warning" className="flex items-center justify-between pt-5 pb-5 pr-1 pl-5 right-0" key={index} onPress={() => switchSpace(index) }>
                <div className="flex-1 text-lg text-center">
                    {space.name}
                    <Dropdown className="w-2 ml-auto">
                    <DropdownTrigger>
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
                                console.log(`SPACE TITLE: ${data.title}`)
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
                            type="title"   
                            style={styles['button_style']}
                            />
                            <Button type="submit" variant="bordered"
                            className="bg-[#3E2723] text-[#FFFFFF]"
                            style={styles['button_style']}
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
                            console.log(`SPACE TITLE: ${data.title}`)
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
                        type="title"   
                        style={styles['button_style']}
                        />
                        <Button type="submit" variant="bordered"
                        className="bg-[#3E2723] text-[#FFFFFF]"
                        style={styles['button_style']}
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
            >
            <div className="text-lg font-bold">Log Out</div>
            </ListboxItem>
        </ListboxSection>
        </Listbox>
    </main>
  )
}
