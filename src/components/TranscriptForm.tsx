import { useState } from "react";

export function TranscriptForm(props: {
  onSubmit: (text: string) => void;
  disabled?: boolean;
}) {
  const [text, setText] = useState(
    "We need to build a dependency engine backend using Node.js, validate dependencies, detect cycles, store in MongoDB, and deploy.",
  );

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-gray-900">
          Meeting transcript
        </h2>

        <button
          disabled={props.disabled || !text.trim()}
          onClick={() => props.onSubmit(text)}
          className="rounded-xl bg-gradient-to-r from-indigo-600 to-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95 disabled:opacity-50"
        >
          Generate graph
        </button>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={6}
        className="mt-3 w-full resize-y rounded-xl border p-3 text-sm outline-none focus:ring-4 focus:ring-indigo-100"
        placeholder="Paste meeting transcript here..."
      />

      <div className="mt-2 flex flex-wrap gap-2 text-xs">
        <span className="rounded-full bg-amber-100 px-3 py-1 font-semibold text-amber-700">
          Sanitize deps
        </span>
        <span className="rounded-full bg-rose-100 px-3 py-1 font-semibold text-rose-700">
          Detect cycles
        </span>
        <span className="rounded-full bg-emerald-100 px-3 py-1 font-semibold text-emerald-700">
          Persist to Mongo
        </span>
      </div>
    </div>
  );
}
