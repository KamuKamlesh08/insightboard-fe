import type { Task } from "../api/types";

function statusChip(status: Task["status"]) {
  if (status === "OK") return "bg-green-100 text-green-700";
  return "bg-red-100 text-red-700";
}

function prioLabel(p: number) {
  // 1 highest
  if (p <= 1) return "P1";
  if (p === 2) return "P2";
  if (p === 3) return "P3";
  if (p === 4) return "P4";
  return "P5";
}

export function TaskTable(props: {
  tasks?: Task[];
  selectedId?: string;
  onSelect: (id: string) => void;
  topoOrder?: string[];
}) {
  const tasks = props.tasks ?? [];
  if (!tasks.length) return null;

  // For UX: show in execution order if provided
  const ordered = props.topoOrder?.length
    ? (props.topoOrder
        .map((id) => tasks.find((t) => t.id === id))
        .filter(Boolean) as Task[])
    : [...tasks].sort((a, b) => a.priority - b.priority);

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold">Tasks</h3>
        <span className="text-xs text-gray-500">
          {props.topoOrder?.length
            ? "Execution order (topological)"
            : "Sorted by priority"}
        </span>
      </div>

      <div className="mt-3 overflow-auto rounded-xl border">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs text-gray-600">
            <tr>
              <th className="px-3 py-2">ID</th>
              <th className="px-3 py-2">Description</th>
              <th className="px-3 py-2">Priority</th>
              <th className="px-3 py-2">Dependencies</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {ordered.map((t) => {
              const active = t.id === props.selectedId;
              return (
                <tr
                  key={t.id}
                  onClick={() => props.onSelect(t.id)}
                  className={`cursor-pointer border-t hover:bg-gray-50 ${active ? "bg-gray-50" : ""}`}
                >
                  <td className="px-3 py-2 font-mono">{t.id}</td>
                  <td className="px-3 py-2">{t.description}</td>
                  <td className="px-3 py-2">
                    <span className="rounded-lg bg-gray-100 px-2 py-1 text-xs font-medium">
                      {prioLabel(t.priority)}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-1">
                      {t.dependencies.length ? (
                        t.dependencies.map((d) => (
                          <span
                            key={d}
                            className="rounded-lg bg-gray-100 px-2 py-1 text-xs font-mono"
                          >
                            {d}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={`rounded-lg px-2 py-1 text-xs font-medium ${statusChip(t.status)}`}
                    >
                      {t.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
