"use client"

import { useState } from "react"    
import { Card, CardBody, CardFooter, ListboxItem, Listbox, Button, Textarea } from "@heroui/react";
import { Nav } from "@/components/nav";
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

  const [noteCards, setNoteCard] = useState<Object[]>([])

  function changeTextareaVal(index: number, value: string) {
    setNoteCard((prevItems) =>
      prevItems.map((item, i) =>
        i === index ? { ...item, content: value } : item
      )
    );
  }

  function addNote() {
    dispatch(setNotes([
      ...curr_notes,
      {
        index: curr_notes.length,
        title: `Note #${curr_notes.length + 1}`,
        content: "",
      }
    ]))
    // setNoteCard((prevCards: Object[]) =>
    //   [
    //     ...prevCards,
    //     {
    //       index: prevCards.length,
    //       title: `Note #${prevCards.length + 1}`,
    //       content: "",
    //     }
    //   ]
    // )
  }

  async function saveNotes() {
    console.log("--Notes--");
    console.log(curr_notes);

    await fetch (`http://localhost:5000/add_notes`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: curr_username, password: curr_password, Notes: curr_notes })
    })
  }

  return (
    <div style={{border: "", justifyContent: "center"}}>
      <Nav />
      <main style={{
          display: "flex",
          width: "55vw",
          justifyContent: "space-around",
          borderRadius: "1rem",
          boxShadow: "4px 4px 4px 6px rgba(0, 0, 0, 0.1)",
          alignItems: "center", 
          height: "80vh", 
          flexDirection: "column", 
          gap: "1rem"
        }}
      >
        <div style={styles.notesGrid}>
          {
            curr_notes.map((note: any, index: number) => (
              <div style={styles.noteCardBody} key={index}>
                <div style={{...styles.noteHeader, justifyContent: "center"}} >
                  {note.title}
                </div>
                <textarea 
                  style={styles.noteTextArea}
                  value={note.content}
                  onChange={(e) => changeTextareaVal(index, e.target.value)} 
                  className="hide-scrollbar" 
                  placeholder="Take a note..."
                >
                </textarea>
                <footer style={{...styles.boldGenText, margin: "0.5rem"}}>{note.title}</footer>
              </div>
            ))
          }
        </div>
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
      </main>
    </div>
  );
}