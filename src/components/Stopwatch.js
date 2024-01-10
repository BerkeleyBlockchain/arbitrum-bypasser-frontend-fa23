import React, { useEffect, useState } from "react";
import { useStopwatch } from "react-timer-hook";

export default function Stopwatch({ offset }) {
  const stopwatchOffset = new Date();
  stopwatchOffset.setSeconds(stopwatchOffset.getSeconds() + (offset ?? 0));
  // stopwatchOffset.setSeconds(stopwatchOffset.getSeconds() + 300);

  const { seconds, minutes, hours } = useStopwatch({
    autoStart: true,
    offsetTimestamp: stopwatchOffset,
  });

  const formatTime = (timeValue) => {
    return String(timeValue).padStart(2, "0");
  };

  return (
    <div className="text-yellow-500 text-center text-xl text-shadow text-gray-400 font-bold">
      Time Elapsed: {formatTime(hours)}:{formatTime(minutes)}:
      {formatTime(seconds)}
    </div>
  );
}
