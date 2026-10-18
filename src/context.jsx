import { createContext, useState } from "react";

// Keep the context and its provider together to make the app state easy to find.
// oxlint-disable-next-line react/only-export-components
export const UserContext = createContext(null);

export default function UserContextProvider({ children }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [feature, setFeature] = useState("chat");
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  return (
    <UserContext.Provider
      value={{
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
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
