"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import TranscriptionContext from "@/app/(speech)/app/components/TranscriptionContext"; // This is the corrected import path
import VoiceItem from "@/app/(main)/_components/voice-item";

const Transcription = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { liveTranscription, finalTranscriptions, audioCurrentTime } =
    useContext(TranscriptionContext);
  useEffect(() => {
    if (finalTranscriptions.length) {
      containerRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end"
      })
    }
  }, [finalTranscriptions.length])

  const autoScrollDown = (elementID: string) => {
    const element = document.getElementById(elementID);
    element?.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
  }
  return (
    <div className="flex flex-col gap-[16px] overflow-y-auto" >
      {finalTranscriptions.map((transcription, index) => {
        if (transcription.start <= audioCurrentTime && transcription.end >= audioCurrentTime) autoScrollDown(`item-${index + 2}`);
        return <VoiceItem key={index} id={`item-${index}`} isSelected={transcription.start <= audioCurrentTime && transcription.end >= audioCurrentTime} transcription={transcription} />
      })}
      {liveTranscription && <VoiceItem isSelected={false} transcription={liveTranscription} />}
      <div ref={containerRef}></div>
    </div>
  );
};
export default Transcription;
