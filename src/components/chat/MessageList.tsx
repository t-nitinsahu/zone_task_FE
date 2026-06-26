import type { MessageDto } from "../../shared";

type MessageListProps = {
  items: MessageDto[];
};

export const MessageList = ({ items }: MessageListProps) => {
  return (
    <ul className="space-y-3">
      {items.map((message) => (
        <li key={message.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-brand-700">{message.userName}</p>
            <time className="text-xs text-slate-400">{new Date(message.createdAt).toLocaleTimeString()}</time>
          </div>
          <p className="mt-2 text-sm text-slate-700">{message.content}</p>
        </li>
      ))}
    </ul>
  );
};
