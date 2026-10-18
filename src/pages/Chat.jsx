import { useEffect, useRef } from "react";
import { FaDownload } from "react-icons/fa6";

export default function Chat({ messages, isLoading }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isLoading]);

  return (
    <section className="conversation" aria-label="Conversation" aria-live="polite">
      {messages.map((message) => (
        <article className={`message ${message.role}`} key={message.id}>
          {message.role === "assistant" && <span className="assistant-mark" aria-hidden="true">✳</span>}
          <div className="message-content">
            {message.text && <p className="message-text">{message.text}</p>}
            {message.image && (
              <img className="message-image" src={message.image.preview} alt="Image attached to the prompt" />
            )}
            {message.images?.map((src, index) => (
              <div className="generated-image" key={`${message.id}-${index}`}>
                <img className="message-image" src={src} alt={`Generated image ${index + 1}`} />
                <a href={src} download={`grok-image-${index + 1}.png`} className="download-image">
                  <FaDownload aria-hidden="true" /> Download image
                </a>
              </div>
            ))}
          </div>
        </article>
      ))}
      {isLoading && (
        <div className="thinking" role="status">
          <span className="assistant-mark" aria-hidden="true">✳</span>
          <span className="thinking-dots"><i /><i /><i /></span>
          <span className="sr-only">Grok is thinking</span>
        </div>
      )}
      <div ref={bottomRef} />
    </section>
  );
}
