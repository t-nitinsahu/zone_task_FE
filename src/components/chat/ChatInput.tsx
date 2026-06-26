import { type FormEvent, useState } from "react";
import { createMessageSchema } from "../../shared";

type ChatInputProps = {
  onSubmit: (payload: { userName: string; content: string }) => Promise<void>;
  isSubmitting: boolean;
};

export const ChatInput = ({ onSubmit, isSubmitting }: ChatInputProps) => {
  const [userName, setUserName] = useState("Engineer");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    const parsed = createMessageSchema.safeParse({ userName, content });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }

    setError(null);
    await onSubmit(parsed.data);
    setContent("");
  };

  return (
    <form className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm" onSubmit={handleSubmit}>
      <div className="grid gap-3 sm:grid-cols-[180px,1fr,auto]">
        <label className="flex flex-col gap-1 text-xs font-medium text-slate-500">
          Name
          <input
            value={userName}
            onChange={(event) => setUserName(event.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-brand-500 transition focus:ring"
            placeholder="Your name"
            maxLength={30}
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-slate-500">
          Message
          <input
            value={content}
            onChange={(event) => setContent(event.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-brand-500 transition focus:ring"
            placeholder="Type your message"
            maxLength={500}
          />
        </label>
        <button
          type="submit"
          className="mt-auto h-10 rounded-lg bg-brand-700 px-4 text-sm font-semibold text-white transition hover:bg-brand-900 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Send"}
        </button>
      </div>
      {error ? <p className="mt-2 text-xs text-red-600">{error}</p> : null}
    </form>
  );
};
