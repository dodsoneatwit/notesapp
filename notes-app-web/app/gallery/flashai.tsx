"use client"

import "./styles.css"
import { useState, useEffect } from "react"    
import { 
  Button, 
  Card, CardHeader, CardBody, CardFooter, 
  Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, 
  Form, Input, Listbox, ListboxItem, ListboxSection,
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
  Textarea

} from "@heroui/react";
import { Nav } from "@/components/nav";
import { useRouter } from "next/navigation";
import { setNotes } from '../../store/notesSlice'
import { setSpaces } from "@/store/spacesSlice";
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faCaretDown, faPenToSquare, faPaperPlane, faTrash } from '@fortawesome/free-solid-svg-icons';
import { clearCredentials } from '../../store/credentialsSlice'

export const FlashAI = () => {
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

    return (
        <main className="bg-[url('/images/gallery/background_design_wave.png')] border-3 border-[#3E2723] rounded-lg mx-auto mt-10 p-5 shadow-lg hidden sm:block" style={styles['space']}>
            <Card isFooterBlurred className="bg-[#FFFFFF] h-full border-2">
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
    )
}