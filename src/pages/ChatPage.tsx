import { useCallback, useState } from "react";

import { ChatInput } from "../components/chat/ChatInput";
import { MessageList } from "../components/chat/MessageList";
import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import { Spinner } from "../components/ui/Spinner";
import { useMessages } from "../hooks/useMessages";
import { useSocket } from "../hooks/useSocket";

export const ChatPage = () => {
  const { messagesQuery, sendMessageMutation, appendRealtimeMessage } = useMessages();
  const [socketError, setSocketError] = useState<string | null>(null);

  useSocket({
    onNewMessage: appendRealtimeMessage,
    onError: setSocketError
  });

  const handleSend = useCallback(
    async (payload: { userName: string; content: string }): Promise<void> => {
      await sendMessageMutation.mutateAsync(payload);
    },
    [sendMessageMutation]
  );

  const messages = messagesQuery.data ?? [];

  return (
    <Card title="Realtime Chat" subtitle="Socket-powered collaborative updates.">
      <div className="space-y-4">
        <ChatInput onSubmit={handleSend} isSubmitting={sendMessageMutation.isPending} />
        {socketError ? <p className="text-sm text-red-600">Realtime error: {socketError}</p> : null}

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          {messagesQuery.isLoading ? (
            <div className="flex justify-center py-12">
              <Spinner />
            </div>
          ) : null}

          {messagesQuery.isError ? (
            <EmptyState title="Unable to load messages" description="Please try again in a moment." />
          ) : null}

          {!messagesQuery.isLoading && !messagesQuery.isError && messages.length === 0 ? (
            <EmptyState title="No messages yet" description="Start the conversation with your first message." />
          ) : null}

          {!messagesQuery.isLoading && !messagesQuery.isError && messages.length > 0 ? (
            <MessageList items={messages} />
          ) : null}
        </div>
      </div>
    </Card>
  );
};
