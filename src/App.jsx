import { useState, useEffect, useRef } from "react";
import axios from "axios";

function App() {
  const [recording, setRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [summary, setSummary] = useState("");

  const recognitionRef = useRef(null);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      const recognition = new webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        setTranscription((prev) => prev + " " + transcript);
      };

      recognitionRef.current = recognition;
    } else {
      alert("Speech recognition not supported in this browser.");
    }
  }, []);

  const startRecording = () => {
    setRecording(true);
    recognitionRef.current?.start();
  };

  const stopRecording = async () => {
    setRecording(false);
    recognitionRef.current?.stop();

    try {
      const res = await axios.post("http://localhost:5000/summarize", {
        text: transcription,
      });
      setSummary(res.data.summary);
    } catch (error) {
      console.error("Error fetching summary:", error);
    }
  };

  return (
    <div className="app">
      <h1>🎙 AudioPen Clone</h1>

      <button onClick={recording ? stopRecording : startRecording}>
        {recording ? "🛑 Stop Recording" : "🎤 Start Recording"}
      </button>

      <div className="output">
        <h2>📝 Transcription:</h2>
        <p>{transcription}</p>

        <h2>✨ Summary:</h2>
        <p>{summary}</p>
      </div>
    </div>
  );
}

export default App;
