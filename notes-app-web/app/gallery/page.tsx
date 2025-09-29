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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faCheck, faPenToSquare, faPaperPlane, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from 'react-redux';
import { setNotes } from '../../store/notesSlice'

export default function Gallery() {

  const curr_username = useSelector((state: any) => state.cred.username);
  const curr_password = useSelector((state: any) => state.cred.password);
  const curr_notes = useSelector((state: any) => state.notes.notes);
  const dispatch = useDispatch();

  let styles = {
    signInButton: { marginLeft: "0.5rem", padding: "0.5rem", border: "2px dodgerblue"},
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
      fontFamily: "Delius, cursive", fontWeight: "800",fontStyle: "normal", 
      width: "100%", 
      height: "10vh",
      border: "none", 
      outline: "none",
      resize: "none" as const,
      borderRadius: "8px",
      padding: "0.75rem",
      fontSize: "1rem",
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
    // Runs when the component mounts
    setNoteCard(curr_notes)
  }, []);

  useEffect(() => {
    console.log("--NOTE CARDS (UPDATED)--", noteCards);
  }, [noteCards]);

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
      <div className="flex flex-row justify-evenly border-2 border-red-600">
        <main className="border-2 border-red-600 mx-auto mt-10 p-5">
          <Listbox className="h-full border-2 border-red-600 p-10">
            <ListboxSection title="Spaces">
              <ListboxItem key="1" description="Personal">Personal</ListboxItem>
              <ListboxItem key="2" description="Work">Work</ListboxItem>
              <ListboxItem key="3" description="Ideas">Ideas</ListboxItem>
              <ListboxItem key="4" description="To-Do">To-Do</ListboxItem>
              <ListboxItem key="5" description="Others">Others</ListboxItem>
            </ListboxSection>
          </Listbox>
        </main>
        <main 
          className="flex justify-around border-2 border-red-600 mx-auto mt-10 p-5"
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
          style={{...styles.notesGrid}} className=" flex overflow-y-auto justify-center "
          >
            {
              noteCards.map((note: any, index: number) => (
                <div className="notecard" key={index}>
                  <textarea 
                    style={styles.noteTextArea}
                    value={note.content}
                    onChange={(e) => changeTextareaVal(index, e.target.value)} 
                    className="hide-scrollbar" 
                    placeholder="Take a note..."
                  >
                  </textarea>
                  <footer className="flex justify-between items-center w-full relative bottom-0" style={{...styles.boldGenText, margin: "0.5rem"}}>
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
                          <ModalHeader className="flex flex-col gap-1">Title Edit</ModalHeader>
                          <ModalBody>
                            <Textarea
                              isClearable
                              // value={note.title}
                              className="hide-scrollbar"
                              description="Edit Title"
                              labelPlacement="outside"
                              onChange={(e) => setActiveTitle(e.target.value)}
                              placeholder="Update title here..."
                            />
                            {/* <textarea
                              value={note.title}
                              onChange={(e) => changeTitleVal(index, e.target.value)} 
                              className="hide-scrollbar" 
                              placeholder="Take a note..."
                            >
                            </textarea> */}
                            <Button onClick={() => changeTitleVal(index)}>
                              Submit Title
                            </Button>
                          </ModalBody>
                        </ModalContent>
                    </Modal>
                    {/* <Button
                      className="mr-2 bg-transparent"
                      onClick={() => deleteNote(index)}
                      isIconOnly
                      size="sm"
                    >
                      <FontAwesomeIcon icon={faTrash} 
                          className="cursor-pointer"
                        />
                    </Button> */}
                  </footer>
                </div>
              ))
            }
          </div>
          <div className=" flex justify-evenly p-5">
            <Button 
              onClick={() => addNote()} 
              className="bg-linear-to-tr from-pink-500 to-yellow-500 text-white shadow-lg" radius="full"
            >
              Add
            </Button>
            <Button 
              onClick={() => saveNotes()} 
              className="bg-linear-to-tr from-pink-500 to-yellow-500 text-white shadow-lg" radius="full"
            >
              Save
            </Button>
          </div>
        </main>
        <main className="border-2 border-red-600 mx-auto mt-10 p-5">
          <Card isFooterBlurred className="h-full border-2 border-red-600">
            <CardHeader className="flex justify-center">FLASH AI</CardHeader>
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