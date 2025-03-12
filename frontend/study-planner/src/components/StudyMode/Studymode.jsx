import React, { useState, useEffect } from "react";
import { FaRedo, FaCog } from "react-icons/fa";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Nav from "../Navbar/Nav";

const DEFAULT_TIMES = {
  Pomodoro: 25 * 60,
  "Short Break": 5 * 60,
  "Long Break": 15 * 60,
};

const StudyMode = () => {
  const [time, setTime] = useState(DEFAULT_TIMES.Pomodoro);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState("Pomodoro");
  const [sessions, setSessions] = useState(0);

  useEffect(() => {
    let timer;
    if (isRunning && time > 0) {
      timer = setInterval(() => {
        setTime((prev) => prev - 1);
      }, 1000);
    } else if (time === 0) {
      handleSessionEnd();
    }
    return () => clearInterval(timer);
  }, [isRunning, time]);

  const handleSessionEnd = () => {
    if (mode === "Pomodoro") {
      setSessions((prev) => prev + 1);
      if ((sessions + 1) % 4 === 0) {
        setMode("Long Break");
        setTime(DEFAULT_TIMES["Long Break"]);
      } else {
        setMode("Short Break");
        setTime(DEFAULT_TIMES["Short Break"]);
      }
    } else {
      setMode("Pomodoro");
      setTime(DEFAULT_TIMES.Pomodoro);
    }
    setIsRunning(false);
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setTime(DEFAULT_TIMES[newMode]);
    setIsRunning(false);
  };

  const toggleTimer = () => {
    setIsRunning((prev) => !prev);
  };

  const resetTimer = () => {
    setTime(DEFAULT_TIMES[mode]);
    setIsRunning(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const percentage = ((DEFAULT_TIMES[mode] - time) / DEFAULT_TIMES[mode]) * 100;

  return (
    <div className="flex bg-black flex-col items-center justify-center h-screen w-full text-white studymode">
        <Nav />
      <div className="flex space-x-4 mb-6">
        {["Pomodoro", "Short Break", "Long Break"].map((item) => (
          <button
            key={item}
            className={`px-5 py-2 font-semibold rounded-lg transition-all ${mode === item ? "bg-white text-white shadow-lg glass-effect " : "border border-neutral-300 text-white shadow-sm hover:shadow-md hover:bg-opacity-30"}`}
            onClick={() => handleModeChange(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <div style={{ width: 300, height: 300 }}>
        <CircularProgressbar
          value={percentage}
          text={formatTime(time)}
          styles={buildStyles({
            textColor: "rgba(255, 255, 255, 1)",
            pathColor: "rgba(255, 255, 255, 0.8)",
            trailColor: "rgba(255, 255, 255, 0.5)",
            pathTransitionDuration: 0.5,
            textSize: "25px",
          })}
        />
      </div>

      <div className="mt-6 flex items-center space-x-4">
        <button
          className="px-5 py-2 bg-white font-semibold rounded-lg transition-all glass-effect border-white text-white shadow-sm hover:shadow-md backdrop-filter backdrop-blur-lg bg-opacity-15 border"
          onClick={toggleTimer}
        >
          {isRunning ? "Pause" : "Start"}
        </button>
        <button className="text-white opacity-60 hover:opacity-80" onClick={resetTimer}>
          <FaRedo size={18} />
        </button>
        <button className="text-white opacity-60 hover:opacity-80" onClick={() => setIsRunning(false)}>
          <FaCog size={24} />
        </button>
      </div>
    </div>
  );
};

export default StudyMode;
