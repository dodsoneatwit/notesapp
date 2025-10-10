"use client"

import "./styles.css"
import { useState, useEffect, useRef } from "react"    
import { 
  Button, Card, CardHeader, CardBody, CardFooter, 
  Chip, Drawer, DrawerHeader, DrawerContent, DrawerBody, DrawerFooter, 
  Input, ScrollShadow
} from "@heroui/react";
import ReactMarkdown from "react-markdown";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faPaperPlane, faComments} from '@fortawesome/free-solid-svg-icons';

/**
 * Flash AI assistant component that supports 
 * note taking needs: ides, brainstorming, summarization, etc.
 * @returns Flash AI component
 */
export const FlashAI = () => {

    // server URL: local and public
    const server_api = process.env.AMP_EC2_SERVER || "http://localhost:5000"

    // dispatch module for using global store functions
    const dispatch = useDispatch();
    
    // manages drawer state for AI
    const [aiDrawer, changeDrawerState] = useState<boolean>(false)

    // useState variables for dynamic states
    const [current_message, setMessage] = useState<string>()
    const [chat, updateChat] = useState<Array<Object>>(
        [
          {
            type: "initial",
            message: "Hi, I am your Flash AI! Need a hand with your note taking? I'll help you brainstorm, summarize, come up with ideas, and more! Ask away :)" 
          } 
        ]
    )

    // custom CSS styling
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

    // type for defining notes  and spaces
    type Note = { index: number; title: string; content: string;};
    type Spaces = { index: number, name: string, notes: Array<Object> }

    useEffect(() => { // logs current input message
        console.log("--CURRENT MESSAGE--", current_message)
    }, [current_message])

    const chatEndRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => { // refocuses viewpoint on newest chat
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [chat]);

    /**
     * handles state change of current message
     * @param event event handler object
     */
    function setCurrentMessageVal(event: any) {
        setMessage(event.target.value)
    }

    /**
     * handles input on pressing ENTER
     * @param event keyDown press event
     */
    function handleInputEnter(event: any) {
        // sent input message and prevent sending empty messages
        if (event.key === 'Enter' && current_message?.trim()) {
            retrieveResponse()
        }
    }

    /**
     * 
     */
    async function retrieveResponse() {
        // updates chat with user input message
        updateChat((prevChat) => 
            [
                ...prevChat,
                {
                    type: "user",
                    message: current_message
                }
            ]
        )

        const input = current_message
        setMessage("")
        console.log('--CURRENT CHAT--', chat)

        // retrieves assistant response based on input message
        let result = await fetch(`${server_api}/prompt_claude_ai`, {
            method: "POST",
            headers:    {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ input: input })
        })

        // formatting response
        let data = await result.json();
        console.log('--DATA--', data)
        let response = data.content[0].text

        // updates chat with AI response message
        updateChat((prevChat) => 
            [
                ...prevChat,
                {
                    type: "assistant",
                    message: response
                }
            ]
        )
    }

    /**
     * displays conversation between user and assistant
     * @returns chat in array of Chip components
     */
    function chat_display() {
        return (
            <ScrollShadow size={10} className="overflow-y-auto relative flex flex-col gap-2 h-100 hide-scrollbar">
                {
                    chat.map((content: any, index: number) => {
                        if (content.type === "user") {// user message
                            return (
                                <div
                                    key={index}
                                    className="
                                        bg-[#3E2723] text-[#FFFFFF] rounded-lg p-3 mb-2 mt-2 shadow-2xl
                                        ml-whitespace-normal w-fit mr-0
                                        text-[.6rem] md:text-xs ml-auto
                                    "
                                >
                                    {content.message}
                                </div>
                            )
                        }
                        return ( // assistant message w-1/2 
                            <div 
                                key={index}
                                className="
                                    whitespace-normal bg-[#FFFFFF] text-[#3E2723] 
                                    border-2 border-[#3E2723] border-double rounded-lg p-3 mb-2 mt-2
                                    shadow-2xl text-[.6rem] md:text-xs whitespace-pre-wrap
                                "
                                dangerouslySetInnerHTML={{ __html: content.message }}
                            >
                            </div>
                        )
                    })
                }
                <div ref={chatEndRef} />
            </ScrollShadow>
        )
    }

    return (
        <>
            <main className="bg-[url('/images/gallery/background_design_wave.png')] border-3 border-[#3E2723] rounded-lg mt-10 p-5 shadow-lg hidden md:block md:w-1/5" style={styles['space']}>
                <Card isFooterBlurred className="bg-[#FFFFFF] h-full hidden md:block border-2 border-[#3E2723] shadow-lg">
                    <CardHeader className="flex justify-center font-bold text-xl">FLASH AI</CardHeader>
                    <CardBody>
                        { chat_display() }
                    </CardBody>
                    <CardFooter>
                        <Input
                        value={current_message}
                        onChange={setCurrentMessageVal}
                        onKeyDown={handleInputEnter}
                        endContent={
                            <FontAwesomeIcon
                            onClick={() => retrieveResponse()}
                            icon={faPaperPlane} 
                            className="cursor-pointer"
                            />
                        }
                        variant="bordered" placeholder="Type your prompt here..." 
                        />
                    </CardFooter>
                </Card>
            </main>
            <main className="md:hidden">
                <Drawer className="md:hidden border-2 border-[#3E2723] shadow-lg max-w-1/2 max-h-3/4 mt-auto mb-5 mr-10 rounded-lg" style={styles['space']} isOpen={aiDrawer} onOpenChange={() => changeDrawerState((val) => !val)}>
                    <DrawerContent className="border-[#3E2723] shadow-lg">
                        <DrawerHeader className="flex justify-center font-bold text-xl">FLASH AI</DrawerHeader>
                        <DrawerBody className="p-2">
                            <Card isFooterBlurred className="bg-[#FFFFFF] h-full">
                                <CardBody>
                                    { chat_display() }
                                </CardBody>
                                <CardFooter>
                                    <Input
                                    value={current_message}
                                    onChange={setCurrentMessageVal}
                                    onKeyDown={handleInputEnter}
                                    endContent={
                                        <FontAwesomeIcon
                                        onClick={() => retrieveResponse()}
                                        icon={faPaperPlane} 
                                        className="cursor-pointer"
                                        />
                                    }
                                    variant="bordered" placeholder="Type your prompt here..." 
                                    />
                                </CardFooter>
                            </Card>
                        </DrawerBody>
                    </DrawerContent>
                </Drawer>
                <div className="fixed right-4 bottom-4 md:hidden">
                    <FontAwesomeIcon icon={faComments} 
                        className="cursor-pointer"
                        style={{color: "3E2723"}}
                        size="2xl"
                        onClick={() => changeDrawerState(true)}
                    />
                </div>
            </main>
        </>
    )
}

