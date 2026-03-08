import { useState } from "react";

const ChatInput = ({ onSend }) => {

  const [input, setInput] = useState("");

  const handleSend = () => {

    if (!input.trim()) return;

    onSend(input);

    setInput("");
  };

  const handleKeyPress = (e) => {

    if (e.key === "Enter") {
      handleSend();
    }

  };

  return (

    <div className="flex mt-4">

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="Type your message..."
        className="flex-1 border rounded-l-lg px-4 py-2 focus:outline-none"
      />

      <button
        onClick={handleSend}
        className="bg-blue-600 text-white px-4 rounded-r-lg"
      >
        Send
      </button>

    </div>

  );
};

export default ChatInput;