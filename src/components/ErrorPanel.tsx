import type { GraphError } from "../api/types";

export function ErrorPanel(props: { errors?: GraphError[] }) {
  const errors = props.errors ?? [];
  if (!errors.length) return null;

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <h3 className="text-sm font-semibold">Validation & logic notes</h3>
      <div className="mt-3 space-y-3">
        {errors.map((e, idx) => (
          <div key={idx} className="rounded-xl border bg-red-50 p-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-red-700">
                {e.type}
              </span>
              {e.nodes?.length ? (
                <span className="text-xs text-red-700">
                  Nodes: <span className="font-mono">{e.nodes.join(", ")}</span>
                </span>
              ) : null}
            </div>
            <p className="mt-1 text-sm text-red-800">{e.message}</p>

            {e.removedDependencies?.length ? (
              <div className="mt-2 rounded-lg bg-white/60 p-2">
                <p className="text-xs font-semibold text-red-700">
                  Sanitized dependencies:
                </p>
                <ul className="mt-1 list-disc pl-5 text-xs text-red-800">
                  {e.removedDependencies.map((r) => (
                    <li key={r.taskId}>
                      <span className="font-mono">{r.taskId}</span> removed{" "}
                      <span className="font-mono">{r.removed.join(", ")}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
