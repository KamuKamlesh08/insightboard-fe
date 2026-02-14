import type { Task } from "../api/types";

export function TaskDetails(props: {
  task?: Task;
  requiredBy?: string[];
  onJump: (id: string) => void;
}) {
  if (!props.task) {
    return (
      <div className="rounded-2xl border bg-white p-4 shadow-sm text-sm text-gray-500">
        Select a task to see details.
      </div>
    );
  }

  const t = props.task;

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold">Task details</h3>
        <span className="rounded-lg bg-gray-50 px-2 py-1 text-xs font-mono">
          {t.id}
        </span>
      </div>

      <p className="mt-2 text-sm">{t.description}</p>

      <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl border p-3">
          <p className="text-xs text-gray-500">Priority</p>
          <p className="mt-1 font-semibold">{t.priority}</p>
        </div>
        <div className="rounded-xl border p-3">
          <p className="text-xs text-gray-500">Status</p>
          <p className="mt-1 font-semibold">{t.status}</p>
        </div>
      </div>

      <div className="mt-3 rounded-xl border p-3">
        <p className="text-xs text-gray-500">Depends on</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {t.dependencies.length ? (
            t.dependencies.map((d) => (
              <button
                key={d}
                onClick={() => props.onJump(d)}
                className="rounded-lg bg-gray-100 px-2 py-1 text-xs font-mono hover:bg-gray-200"
              >
                {d}
              </button>
            ))
          ) : (
            <span className="text-xs text-gray-400">No dependencies</span>
          )}
        </div>
      </div>

      <div className="mt-3 rounded-xl border p-3">
        <p className="text-xs text-gray-500">Required by</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {props.requiredBy?.length ? (
            props.requiredBy.map((id) => (
              <button
                key={id}
                onClick={() => props.onJump(id)}
                className="rounded-lg bg-gray-100 px-2 py-1 text-xs font-mono hover:bg-gray-200"
              >
                {id}
              </button>
            ))
          ) : (
            <span className="text-xs text-gray-400">No dependents</span>
          )}
        </div>
      </div>
    </div>
  );
}
