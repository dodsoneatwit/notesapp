"use client"

import "./styles.css"

import { Nav } from "@/components/nav";
import { Spaces } from "./spaces"
import { Notes } from "./notes"
import { FlashAI } from "./flashai"
import { useSelector } from 'react-redux';
import { useState, useEffect } from "react"
import { 
  Button, Spinner
} from "@heroui/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComments } from '@fortawesome/free-solid-svg-icons';

/**
 * appends functionality for notetaking across
 * different spaces with additional AI support
 * @returns spaces, notes, and AI
 */
export default function Gallery() {

  // global store variables
  const curr_spaces = useSelector((state: any) => state.spaces.spaces);

  // custome styles
  let styles: { [key: string]: React.CSSProperties } = {
    text_style: { 
      fontFamily: "Josefin Slab",
      fontOpticalSizing: "auto",
      fontWeight: "800",
      fontStyle: "normal"
    },
    button_style: { 
      fontFamily: "Josefin Slab",
      fontOpticalSizing: "auto",
      fontWeight: "600",
      fontStyle: "normal"
    }
  }

  // render page only until client mounts
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  // validates that both server and client render same thing
  if (!mounted) {
    // You can show a loader here instead of null
    return (
      <div className="flex justify-center items-center h-screen" style={styles['text_style']}>
          <Spinner  color="default" label="Loading Spaces" labelColor="foreground" size="lg" variant="wave"/>
      </div>
    )
  }
  /**
   * displays notes if any spaces exists;
   * message displayed otherwise
   * @returns Notes component or message
   */
  function checkSpaces() {
    if (curr_spaces.length > 0) {
      return <Notes />
    }
    // notifies user that no spaces exist
    return (
      <div className="mt-25 font-extrabold text-2xl" style={styles['text_style']}>
          <div>No Spaces! Add spaces to start taking notes!</div>
      </div>
    );
  }

  return (
    <div>
      <Nav />
      <div className="flex flex-row pl-5 pr-5 md:pl-0 md:pr-0 justify-between flex-container">
        <Spaces />
        { checkSpaces() }
        <FlashAI />
      </div>
    </div>
  );
};