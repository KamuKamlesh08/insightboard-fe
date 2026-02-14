import { useMemo, useState } from "react";
import { TranscriptForm } from "./components/TranscriptForm";
import { JobStatusBar } from "./components/JobStatusBar";
import { ErrorPanel } from "./components/ErrorPanel";
import { TaskTable } from "./components/TaskTable";
import { TaskDetails } from "./components/TaskDetails";
import { DependencyGraph } from "./components/DependencyGraph";
import { useGraphJob } from "./hooks/useGraphJob";

export default function App() {
  const { state, submitTranscript, tasksById } = useGraphJob();
  const [selectedId, setSelectedId] = useState<string | undefined>();

  const tasks = state.job?.result?.tasks ?? [];
  const topoOrder = state.job?.result?.topoOrder;

  const requiredByMap = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const t of tasks)
      for (const d of t.dependencies) {
        map.set(d, [...(map.get(d) ?? []), t.id]);
      }
    return map;
  }, [tasks]);

  const selectedTask = selectedId ? tasksById.get(selectedId) : undefined;
  const requiredBy = selectedId ? (requiredByMap.get(selectedId) ?? []) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-sky-50 to-emerald-50">
      <div className="mx-auto max-w-6xl p-5">
        {/* Top Bar */}
        <div className="rounded-3xl border bg-white/70 p-4 shadow-sm backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-gray-900">
                InsightBoard{" "}
                <span className="text-indigo-600">Dependency Engine</span>
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Transcript → Tasks → Dependency Graph (sanitize deps + detect
                cycles)
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                React + Tailwind
              </span>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                Node + Mongo
              </span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4">
            <TranscriptForm
              onSubmit={(t) => {
                setSelectedId(undefined);
                submitTranscript(t);
              }}
              disabled={state.loading}
            />
            <JobStatusBar
              jobId={state.job?.jobId}
              status={state.job?.status}
              loading={state.loading}
            />

            {state.error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                {state.error}
              </div>
            ) : null}
          </div>
        </div>

        {/* Main Grid */}
        <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <ErrorPanel errors={state.job?.result?.errors} />
            <TaskTable
              tasks={tasks}
              selectedId={selectedId}
              onSelect={setSelectedId}
              topoOrder={topoOrder}
            />
            <DependencyGraph
              tasks={tasks}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </div>

          <div className="space-y-4">
            <TaskDetails
              task={selectedTask}
              requiredBy={requiredBy}
              onJump={setSelectedId}
            />

            {topoOrder?.length ? (
              <div className="rounded-2xl border bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Suggested execution order
                  </h3>
                  <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
                    Topological
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {topoOrder.map((id) => (
                    <button
                      key={id}
                      onClick={() => setSelectedId(id)}
                      className="rounded-xl bg-gray-100 px-2 py-1 text-xs font-mono hover:bg-gray-200"
                    >
                      {id}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-gray-500">
          Tip: Cycles show as{" "}
          <span className="font-semibold text-red-600">Blocked/Error</span> and
          sanitized deps appear in notes.
        </p>
      </div>
    </div>
  );
}
