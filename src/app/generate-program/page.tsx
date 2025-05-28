"use client"

import { vapi } from "@/lib/vapi";
import { useUser } from "@clerk/nextjs";
import { tr } from "framer-motion/client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react"

const GenerateProgramPage = () => {
  const [callActive, setCallActive] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState([]);
  const [callEnded, setCallEnded] = useState(false);

  const{ user} = useUser
  const router = useRouter();

  const messageContainerRef = useRef<HTMLDivElement>(null);

  //auto scroll messages that are

  useEffect(() => {
    if(messageContainerRef.current){
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight
    }
  } , [messages] )

  //sending user to profile page after the end of call
  useEffect(() => {
    if(callEnded){
      const sendingToProfileTimer = setTimeout(() => {
        router.push("/profile")
      }, 2000);
      return () => clearTimeout(sendingToProfileTimer);
    }
  }, [callEnded, router])

  //event listeners for our AI
  useEffect(()=> {

    const handleCallStart = () => {
      console.log("call has started");
      setConnecting(false)
      setCallActive(true)
      setCallEnded(false)
    }

    const handleCallEnd = () => {
      console.log("call has ended")
      setCallActive(false)
      setConnecting(false)
      setIsSpeaking(false)
      setCallEnded(true)
    }

    const handleSpeechStart = () => {
      console.log("AI is now speaking")
      setIsSpeaking(true)
    }

    const handleSpeechEnd = () => {
      console.log("AI has stopped talking now")
      setIsSpeaking(false)
    }

    const handleMessage = (message: any) => {}

    const handleError = (error: any) => {
      console.log("error in AI",error)
      setConnecting(false)
      setCallActive(false)
    }

    vapi.on("call-start", handleCallStart)
        .on("call-end", handleCallEnd)
        .on("speech-start", handleSpeechStart)
        .on("speech-end", handleSpeechEnd)
        .on("message", handleMessage)
        .on("error", handleError)

        return () => {
    vapi.off("call-start", handleCallStart)
        .off("call-end", handleCallEnd)
        .off("speech-start", handleSpeechStart)
        .off("speech-end", handleSpeechEnd)
        .off("message", handleMessage)
        .off("error", handleError)
        }
  },[])

  const toggleCall = async () => {
    if(callActive) vapi.stop()
      else{
    try{
      setConnecting(true);
      setMessages([]);
      setCallEnded(false);

      const fullName = user?.firstName? `${user.firstName} ${user.lastName || ""}`.trim(): "YOU";

      await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
        variableValues: {
          full_name: fullName
        }
      })

    } catch (error) {
      console.log("failes to make the call", error);
      setConnecting(false)
    }

    }
  }

  return (
    <div>GenerateProgramPage</div>
  )
}

export default GenerateProgramPage