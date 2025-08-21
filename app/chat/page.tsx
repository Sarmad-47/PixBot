"use client";
import React, {
  useState,
  useRef,
  useEffect,
  FormEvent,
  ChangeEvent,
} from "react";
import { runGeminiAi } from "@/actions/geminiai";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Define the Message interface
interface Message {
  id: number;
  message: string;
  sender: "user" | "bot";
}

export default function Contact() {
  // Set up state variables
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Create refs
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null); // Added ref for input element

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (message.trim() === "") return;

    // Add user message to chat
    const userMessage: Message = {
      id: Date.now(),
      message,
      sender: "user",
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    // Clear input and show loading state
    setMessage("");
    setIsLoading(true);

    try {
      // Call Gemini AI API
      const botResponse = await runGeminiAi(message);

      // Add bot response to chat
      const botMessage: Message = {
        id: Date.now(),
        message: botResponse ?? "No response",
        sender: "bot",
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error running Gemini AI:", error);

      // Add error message
      const errorMessage: Message = {
        id: Date.now(),
        message: "Sorry, I encountered an error. Please try again.",
        sender: "bot",
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      // Stop loading and focus back on input
      setIsLoading(false);
      inputRef.current?.focus(); // Auto-focus input after response
    }
  };

  // Handle input change
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  // Auto-scroll to the last message and auto-focus input on mount
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    inputRef.current?.focus(); // Auto-focus input when component mounts
  }, [messages]);

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Chat with AI Assistant</h1>

      {/* Render chat messages */}
      <div className="chat-box mb-4 max-h-96 overflow-y-auto border rounded-lg p-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            Start a conversation by sending a message!
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            ref={
              msg.id === messages[messages.length - 1]?.id
                ? lastMessageRef
                : null
            }
            className={`flex mb-4 ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg ${
                msg.sender === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-purple-600 text-white"
              }`}
            >
              {msg.message}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-purple-600 text-white px-4 py-2 rounded-lg">
              <div className="flex space-x-2">
                <div className="h-2 w-2 bg-white rounded-full animate-bounce"></div>
                <div
                  className="h-2 w-2 bg-white rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="h-2 w-2 bg-white rounded-full animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Render input form */}
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <Input
          ref={inputRef} // Added ref to auto-focus
          className="flex-1"
          placeholder="Type your message..."
          value={message}
          onChange={handleInputChange}
          disabled={isLoading}
          autoFocus // Ensure input is focused by default
        />
        <Button
          type="submit"
          disabled={isLoading || message.trim() === ""}
          className="cursor-pointer"
        >
          Send
        </Button>
      </form>
    </div>
  );
}
