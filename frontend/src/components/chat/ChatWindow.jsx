import { useEffect, useRef, useState } from "react";
import { useApp } from "../../context/AppContext";
import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";

const ChatWindow = () => {

  const { state, dispatch } = useApp();
  const { chatMessages } = state;

  const [isTyping, setIsTyping] = useState(false);

  const bottomRef = useRef(null);



  // Send message to backend
  const handleSend = async (input) => {

    if (!input.trim()) return;

    const userMessage = {
      role: "user",
      content: input
    };

    dispatch({
      type: "ADD_CHAT_MESSAGE",
      payload: userMessage
    });

    setIsTyping(true);

    try {

      const response = await fetch("https://sleepsense-ai.onrender.com/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          message: input
        })
      });

      const data = await response.json();

      const botMessage = {
        role: "assistant",
        content: data.reply
      };

      dispatch({
        type: "ADD_CHAT_MESSAGE",
        payload: botMessage
      });

      // AFTER fetch is complete, signal a refetch if needed
      const sleepKeywords = ["sleep", "slept", "hours", "tired", "bed"];
      if (sleepKeywords.some(keyword => input.toLowerCase().includes(keyword))) {
        dispatch({ type: "INCREMENT_REFETCH_COUNTER" });
      }

    } catch (error) {

      console.error(error);

      dispatch({
        type: "ADD_CHAT_MESSAGE",
        payload: {
          role: "assistant",
          content: "Sorry, I couldn't reach the AI service."
        }
      });

    }

    setIsTyping(false);

  };


  // Fetch greeting when chat opens
  useEffect(() => {

    const fetchGreeting = async () => {

      try {

        // Only show greeting if no messages yet
        if (chatMessages.length > 0) return;

        const response = await fetch("https://sleepsense-ai.onrender.com/greeting", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });

        const data = await response.json();

        dispatch({
          type: "ADD_CHAT_MESSAGE",
          payload: {
            role: "assistant",
            content: data.greeting
          }
        });

      } catch (error) {
        console.error("Greeting fetch error:", error);
      }

    };

    fetchGreeting();

  }, []);


  // Auto-scroll chat
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [chatMessages]);


  return (

    <div className="bg-white rounded-xl shadow p-6 flex flex-col flex-1">

      <div className="flex justify-between items-center mb-3">

        <h2 className="text-lg font-semibold">AI Sleep Companion</h2>

      </div>


      <div className="flex-1 overflow-y-auto pr-2">

        {chatMessages.map((msg, index) => (
          <ChatBubble key={index} message={msg} />
        ))}

        {isTyping && (
          <div className="flex justify-start mb-3">
            <div className="bg-gray-200 px-4 py-2 rounded-2xl text-sm text-gray-600">
              AI is thinking...
            </div>
          </div>
        )}

        <div ref={bottomRef} />

      </div>

      <ChatInput onSend={handleSend} />

    </div>

  );

};

export default ChatWindow;