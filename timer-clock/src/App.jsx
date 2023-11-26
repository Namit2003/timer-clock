import { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {

  const [timerLabel, setTimerLabel] = useState('Session')
  const [breakLength, setBreakLength] = useState(5)
  const [sessionLength, setSessionLength] = useState(25)
  const [timeLeft, setTimeLeft] = useState(sessionLength * 60)
  const [isRunning, setIsRunning] = useState(false);

  const audioRef = useRef(null);

  // Format seconds to "mm:ss"
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
    return `${formattedMinutes}:${formattedSeconds}`;
  };

  useEffect(() => {
    // Decrement time every second
    const intervalId = setInterval(() => {
      if (isRunning && timeLeft > 0) {
        setTimeLeft((prevTime) => prevTime - 1);
      } else if (timeLeft === 0) {
        if (timerLabel === 'Session') {
          setTimerLabel('Break');
          setTimeLeft(breakLength * 60);
        } else {
          setTimerLabel('Session');
          setTimeLeft(sessionLength * 60);
        }
        audioRef.current.play();
      }
    }, 1000);

    return () => {
      clearInterval(intervalId);
    }

  }, [isRunning, timeLeft, breakLength, sessionLength, timerLabel]);

  useEffect(() => {
    setTimeLeft(sessionLength * 60)
  }, [sessionLength])

  const handleStartStop = () => {
    setIsRunning(!isRunning)
  }

  const handleReset = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsRunning(false);
    setTimerLabel('Session');
    setSessionLength(25)
    setTimeLeft(sessionLength * 60);
    setBreakLength(5);
  };

  const incrementBreak = () => {
    if (breakLength !== 60)
      setBreakLength(breakLength + 1)
  }
  const decrementBreak = () => {
    if (breakLength !== 1) {
      setBreakLength(breakLength - 1)
    }
  }

  const incrementSession = () => {
    if (sessionLength !== 60)
      setSessionLength(sessionLength + 1)
  }
  const decrementSession = () => {
    if (sessionLength !== 1) {
      setSessionLength(sessionLength - 1)
    }
  }

  return (
    <>
      <h1>Timer Clock</h1>
      <div className="box">
        <div className="container">
          <div className="length-container">
            <div className="label" id="break-label">Break Length</div>
            <div className="value" id="break-length">{breakLength}</div>
            <div className="buttons">
              <button className="button" id="break-increment" onClick={incrementBreak}>+</button>
              <button className="button" id="break-decrement" onClick={decrementBreak}>-</button>
            </div>
          </div>
          <div className="length-container">
            <div className="label" id="session-label">Session Length</div>
            <div className="value" id="session-length">{sessionLength}</div>
            <div className="buttons">
              <button className="button" id="session-increment" onClick={incrementSession}>+</button>
              <button className="button" id="session-decrement" onClick={decrementSession}>-</button>
            </div>
          </div>
        </div>
        <div className="timer-box">
          <div className='timer'>
            <h3 id="timer-label">{timerLabel}</h3>
            <h1 id="time-left">{formatTime(timeLeft)}</h1>
          </div>
        </div>
        <div className="buttons">
          <button id="start_stop" onClick={handleStartStop}>❚❚/►</button>
          <button id="reset" onClick={handleReset}>&#10227;</button>
        </div>
      </div>
      <audio id="beep" ref={audioRef} src="/alarm.wav" />
    </>
  )
}

export default App
