import { createContext, useState } from "react";

export const UserContext = createContext(null);

export default function UserContextProvider({ children }) {
  const [startRes, setStartRes] = useState(false);
  const [popup, setPopup] = useState(false);
  const [input, setInput] = useState("");
  const [feature, setFeature] = useState("chat");
  const [prevInput, setPrevInput] = useState("");
  return (
    <UserContext.Provider
      value={{
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
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
