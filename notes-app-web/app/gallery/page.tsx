"use client"

import "./styles.css"
import { useState, useEffect } from "react"    
import { 
  Button,
  Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, 
  Form, Input, Listbox, ListboxItem, ListboxSection,
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
  Textarea

} from "@heroui/react";
import { Nav } from "@/components/nav";
import { Spaces } from "./spaces"
import { Notes } from "./notes"
import { FlashAI } from "./flashai"
import { useRouter } from "next/navigation";
import { setNotes } from '../../store/notesSlice'
import { setSpaces } from "@/store/spacesSlice";
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faCaretDown, faPenToSquare, faPaperPlane, faTrash } from '@fortawesome/free-solid-svg-icons';
import { clearCredentials } from '../../store/credentialsSlice'

export default function Gallery() {

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
    },
    generalText: { fontFamily: "Delius, cursive",fontWeight: "400",fontStyle: "normal"},
    boldGenText: { fontFamily: "Delius, cursive", fontWeight: "800",fontStyle: "normal"},
    notesGrid: { 
      display: "flex",
      gap: "1rem",
      flexWrap: "wrap" as const,
    },
    noteCardBody: {
      flex: "1 1 calc(33.33% - 20px)", border: "1px solid rgb(0, 0, 0)",
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      borderRadius: "0.5rem",
      background: "rgba(238, 213, 175, 0.97)",
      minWidth: "250px",
      maxWidth: "350px",
      transition: "box-shadow 0.2s",
    },
    noteTextArea: {
      fontFamily: "Josefin Slab",
      fontOpticalSizing: "auto",
      fontWeight: "600",
      fontStyle: "normal",
      width: "100%", 
      height: "10vh",
      border: "none", 
      outline: "none",
      resize: "none" as const,
      borderRadius: "8px",
      padding: "0.75rem",
      scrollbarWidth: 'none' as const,
    },
    noteHeader: {
      borderTopRightRadius: "0.5rem",
      borderTopLeftRadius: "0.5rem",
      backgroundColor: "rgba(0, 0, 0)",
      marginTop: "0%",
      paddingLeft: "0.75rem",
      paddingRight: "0.75rem",
      color: "white",
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

  const [activeTitle, setActiveTitle] = useState<string>("")
  const [activeModal, setActiveModal] = useState<number>(-1);

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
    console.log('--FETCHED NOTES GALLERY--')
    console.log(curr_notes)
    setNoteCard(curr_notes)
  }, [curr_notes])

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

  function changeTextareaVal(index: number, value: string) {
    console.log('--CHANGE NOTE--')
    console.log(noteCards)
    setNoteCard((prevItems) =>
      prevItems.map((item, i) =>
        i === index ? { ...item, content: value } : item
      )
    )
  }

  function changeNoteTitleVal(index: number) {
    console.log('--CHANGE NOTE TITLE--')
    console.log(noteCards)
    setNoteCard((prevItems) =>
      prevItems.map((item, i) =>
        i === index ? { ...item, title: activeTitle } : item
      )
    );
    setActiveModal(-1)
  }

  function switchSpace(index: number) {
    console.log('--SWITCHING SPACE--')
    console.log(curr_spaces)
    // console.log(curr_spaces[index].notes)
    dispatch(setNotes(curr_spaces[index].notes))
    setNoteCard(curr_notes)
    setSpaceIndex(index)
  }

  function addNote() {
    setNoteCard((prevCards: Note[]) =>
      [
        ...prevCards,
        {
          index: prevCards.length,
          title: `Note #${prevCards.length + 1}`,
          content: "",
        }
      ]
    )
  }

  function deleteNote(index: number) {
      let new_notes = noteCards
        .filter((note) => {
          return index !== note.index
        })
        .map((note, i) => {
          return {...note, index: i}
        })

      setNoteCard(new_notes)
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

  async function saveNotes() {
    console.log('--NOTES TO SAVE--')
    console.log(noteCards)

    await fetch (`http://localhost:5000/add_notes_spaces`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: curr_username, password: curr_password, spname: curr_spaces[spaceIndex].name, Notes: noteCards })
    })
    dispatch(setNotes(noteCards))
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
    <div style={{border: "", justifyContent: "center"}}>
      <Nav />
      <div className="flex flex-row justify-evenly">
        <Spaces />
        <Notes />
        <FlashAI />
      </div>
    </div>
  );
};