import React, { useState, useRef, useEffect } from "react";
import { Excalidraw, MainMenu, WelcomeScreen } from "@excalidraw/excalidraw";
import { ZoomToolBar } from "./ZoomToolBar";
import { ColorToolBar } from "./ColorToolBar";
import { TextFormatToolBar } from "./TextFormatToolBar";
import AudioTranscriber from "./audioTranscriber";
import AudioRecorder from "./audioRecorder";
import { FaBars, FaUndo, FaRedo } from "react-icons/fa";
import "./WhiteBoard.css";
import JoinMeetingModal from "./JoinMeetingModal";
import MiniMeetingModal from "./MiniMeetingModal";
import pencil from "../assets/Image/pencil.svg";
import undo from "../assets/Image/undo.svg";
import redo from "../assets/Image/redo.svg";

const WhiteBoard = () => {
  const containerRef = useRef(null);
  const [gridMode, setGridMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [peer, setPeer] = useState(null);
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [speechToText, setSpeechToText] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [miniModalIsOpen, setMiniModalIsOpen] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [collapsed, setCollapsed] = useState(true);
  const [elements, setElements] = useState([]);
  const [history, setHistory] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [appState, setAppState] = useState({});
  const [alignment, setAlignment] = useState("left");
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    if (!excalidrawAPI) {
      return;
    }
    excalidrawAPI.updateScene({ appState: { openSidebar: "library" } });

    const checkOrientation = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };

    // Listen for orientation change
    window.addEventListener('resize', checkOrientation);

    // Check on mount
    checkOrientation();

    return () => {
      window.removeEventListener('resize', checkOrientation);
    };
  }, [excalidrawAPI]);

  const toggleDrawer = () => setCollapsed(!collapsed);

  const handleUndo = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setElements(history[prevIndex]);
      setCurrentIndex(prevIndex);
      excalidrawAPI.updateScene({
        elements: [...history[prevIndex]],
      });
    }
  };

  const handleRedo = () => {
    if (currentIndex < history.length - 1) {
      const nextIndex = currentIndex + 1;
      setElements(history[nextIndex]);
      setCurrentIndex(nextIndex);
      excalidrawAPI.updateScene({
        elements: [...history[nextIndex]],
      });
    }
  };

  const toggleAlignment = () => {
    const alignments = ["left", "center", "right"];
    const currentIndex = alignments.indexOf(alignment);
    const nextIndex = (currentIndex + 1) % alignments.length;
    setAlignment(alignments[nextIndex]);
    handleAlign(alignments[nextIndex]);
    console.log(alignment, "alignment is happening");
  };

  const startScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      const newPeer = new Peer({ initiator: true, stream });

      newPeer.on("signal", (data) => {
        console.log("Signal data", data);
      });

      newPeer.on("connect", () => {
        console.log("Peer connected");
      });

      newPeer.on("stream", (remoteStream) => {
        const video = document.createElement("video");
        video.srcObject = remoteStream;
        video.play();
        document.body.appendChild(video);
      });

      setPeer(newPeer);
      setIsSharingScreen(true);
    } catch (err) {
      console.error("Error sharing screen:", err);
    }
  };

  const stopScreenShare = () => {
    if (peer) {
      peer.destroy();
      setPeer(null);
      setIsSharingScreen(false);
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if (containerRef.current.mozRequestFullScreen) {
        containerRef.current.mozRequestFullScreen();
      } else if (containerRef.current.webkitRequestFullscreen) {
        containerRef.current.webkitRequestFullscreen();
      } else if (containerRef.current.msRequestFullscreen) {
        containerRef.current.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const handleBackgroundColor = (color) => {
    if (color === "grid") {
      setGridMode((prevMode) => !prevMode);
      return;
    }

    setBackgroundColor(color);

    if (excalidrawAPI) {
      excalidrawAPI.updateScene({
        appState: {
          ...excalidrawAPI.getAppState(),
          viewBackgroundColor: color,
        },
      });
    }
  };

  const handleZoomIn = () => {
    setZoomLevel((prevZoom) => Math.min(prevZoom + 10, 200)); // Max 200%
    excalidrawAPI.updateScene({
      appState: {
        zoom: zoomLevel,
      },
    });
  };

  const handleZoomOut = () => {
    setZoomLevel((prevZoom) => Math.max(prevZoom - 10, 10)); // Min 10%
    excalidrawAPI.updateScene({
      appState: {
        zoom: zoomLevel,
      },
    });
  };

  const handleBold = () => {
    console.log(excalidrawAPI, "bold");
    if (excalidrawAPI) {
      // Get the selected elements from the Excalidraw scene
      const selectedElements = excalidrawAPI.getSceneElements().filter((el) => {
        console.log(el);
        return el.type === 'text';
      });

      // Map through elements and update fontFamily for selected elements
      const updatedElements = excalidrawAPI.getSceneElements().map((el) => {
        if (selectedElements.includes(el)) {
          return {
            ...el,
            fontFamily: 3, // Cascadia (Bold)
          };
        }
        return el;
      });

      // Update the scene with modified elements
      excalidrawAPI.updateScene({ elements: updatedElements });
    }
  };

  const handleItalic = () => {
    if (excalidrawAPI) {
      // Get the selected elements from the Excalidraw scene
      const selectedElements = excalidrawAPI.getSceneElements().filter((el) => {
        console.log(el);
        return el.type === 'text';
      });

      // Map through elements and update fontFamily for selected elements
      const updatedElements = excalidrawAPI.getSceneElements().map((el) => {
        if (selectedElements.includes(el)) {
          return {
            ...el,
            fontFamily: 5, // Cascadia (Bold)
          };
        }
        return el;
      });

      // Update the scene with modified elements
      excalidrawAPI.updateScene({ elements: updatedElements });
    }
  };

  const handleFontSizeChange = () => {
    if (excalidrawAPI) {
      const selectedElements = excalidrawAPI
        .getSceneElements()
        .filter((el) => el.type === "text");

      const updatedElements = excalidrawAPI.getSceneElements().map((el) => {
        if (selectedElements.includes(el)) {
          return {
            ...el,
            fontSize: 40,
          };
        }
        return el;
      });

      excalidrawAPI.updateScene({ elements: updatedElements });
    }
  };

  const handleAlign = () => {
    if (excalidrawAPI) {
      const selectedElements = excalidrawAPI
        .getSceneElements()
        .filter((el) => el.type === "text");

      const updatedElements = excalidrawAPI.getSceneElements().map((el) => {
        if (selectedElements.includes(el)) {
          return {
            ...el,
            textAlign: alignment,
          };
        }
        return el;
      });

      excalidrawAPI.updateScene({ elements: updatedElements });
    }
  };

  const updateScene = (text) => {
    if (excalidrawAPI) {
      const newElement = {
        type: "text",
        version: 1,
        versionNonce: Math.random(),
        isDeleted: false,
        id: `text-${Date.now()}`,
        text: text,
        x: 100,
        y: 100,
        fontSize: 20,
        textAlign: "center",
        verticalAlign: "center",
        strokeColor: "#000000",
      };

      excalidrawAPI.updateScene({
        elements: [newElement],
      });
    }
  };

  const handleTranscription = (transcript) => {
    setSpeechToText(transcript);
  };

  const handleModal = (action) => {
    if (action === "open") {
      setModalIsOpen(true);
      return;
    }
    setModalIsOpen(false);
  };

  const handleMiniModal = (action) => {
    if (action === "open") {
      setMiniModalIsOpen(true);
      return;
    }
    setMiniModalIsOpen(false);
  };

  const handleChange = (newElements, appState) => {
    if (JSON.stringify(newElements) !== JSON.stringify(elements)) {
      setAppState(appState);
      setElements(newElements);
      updateHistory(newElements);
    }
  };

  const updateHistory = (newElements) => {
    if (currentIndex < history.length - 1) {
      setHistory(history.slice(0, currentIndex + 1));
    }
    setHistory([...history, newElements]);
    setCurrentIndex(currentIndex + 1);
  };

  return (
    isPortrait ? (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, backgroundColor: 'red', color: 'white', padding: '10px', textAlign: 'center' }}>
        This app does not support portrait mode on mobile. Please switch to landscape mode.
      </div>
    ) :
    <>
      <div
        className="whiteboard"
        ref={containerRef}
        style={{ height: "100vh", width: "100%" }}>
        <div className="colorBarContainer">
          <ColorToolBar onChangeBackground={handleBackgroundColor} />
          <TextFormatToolBar
            onBold={handleBold}
            onItalic={handleItalic}
            onFontSizeChange={handleFontSizeChange}
            onAlign={toggleAlignment}
          />
          {modalIsOpen && (
            <JoinMeetingModal
              handleModal={handleModal}
              modalIsOpen={modalIsOpen}
            />
          )}
          {miniModalIsOpen && (
            <MiniMeetingModal
              handleModal={handleMiniModal}
              modalIsOpen={miniModalIsOpen}
            />
          )}
        </div>
        <Excalidraw
          excalidrawAPI={(api) => setExcalidrawAPI(api)}
          gridModeEnabled={gridMode}
          initialData={{ Element, appState }}
          onChange={handleChange}
          renderTopRightUI={() => (
            <div className="controlsUniqueContainer">
              <button
                className="mobileHamBudger"
                onClick={toggleDrawer}
               >
                <FaBars style={{ fontSize: "24px" }} />
              </button>
              <div className="undoRedo">
                <button
                  onClick={handleUndo}
                  style={{ padding: "8px", margin: "0 4px" }}>
                  <img src={undo} />
                </button>
                <button
                  onClick={handleRedo}
                  style={{
                    padding: "8px",
                    margin: "0 4px",
                    borderLeft: "2px solid #d2d0d0",
                  }}>
                  <img src={redo} />
                </button>
              </div>
              <div
                className={`controlsUniqueContainer--right ${
                  collapsed ? "visible" : "hidden"
                }`}>
                <button
                  onClick={() => handleMiniModal("open")}
                  style={{
                    padding: "10px",
                    backgroundColor: "#D2D0D0",
                    borderRadius: "3px",
                    marginLeft: "20px",
                  }}>
                  Video & Chat
                </button>
                <button
                  onClick={toggleFullscreen}
                  style={{
                    padding: "10px",
                    backgroundColor: "#D2D0D0",
                    borderRadius: "3px",
                    marginLeft: "20px",
                  }}>
                  Full Board
                </button>
                <button
                  onClick={() => handleModal("open")}
                  style={{
                    padding: "10px",
                    backgroundColor: "#D2D0D0",
                    borderRadius: "3px",
                    marginLeft: "20px",
                  }}>
                  Full Video
                </button>
              </div>

              <button
                className="shareButton"
                onClick={isSharingScreen ? stopScreenShare : startScreenShare}>
                Share Screen
              </button>
            </div>
          )}
          isCollaborating={false}>
          <WelcomeScreen>
            <WelcomeScreen.Center>
              <WelcomeScreen.Center.Heading>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}>
                  <img src={pencil} />
                  <p style={{ marginTop: "1rem" }}>
                    Click AnyWhere To Start Drawing
                  </p>
                </div>
                <div
                  style={{
                    color: "#000",
                    position: "absolute",
                    bottom: "0px",
                  }}>
                  {speechToText}
                </div>
              </WelcomeScreen.Center.Heading>
            </WelcomeScreen.Center>
          </WelcomeScreen>
        </Excalidraw>
        <AudioRecorder onTranscription={handleTranscription} />
      </div>
    </>
  );
};

export default WhiteBoard;
