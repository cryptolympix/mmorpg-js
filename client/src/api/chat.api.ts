import axios from "axios";
import Config from "../../../shared/config.json";
import { ChatMessageSchema } from "../../../shared/database.schemas";

export async function getChatMessages(): Promise<ChatMessageSchema[]> {
  return axios.get(Config.urls.server + "/api/chat").then((response) => {
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Failed to fetch messages");
    }
  });
}

export async function postChatMessage(
  heroId: string,
  text: string
): Promise<void> {
  const id = Date.now();
  const chatMessage: ChatMessageSchema = {
    id: `msg-${id}`,
    heroId,
    text,
    timestamp: id,
  };

  return axios
    .post(Config.urls.server + "/api/chat", chatMessage)
    .then((response) => {
      if (response.status === 201) {
        if (Config.dev.debug) {
          console.log(`Api postChatMessage: message posted`);
        }
      } else {
        throw new Error("Failed to post message");
      }
    });
}
