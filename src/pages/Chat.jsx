import { useContext } from "react";
import { UserContext } from "../context/UserContext";

export default function Chat() {
  const { prevInput, setPrevInput } = useContext(UserContext);
  return (
    <div className="chat">
      <div className="input-chat">
        <span>{prevInput}</span>
      </div>
      <div className="output-chat">
        <span>AI</span>
      </div>
    </div>
  );
}
