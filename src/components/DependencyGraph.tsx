import React, { useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  type Edge,
  type Node,
  MarkerType,
} from "reactflow";
import type { Task } from "../api/types";

function nodeStyle(t: Task): React.CSSProperties {
  // no Tailwind inside reactflow style; use inline
  const base = {
    borderRadius: 16,
    padding: 10,
    border: "1px solid rgba(0,0,0,0.08)",
    boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
  } as React.CSSProperties;

  if (t.status === "BLOCKED_ERROR") {
    return {
      ...base,
      background: "linear-gradient(135deg,#ffe4e6,#fff1f2)",
      color: "#881337",
    };
  }
  // priority highlight
  if (t.priority <= 2) {
    return {
      ...base,
      background: "linear-gradient(135deg,#e0e7ff,#dbeafe)",
      color: "#1f2937",
    };
  }
  return {
    ...base,
    background: "linear-gradient(135deg,#ecfeff,#d1fae5)",
    color: "#1f2937",
  };
}

export function DependencyGraph(props: {
  tasks?: Task[];
  selectedId?: string;
  onSelect: (id: string) => void;
}) {
  const tasks = props.tasks ?? [];
  if (!tasks.length) return null;

  const { nodes, edges } = useMemo(() => {
    const nodes: Node[] = tasks.map((t, idx) => ({
      id: t.id,
      position: { x: (idx % 3) * 260, y: Math.floor(idx / 3) * 140 },
      data: { label: `${t.id} • P${t.priority}\n${t.description}` },
      style: nodeStyle(t),
    }));

    const edges: Edge[] = [];
    for (const t of tasks) {
      for (const dep of t.dependencies) {
        edges.push({
          id: `${dep}->${t.id}`,
          source: dep,
          target: t.id,
          animated: t.status !== "BLOCKED_ERROR",
          markerEnd: { type: MarkerType.ArrowClosed },
          style:
            t.status === "BLOCKED_ERROR"
              ? { stroke: "#f43f5e", strokeWidth: 2 }
              : { stroke: "#6366f1", strokeWidth: 2 },
        });
      }
    }

    return { nodes, edges };
  }, [tasks]);

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">
          Dependency graph
        </h3>
        <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
          ReactFlow
        </span>
      </div>

      <div className="mt-3 h-[520px] overflow-hidden rounded-2xl border">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          onNodeClick={(_, n) => props.onSelect(n.id)}
        >
          <MiniMap zoomable pannable />
          <Controls />
          <Background />
        </ReactFlow>
      </div>

      {props.selectedId ? (
        <p className="mt-2 text-xs text-gray-500">
          Selected:{" "}
          <span className="font-mono font-semibold">{props.selectedId}</span>
        </p>
      ) : (
        <p className="mt-2 text-xs text-gray-500">
          Click a node to inspect task details.
        </p>
      )}
    </div>
  );
}
