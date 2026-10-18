import { useContext, useRef } from "react";
import { CiChat2 } from "react-icons/ci";
import { FaArrowUp, FaPlus } from "react-icons/fa6";
import { RiImageAiLine, RiImageUploadLine } from "react-icons/ri";
import { UserContext } from "../context.jsx";
import Chat from "./Chat";
import logo from "../assets/grok-icon.png";
import { generateImage, generateResponse } from "../gemini";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

function readImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result);
      resolve({
        data: dataUrl.split(",")[1],
        mimeType: file.type,
        preview: dataUrl,
        name: file.name,
      });
    };
    reader.onerror = () => reject(new Error("This image could not be opened."));
    reader.readAsDataURL(file);
  });
}

export default function Home() {
  const {
    messages,
    setMessages,
    input,
    setInput,
    feature,
    setFeature,
    image,
    setImage,
    isLoading,
    setIsLoading,
    error,
    setError,
  } = useContext(UserContext);
  const fileInput = useRef(null);
  const formRef = useRef(null);
  const isConversationStarted = messages.length > 0;

  function startNewChat() {
    setMessages([]);
    setInput("");
    setImage(null);
    setError("");
    setFeature("chat");
  }

  async function handleImage(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setError("");
    if (!file.type.startsWith("image/")) {
      setError("Choose an image file to upload.");
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setError("Images must be 10 MB or smaller.");
      return;
    }
    try {
      setImage(await readImage(file));
      setFeature("chat");
    } catch (uploadError) {
      setError(uploadError.message);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const prompt = input.trim();
    if ((!prompt && !image) || isLoading) return;
    const requestImage = image;
    const visiblePrompt = prompt || "Describe this image.";
    setInput("");
    setImage(null);
    setError("");
    setIsLoading(true);
    setMessages((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        role: "user",
        text: visiblePrompt,
        image: requestImage,
      },
    ]);

    try {
      const result =
        feature === "generate"
          ? await generateImage(visiblePrompt, requestImage)
          : await generateResponse(messages, visiblePrompt, requestImage);
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          text: result.text,
          images: result.images,
        },
      ]);
    } catch (requestError) {
      setError(
        requestError.message || "Something went wrong. Please try again.",
      );
    } finally {
      setIsLoading(false);
      formRef.current?.focus();
    }
  }

  return (
    <div className="app-shell">
      <main className="main">
        {!isConversationStarted && (
          <button
            className="brand"
            onClick={startNewChat}
            aria-label="Start a new chat"
          >
            <img src={logo} alt="" className="logo" />
            <span>Grok</span>
          </button>
        )}
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          hidden
          onChange={handleImage}
        />

        {!isConversationStarted ? (
          <section className="welcome">
            <h1>What should we explore?</h1>
            <div className="categories" aria-label="Choose what to do">
              <button
                className="category"
                onClick={() => fileInput.current?.click()}
              >
                <RiImageAiLine aria-hidden="true" />
                <span>Understand an image</span>
              </button>
              <button
                className="category"
                onClick={() => {
                  setFeature("generate");
                  formRef.current?.focus();
                }}
              >
                <RiImageUploadLine aria-hidden="true" />
                <span>Create an image</span>
              </button>
              <button
                className="category"
                onClick={() => {
                  setFeature("chat");
                  formRef.current?.focus();
                }}
              >
                <CiChat2 aria-hidden="true" />
                <span>Start a conversation</span>
              </button>
            </div>
          </section>
        ) : (
          <Chat messages={messages} isLoading={isLoading} />
        )}

        <div className="composer-area">
          {error && (
            <div className="error-banner" role="alert">
              {error}
            </div>
          )}
          <form className="composer" onSubmit={handleSubmit}>
            {image && (
              <div className="image-preview">
                <img src={image.preview} alt={`Selected: ${image.name}`} />
                <button
                  type="button"
                  aria-label="Remove image"
                  onClick={() => setImage(null)}
                >
                  ×
                </button>
              </div>
            )}
            <button
              type="button"
              className="tool-button"
              aria-label="Attach an image"
              title="Attach an image"
              onClick={() => fileInput.current?.click()}
            >
              {feature === "generate" ? <RiImageUploadLine /> : <FaPlus />}
            </button>
            <textarea
              ref={formRef}
              rows="1"
              placeholder={
                feature === "generate"
                  ? "Describe the image you want to create…"
                  : "Ask anything…"
              }
              aria-label="Message"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  event.currentTarget.form.requestSubmit();
                }
              }}
              disabled={isLoading}
            />
            <div className="composer-actions">
              <button
                type="button"
                className={`mode-button ${feature === "generate" ? "active" : ""}`}
                onClick={() =>
                  setFeature(feature === "generate" ? "chat" : "generate")
                }
                aria-pressed={feature === "generate"}
                title="Toggle image generation"
              >
                <RiImageUploadLine />
                <span>Create</span>
              </button>
              <button
                type="submit"
                className="send-button"
                aria-label="Send message"
                disabled={isLoading || (!input.trim() && !image)}
              >
                <FaArrowUp />
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
