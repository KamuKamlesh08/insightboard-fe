import type { JobStatus } from "../api/types";

const badge = (s: JobStatus) => {
  switch (s) {
    case "QUEUED":
      return "bg-gray-100 text-gray-700";
    case "RUNNING":
      return "bg-blue-100 text-blue-700";
    case "DONE":
      return "bg-green-100 text-green-700";
    case "FAILED":
      return "bg-red-100 text-red-700";
  }
};

export function JobStatusBar(props: {
  jobId?: string;
  status?: JobStatus;
  loading?: boolean;
}) {
  if (!props.jobId || !props.status) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-2xl border bg-white p-3 shadow-sm">
      <span className="text-xs text-gray-500">Job</span>
      <span className="rounded-lg bg-gray-50 px-2 py-1 text-xs font-mono">
        {props.jobId}
      </span>
      <span
        className={`rounded-lg px-2 py-1 text-xs font-medium ${badge(props.status)}`}
      >
        {props.status}
        {props.loading ? "…" : ""}
      </span>
      <span className="ml-auto text-xs text-gray-500">
        Polling {props.loading ? "every ~1s" : "stopped"}
      </span>
    </div>
  );
}
