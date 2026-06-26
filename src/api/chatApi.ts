import { messageListSchema, messageSchema, type CreateMessageInput, type MessageDto } from "@zone/shared";

import { apiClient } from "../lib/axios";

export const fetchMessages = async (): Promise<MessageDto[]> => {
  const response = await apiClient.get("/chat/messages");
  return messageListSchema.parse(response.data);
};

export const createMessage = async (payload: CreateMessageInput): Promise<MessageDto> => {
  const response = await apiClient.post("/chat/messages", payload);
  return messageSchema.parse(response.data);
};
