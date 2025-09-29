"use client"

import "./styles.css"
import { useState, useEffect } from "react"    
import { 
  Button, 
  Card, CardHeader, CardBody, CardFooter, 
  Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, 
  Input, Listbox, ListboxItem, ListboxSection,
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
  Textarea

} from "@heroui/react";
import { Nav } from "@/components/nav";
import { useRouter } from "next/navigation";
import { setNotes } from '../../store/notesSlice'
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faCheck, faPenToSquare, faPaperPlane, faTrash } from '@fortawesome/free-solid-svg-icons';
import { clearCredentials } from '../../store/credentialsSlice'

export default function Gallery() {

  const router = useRouter();
  const curr_username = useSelector((state: any) => state.cred.username);
  const curr_password = useSelector((state: any) => state.cred.password);
  const curr_notes = useSelector((state: any) => state.notes.notes);
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

  const [noteCards, setNoteCard] = useState<Note[]>([])
  const [activeTitle, setActiveTitle] = useState<string>("")
  const [activeModal, setActiveModal] = useState<number>(-1);

  useEffect(() => {
    // runs when the component mounts
    setNoteCard(curr_notes)
  }, []);

  useEffect(() => {
    console.log("--NOTE CARDS (UPDATED)--", noteCards);
  }, [noteCards]);

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
    );
  }

  function changeTitleVal(index: number) {
    console.log('--CHANGE NOTE--')
    console.log(noteCards)
    setNoteCard((prevItems) =>
      prevItems.map((item, i) =>
        i === index ? { ...item, title: activeTitle } : item
      )
    );
    setActiveModal(-1)
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

  async function saveNotes() {
    console.log('--NOTES TO SAVE--')
    console.log(noteCards)
    await fetch (`http://localhost:5000/add_notes`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: curr_username, password: curr_password, Notes: noteCards })
    })
    dispatch(setNotes(noteCards))
  }

  return (
    <div style={{border: "", justifyContent: "center"}}>
      <Nav />
      <div className="flex flex-row justify-evenly">
        <main className="bg-[#FFFFFF] border-3 border-[#3E2723] rounded-lg mx-auto mt-10 p-5 shadow-lg" style={styles['space']}>
          <center className="font-bold text-xl">
            <div>MY SPACES</div>
          </center>
          <Listbox className="p-10" selectionMode="single" variant="shadow">
            <ListboxSection className="flex flex-col justify-center">
              <ListboxItem className="p-5" key="1" >Personal</ListboxItem>
              <ListboxItem className="p-5"key="2" >Work</ListboxItem>
              <ListboxItem className="p-5">Ideas</ListboxItem>
              <ListboxItem className="p-5">To-Do</ListboxItem>
              <ListboxItem className="p-5" showDivider>Others</ListboxItem>
            </ListboxSection>
            <ListboxSection className="flex justify-center">
              <ListboxItem
                onPress={() => logOut()}
              >
                Log Out
              </ListboxItem>
            </ListboxSection>
          </Listbox>
        </main>
        <main 
          className="flex justify-around rounded-lg border-3 border-[#3E2723] mx-auto mt-10 p-5  bg-[#FFFFFF]"
          style={{
            display: "flex",
            width: "55vw",
            justifyContent: "space-evenly",
            height: "80vh", 
            flexDirection: "column", 
            gap: "1rem"
          }}
        >
          <div
          style={{...styles.notesGrid}} className="inset-shadow-lg hide-scrollbar flex overflow-y-auto justify-center pt-3 pb-3"
          >
            {
              noteCards.map((note: any, index: number) => (
                <div className="notecard" key={index}>
                  <textarea 
                    style={styles.noteTextArea}
                    value={note.content}
                    onChange={(e) => changeTextareaVal(index, e.target.value)} 
                    className="hide-scrollbar text-sm" 
                    placeholder="Take a note..."
                  >
                  </textarea>
                  <footer className="flex justify-between items-center w-full relative bottom-0 text-sm" style={{...styles.boldGenText, margin: "0.5rem"}}>
                    <div className="">
                      {note.title}
                    </div>
                    <Dropdown>
                      <DropdownTrigger>
                          <FontAwesomeIcon icon={faBars} 
                            className="cursor-pointer"
                          />
                      </DropdownTrigger>
                      <DropdownMenu>
                        <DropdownItem
                          key="edit_title"
                          description="Edit note title"
                          onClick={() => (setActiveModal(index))}
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
                          onClick={() => deleteNote(index)}
                          description="Delete entire note element"
                          startContent={<FontAwesomeIcon icon={faTrash} 
                            className="cursor-pointer"
                          />}
                        >
                          Delete
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                    <Modal isOpen={activeModal === index} onOpenChange={() => setActiveModal(-1)} className="p-2 pb-0">
                        <ModalContent>
                          <ModalHeader className="flex flex-col gap-1" style={styles['button_style']}><b>Title Edit</b></ModalHeader>
                          <ModalBody>
                            <Textarea
                              isClearable
                              // value={note.title}
                              className="hide-scrollbar"
                              labelPlacement="outside"
                              onChange={(e) => setActiveTitle(e.target.value)}
                              placeholder="Update title here..."
                              style={styles['button_style']}
                            />
                            <Button 
                              onClick={() => changeTitleVal(index)}
                              className="bg-[#3E2723] text-[#FFFFFF]"
                              style={styles['button_style']}
                            >
                              Submit Title
                            </Button>
                          </ModalBody>
                        </ModalContent>
                    </Modal>
                  </footer>
                </div>
              ))
            }
          </div>
          <div className="flex justify-evenly p-5">
            <Button 
              onClick={() => addNote()}
              radius="full"
              variant="shadow" 
              className="bg-[#3E2723] text-[#FFFFFF]"
              style={styles['button_style']}
            >
              Add
            </Button>
            <Button 
              onClick={() => saveNotes()} 
              radius="full"
              variant="shadow"
              className="bg-[#3E2723] text-[#FFFFFF]"
              style={styles['button_style']}
            >
              Save
            </Button>
          </div>
        </main>
        <main className="bg-[#FFFFFF] border-3 border-[#3E2723] rounded-lg mx-auto mt-10 p-5 shadow-lg" style={styles['space']}>
          <Card isFooterBlurred className="h-full">
            <CardHeader className="flex justify-center font-bold text-xl">FLASH AI</CardHeader>
            <CardBody>
              <p>This is an example</p>
            </CardBody>
            <CardFooter>
              <Input 
                endContent={
                  <FontAwesomeIcon icon={faPaperPlane} 
                    className="cursor-pointer"
                  />
                }
                variant="bordered" placeholder="Type your prompt here..." 
              />
            </CardFooter>
          </Card>
        </main>
      </div>
    </div>
  );
}