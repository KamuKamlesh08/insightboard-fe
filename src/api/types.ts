export type JobStatus = "QUEUED" | "RUNNING" | "DONE" | "FAILED";
export type TaskStatus = "OK" | "BLOCKED_ERROR";

export interface Task {
  id: string;
  description: string;
  priority: number; // 1..5 (1 highest)
  dependencies: string[];
  status: TaskStatus;
}

export interface GraphError {
  type: string;
  message: string;
  nodes?: string[];
  removedDependencies?: Array<{ taskId: string; removed: string[] }>;
}

export interface GraphResult {
  tasks: Task[];
  errors: GraphError[];
  topoOrder?: string[];
}

export interface GraphJobResponse {
  jobId: string;
  status: JobStatus;
  createdAt: string;
  updatedAt: string;
  result?: GraphResult;
}

export interface CreateGraphResponse {
  jobId: string;
  status: JobStatus;
  createdAt: string;
  updatedAt: string;
  result?: GraphResult;
}
