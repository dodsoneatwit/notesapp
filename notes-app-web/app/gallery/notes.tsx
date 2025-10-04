"use client"

import "./styles.css"
import { useState, useEffect } from "react"    
import { 
  Button,
  Dropdown, DropdownTrigger, DropdownMenu, DropdownItem,
  Modal, ModalContent, ModalBody, ModalHeader, Textarea, ScrollShadow
} from "@heroui/react";
import { setNotes } from '../../store/notesSlice'
import { setSpaces } from "@/store/spacesSlice";
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';

export const Notes = () => {

    // global store variables
    const curr_username = useSelector((state: any) => state.cred.username);
    const curr_password = useSelector((state: any) => state.cred.password);
    const curr_notes = useSelector((state: any) => state.notes.notes);
    const curr_spaces = useSelector((state: any) => state.spaces.spaces);
    const curr_space_index = useSelector((state: any) => state.spaces.index);
    const dispatch = useDispatch();
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
        },
        generalText: { fontFamily: "Delius, cursive",fontWeight: "400",fontStyle: "normal"},
        boldGenText: { fontFamily: "Delius, cursive", fontWeight: "800",fontStyle: "normal"},
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

    // type for defining notes  and spaces
    type Note = { index: number; title: string; content: string;};
    type Spaces = { index: number, name: string, notes: Array<Object> }

    // active elements for changing title and/or content state management
    const [activeTitle, setActiveTitle] = useState<string>("")
    const [activeModal, setActiveModal] = useState<number>(-1);

    useEffect(() => {
        // runs when the component mounts
        console.log("--*NOTE* SPACES--")
        console.log(curr_spaces)
        dispatch(setNotes(curr_spaces[curr_space_index]?.notes ?? 0)) // sets index if space exists
    }, []);


    /**
     * changes content within single note card
     * @param index index of card to be updated
     * @param value content to update card with
     */
    function changeTextareaVal(index: number, value: string) {
      // updates content value of note and stores in global variable
      dispatch(
        setNotes(
          curr_notes.map((note: Note, i: number) =>
              i === index ? { ...note, content: value } : note
          )
        )
      )
    }

    /**
     * adds new note to current space
     */
    function addNote() {
      // adds new note to Note array in global store
      dispatch(
        setNotes(
          [
            ...curr_notes,
            {
            index: curr_notes.length,
            title: `Note #${curr_notes.length + 1}`,
            content: "",
            }
          ]
        )
      )
    }

    /**
     * deletes single note card from space
     * @param index index of note card to be deleted
     */
    function deleteNote(index: number) {
      // updates Note array in global store
      dispatch(
        setNotes(
          curr_notes.filter((note: Note) => {
            return index !== note.index
            })
            .map((note: Note, i: number) => {
            return {...note, index: i}
            })
        )
      )
    }

    /**
     * updates title of note card
     * @param index index of note card to be updated
     */
    function changeNoteTitleVal(index: number) {
      // updates note title value of note card
      dispatch(
        setNotes(
          curr_notes.map((note: Note, i: number) =>
              i === index ? { ...note, title: activeTitle } : note
          )
        )
      )

      // resets modal focus
      setActiveModal(-1)
    }

    /**
     * saves all notes in space to MongoDB
     */
    async function saveNotes() {
      // API request to sent new notes array to server for updating
      await fetch (`http://localhost:5000/add_notes_spaces`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          username: curr_username, 
          password: curr_password, 
          spname: curr_spaces[curr_space_index].name,
          Notes: curr_notes 
        })
      })

      // saves notes to spaces in global store for later reference
      dispatch(
        setSpaces(
          curr_spaces.map((space: Spaces, index: number) => {
              if (index === curr_space_index) {
                  return { name: space.name, notes: curr_notes}
              }
              return space
          })
        )
      )
    }

    return (
        <main 
          className="flex md:w-200 justify-around rounded-lg border-3 border-[#3E2723] md:mx-auto mt-10 mb-10 p-5 bg-[#FFFFFF] max-h-90 md:max-h-150 md:h-dvh"
          style={{
            display: "flex",
            // width: "vw",
            justifyContent: "space-evenly",
            flexDirection: "column", 
            gap: "1rem"
          }}
        >
          <ScrollShadow
            style={{...styles.notesGrid}} 
            className="
            inset-shadow-lg hide-scrollbar flex overflow-y-auto 
            justify-center pt-3 pb-3 grid gap-4 grid-cols-2 lg:grid-cols-3
            "
          >
            {
              curr_notes.map((note: any, index: number) => (
                <div 
                  className="notecard md:max-h-100 md:max-w-100" 
                  key={index}
                >
                  <textarea 
                    style={styles.noteTextArea}
                    value={note.content}
                    onChange={(e) => changeTextareaVal(index, e.target.value)} 
                    className="hide-scrollbar  text-xs md:text-sm" 
                    placeholder="Take a note..."
                  >
                  </textarea>
                  <footer className="flex justify-between items-center w-full relative bottom-0 text-sm" style={{...styles.boldGenText, margin: "0.5rem"}}>
                    <div className="">
                      {note.title}
                    </div>
                    <Dropdown disableAnimation>
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
                              onClick={() => changeNoteTitleVal(index)}
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
          </ScrollShadow>
          <div className="flex justify-evenly md:p-5">
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
    );
};