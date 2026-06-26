import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateMessageInput, MessageDto } from "@zone/shared";

import { createMessage, fetchMessages } from "../api/chatApi";

const MESSAGES_QUERY_KEY = ["messages"] as const;

export const useMessages = () => {
  const queryClient = useQueryClient();

  const messagesQuery = useQuery({
    queryKey: MESSAGES_QUERY_KEY,
    queryFn: fetchMessages
  });

  const sendMessageMutation = useMutation({
    mutationFn: (payload: CreateMessageInput) => createMessage(payload),
    onSuccess: (newMessage: MessageDto) => {
      queryClient.setQueryData<MessageDto[]>(MESSAGES_QUERY_KEY, (current) => {
        if (!current) {
          return [newMessage];
        }

        const exists = current.some((value) => value.id === newMessage.id);
        return exists ? current : [...current, newMessage];
      });
    }
  });

  const appendRealtimeMessage = (message: MessageDto): void => {
    queryClient.setQueryData<MessageDto[]>(MESSAGES_QUERY_KEY, (current) => {
      if (!current) {
        return [message];
      }

      const exists = current.some((value) => value.id === message.id);
      return exists ? current : [...current, message];
    });
  };

  return {
    messagesQuery,
    sendMessageMutation,
    appendRealtimeMessage
  };
};
