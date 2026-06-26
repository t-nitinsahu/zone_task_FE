import { useEffect } from "react";
import { type MessageDto, messageSchema } from "@zone/shared";
import { io, type Socket } from "socket.io-client";

import { env } from "../config/env";

type UseSocketParams = {
  onNewMessage: (message: MessageDto) => void;
  onError: (message: string) => void;
};

export const useSocket = ({ onNewMessage, onError }: UseSocketParams): void => {
  useEffect(() => {
    const socket: Socket = io(env.WEB_SOCKET_URL, {
      transports: ["websocket", "polling"]
    });

    socket.on("chat:new-message", (payload: unknown) => {
      const parsed = messageSchema.safeParse(payload);
      if (parsed.success) {
        onNewMessage(parsed.data);
      }
    });

    socket.on("chat:error", (payload: { message?: string }) => {
      onError(payload.message ?? "Socket error");
    });

    return () => {
      socket.disconnect();
    };
  }, [onError, onNewMessage]);
};
