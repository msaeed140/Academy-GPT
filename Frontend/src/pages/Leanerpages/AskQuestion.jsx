import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import { PiCameraLight } from "react-icons/pi";
// import { LuSendHorizonal } from "react-icons/lu";
import Webcam from "react-webcam";
import { IoMdAttach } from "react-icons/io";
import ReactMarkdown from "react-markdown";

import "./AskQuestion.css";

function AskQuestion() {
  const [subject, setSubject] = useState("");
  const [inputText, setInputText] = useState("");
  const [file, setFile] = useState(null);
  const [cameraMode, setCameraMode] = useState(false);
  const [pastQA, setPastQA] = useState([]);
  const [preferredAnswer, setPreferredAnswer] = useState("aiAnswer");
  const [capturedImage, setCapturedImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [userLanguage, setUserLanguage] = useState("en");
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  const chatEndRef = useRef(null);
  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);
  const mobileCameraInputRef = useRef(null);

  const navigate = useNavigate(); 

  useEffect(() => {
    const detectLanguage = () => {
      const browserLang = navigator.language || navigator.userLanguage;
      setUserLanguage(browserLang.split("-")[0]);
    };

    const detectDevice = () => {
      const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
      setIsMobileDevice(isMobile);
    };

    detectLanguage();
    detectDevice();
  }, []);

  useEffect(() => {
 
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [pastQA]);

  const handleCameraClick = () => {
    if (isMobileDevice) {
      mobileCameraInputRef.current?.click();
    } else {
      setCameraMode(true);
    }
  };

  const handleMobileCameraCapture = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      setInputText("Captured Image");
    }
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setInputText(selectedFile.name);
  };

  const formatTextOnlyHistory = (history) => {
    return history
      .filter((qa) => !qa.image)
      .map((qa) => ({
        question: qa.question,
        answer: qa.answer,
      }));
  };

  const handleSend = async () => {
    if (!inputText.trim() && !file && !capturedImage) return;

    if (preferredAnswer === "onlineClassroom") {
     
      const newQA = {
        question: inputText,
        answer: "Successfully sent",
        image: null,
        timestamp: new Date().toISOString(),
      };

      setPastQA((prev) => [...prev, newQA]);
      setInputText("");
      setFile(null);
      setCapturedImage("");

   
      setTimeout(() => {
        navigate("/leanernavbar/whiteboard");
      }, 3000);
      return;
    }

    setIsLoading(true);
    const formData = new FormData();

    let fullQuestion = "";
    if (subject) {
      fullQuestion = subject ? `Subject:${subject}\n`  : "";
    }
    if (inputText) {
      // fullQuestion += Question: ${inputText};
    }

    try {
      let response;

      if (file || capturedImage) {
        if (file) formData.append("image", file);
        if (capturedImage) {
          const blob = await fetch(capturedImage).then((r) => r.blob());
          formData.append("image", blob, "captured-image.jpg");
        }
        formData.append("question", fullQuestion);
        formData.append("language", userLanguage);

        response = await axios.post(
          "https://academy-gpt.onrender.com/api/chat-with-image",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        setConversationId(null);
      } else {
        const textOnlyHistory = formatTextOnlyHistory(pastQA);
        const relevantHistory = conversationId ? textOnlyHistory : [];

        response = await axios.post(
          "https://academy-gpt.onrender.com/api/chat",
          {
            question: fullQuestion,
            preferredAnswer: preferredAnswer,
            chatHistory: relevantHistory,
            conversationId: conversationId,
            language: userLanguage,
            resetConversation: conversationId === null,
          }
        );
      }

      const newQA = {
        question: fullQuestion,
        answer: response.data.response,
        image: file || capturedImage || null,
        timestamp: new Date().toISOString(),
        conversationId: conversationId,
        subject,
      };

      setPastQA((prev) => [...prev, newQA]);

      setInputText("");
      setFile(null);
      setCapturedImage("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (mobileCameraInputRef.current) mobileCameraInputRef.current.value = "";
    } catch (error) {
      console.error("Error details:", error.response?.data || error.message);
      alert(
        "An error occurred while processing your request. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCaptureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    setCameraMode(false);
    setInputText("Captured Image");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const startNewConversation = () => {
    setConversationId(null);
    setSubject("");
    setPastQA([]); // Clear previous Q&A
  };

  const renderAnswer = (answer) => {
    return (
      <div className="answer-container">
        <p className="answer-label">AI Answer:</p>
        <ReactMarkdown
          className="markdown-content"
          components={{
            p: ({ children }) => (
              <p className="markdown-paragraph">{children}</p>
            ),
            strong: ({ children }) => (
              <span className="markdown-strong">{children}</span>
            ),
          }}>
          {answer}
        </ReactMarkdown>
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="flex-1 flex flex-col w-full mx-auto bg-white rounded-lg shadow-md">
        <form
          className="flex flex-col h-full space-y-2"
          onSubmit={(e) => e.preventDefault()}>
          <div className="flex justify-between items-center">
            <input
              className="w-full h-10 border-b-2 border-black/70 px-2 focus:outline-none"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject (optional)"
            />
            {conversationId && (
              <button
                type="button"
                onClick={startNewConversation}
                className="ml-2 px-3 py-1 bg-gray-200 rounded-md text-sm hover:bg-gray-300">
                New Conversation
              </button>
            )}
          </div>

          <div className="flex-1 border-2 rounded-md overflow-hidden">
            <div className="h-full overflow-y-auto p-4 space-y-4">
              {pastQA.map((qa, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex">
                    <div className="bg-blue-100 p-3 rounded-lg max-w-[100%]">
                      <p className="text-sm font-semibold text-gray-600 mb-1">
                        Your Question:
                      </p>
                      <p>{qa.question}</p>
                      {qa.image && (
                        <img
                          src={
                            typeof qa.image === "string"
                              ? qa.image
                              : URL.createObjectURL(qa.image)
                          }
                          alt="Attached"
                          className="mt-2 rounded-md object-cover"
                        />
                      )}
                    </div>
                  </div>
                  <div className="flex">{renderAnswer(qa.answer)}</div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
          </div>

          <div className="sticky z-50 bottom-0 space-y-2 xl:w-full bg-white w-full">
            <div className="flex items-center space-x-5 px-2">
              <p className="text-lg font-semibold">Preferred Answer</p>
              <div className="flex space-x-5">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="preferredAnswer"
                    value="onlineClassroom"
                    id="onlineClassroom"
                    checked={preferredAnswer === "onlineClassroom"}
                    onChange={(e) => setPreferredAnswer(e.target.value)}
                    className="form-radio"
                  />
                  <label htmlFor="onlineClassroom">Online Classroom</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="preferredAnswer"
                    value="aiAnswer"
                    id="aiAnswer"
                    checked={preferredAnswer === "aiAnswer"}
                    onChange={(e) => setPreferredAnswer(e.target.value)}
                    className="form-radio"
                  />
                  <label htmlFor="aiAnswer">AI</label>
                </div>
              </div>
            </div>

            <div className="flex items-center w-full space-x-4 p-2 border-2 rounded-full">
              <div className="flex space-x-4">
                <label htmlFor="fileInput" className="cursor-pointer">
                  <IoMdAttach className="text-2xl text-gray-600 hover:text-gray-800" />
                </label>
                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className="hidden"
                />
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleMobileCameraCapture}
                  ref={mobileCameraInputRef}
                  className="hidden"
                />
                <PiCameraLight
                  className="text-2xl text-gray-600 hover:text-gray-800 cursor-pointer"
                  onClick={handleCameraClick}
                />
              </div>
              <input
                className="flex-1 px-4 py-2 focus:outline-none"
                type="text"
                placeholder="Ask your question..."
                value={inputText}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={isLoading}
                className={`p-2 rounded-full ${
                  isLoading ? "bg-gray-400" : "bg-primary hover:bg-primary"
                } text-white`}>
               {/* <LuSendHorizonal className="text-2xl" /> */}
              </button>
            </div>
          </div>
        </form>
      </div>

      {!isMobileDevice && cameraMode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="mb-4"
            />
            <div className="flex justify-between">
              <button
                type="button"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={handleCaptureImage}>
                Capture
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                onClick={() => setCameraMode(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AskQuestion;