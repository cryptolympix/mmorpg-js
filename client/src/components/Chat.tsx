import "./Chat.scss";
import React, { useState, useEffect, useRef } from "react";
import { ChatMessageSchema } from "../../../shared/database.schemas";
import { ChatMessage } from "../../../shared/types";
import { io } from "socket.io-client";
import Config from "../../../shared/config.json";
import { useGameContext } from "../contexts/GameContext";
import { getHero } from "../api/heroes.api";
import { postChatMessage, getChatMessages } from "../api/chat.api";

const socket = io(Config.urls.server);

interface ChatProps {}

function timestampToString(timestamp: number): string {
  const date = new Date(timestamp);
  return `${date.getHours()}:${date.getMinutes()}`;
}

const Chat: React.FC<ChatProps> = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const { playerHero } = useGameContext();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Load the chat messages posted in the last 24 hours
    getChatMessages()
      .then((chatMessages) => {
        const promises = chatMessages
          .filter((msg) => Date.now() - msg.timestamp < 24 * 60 * 60 * 1000)
          .map((msg) =>
            getHero(msg.heroId).then((hero) => ({
              id: msg.id,
              senderName: hero.getName(),
              text: msg.text,
              timestamp: msg.timestamp,
            }))
          );

        Promise.all(promises).then((messages) => {
          setMessages(messages);
        });
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    socket.on("chat-message-posted", async (msg: ChatMessageSchema) => {
      if (msg.heroId === playerHero.getId()) return;
      getHero(msg.heroId)
        .then((hero) => {
          setMessages((prev) => [
            ...prev,
            {
              id: msg.id,
              senderName: hero.getName(),
              text: msg.text,
              timestamp: msg.timestamp,
            } as ChatMessage,
          ]);
        })
        .catch((err) => console.error(err));
    });

    return () => {
      socket.off("chat-message-posted");
    };
  }, [playerHero]);

  useEffect(() => {
    // Scroll to bottom when messages update
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (input.trim() === "") return;

    const newMsgTimestamp = Date.now();
    const newMsgId = `msg-${newMsgTimestamp}`;
    const newMsgText = input;
    const newMsgHero = playerHero;

    const newMsgSchema: ChatMessageSchema = {
      id: newMsgId,
      heroId: newMsgHero.getId(),
      text: newMsgText,
      timestamp: newMsgTimestamp,
    };
    const newMsg: ChatMessage = {
      id: newMsgId,
      senderName: newMsgHero.getName(),
      text: newMsgText,
      timestamp: newMsgTimestamp,
    };

    postChatMessage(newMsgHero.getId(), newMsgText)
      .then(() => {
        socket.emit("post-chat-message", newMsgSchema);
        setMessages((prev) => [...prev, newMsg]);
        setInput("");
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="Chat">
      <div className="Chat__messages">
        {messages.map((msg) => (
          <div key={msg.id}>
            <strong>
              {timestampToString(msg.timestamp)} - {msg.senderName}:
            </strong>{" "}
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="Chat__input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
