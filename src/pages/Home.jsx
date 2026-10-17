import { RiImageAiLine, RiImageUploadLine } from "react-icons/ri";
import { CiChat2 } from "react-icons/ci";
import { FaPlus, FaArrowUp } from "react-icons/fa6";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import Chat from "./Chat";
import logo from "../assets/grok-icon.png";

export default function Home() {
  const {
    startRes,
    setStartRes,
    popup,
    setPopup,
    input,
    setInput,
    feature,
    setFeature,
    prevInput,
    setPrevInput,
  } = useContext(UserContext);
  async function handleSubmit(e) {
    setStartRes(true);
    setPrevInput(input);
    setInput("");
  }
  function handlePopup() {
    setPopup((prev) => !prev);
  }
  function handleFeature(feature) {
    setFeature(feature);
    handlePopup();
  }
  return (
    <div className="home">
      <div className="main">
        {!startRes ? (
          <>
            <nav>
              <img src={logo} alt="logo" className="logo" />
              <p>Grok</p>
            </nav>
            <h2 className="title">What should we explore?</h2>
            <div className="categories">
              <div className="category" onClick={() => setFeature("upload")}>
                <RiImageAiLine />
                <span>Upload Image</span>
              </div>
              <div className="category" onClick={() => setFeature("generate")}>
                <RiImageUploadLine />
                <span>Generate Image</span>
              </div>
              <div className="category" onClick={() => setFeature("chat")}>
                <CiChat2 />
                <span>Let's Chat</span>
              </div>
            </div>
          </>
        ) : (
          <Chat />
        )}
        <form
          className="input"
          onSubmit={(e) => {
            e.preventDefault();
            if (input) {
              handleSubmit(e);
            }
          }}
        >
          {feature === "chat" && (
            <FaPlus className="plus" onClick={handlePopup} />
          )}
          {feature === "generate" && (
            <RiImageUploadLine className="plus" onClick={handlePopup} />
          )}
          {feature === "upload" && (
            <RiImageAiLine className="plus" onClick={handlePopup} />
          )}
          {popup && (
            <div className="popup">
              <div className="upload" onClick={() => handleFeature("upload")}>
                <RiImageAiLine />
                <span>Upload Image</span>
              </div>
              <div
                className="generate"
                onClick={() => handleFeature("generate")}
              >
                <RiImageUploadLine />
                <span>Generate Image</span>
              </div>
            </div>
          )}

          <input
            type="text"
            placeholder="Say something..."
            onChange={(e) => setInput(e.target.value)}
            value={input}
          />
          {input && (
            <button type="submit">
              <FaArrowUp className="arrow" />
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
