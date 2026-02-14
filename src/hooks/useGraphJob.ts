import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createGraph, getGraphJob } from "../api/client";
import type { GraphJobResponse, JobStatus, Task } from "../api/types";

type State = {
  loading: boolean;
  error?: string;
  job?: GraphJobResponse;
};

export function useGraphJob() {
  const [state, setState] = useState<State>({ loading: false });
  const pollTimer = useRef<number | null>(null);

  const stopPolling = useCallback(() => {
    if (pollTimer.current) window.clearInterval(pollTimer.current);
    pollTimer.current = null;
  }, []);

  const startPolling = useCallback(
    (jobId: string) => {
      stopPolling();
      pollTimer.current = window.setInterval(async () => {
        try {
          const job = await getGraphJob(jobId);
          setState((s) => ({
            ...s,
            job,
            loading: job.status !== "DONE" && job.status !== "FAILED",
          }));
          if (job.status === "DONE" || job.status === "FAILED") stopPolling();
        } catch (e: any) {
          setState((s) => ({
            ...s,
            error: e?.message ?? "Polling failed",
            loading: false,
          }));
          stopPolling();
        }
      }, 900);
    },
    [stopPolling],
  );

  const submitTranscript = useCallback(
    async (transcript: string) => {
      setState({ loading: true });
      stopPolling();
      try {
        const created = await createGraph(transcript);
        setState({
          loading: created.status !== "DONE" && created.status !== "FAILED",
          job: created,
        });
        startPolling(created.jobId);
      } catch (e: any) {
        setState({
          loading: false,
          error: e?.message ?? "Failed to create job",
        });
      }
    },
    [startPolling, stopPolling],
  );

  useEffect(() => () => stopPolling(), [stopPolling]);

  const tasksById = useMemo(() => {
    const map = new Map<string, Task>();
    state.job?.result?.tasks?.forEach((t) => map.set(t.id, t));
    return map;
  }, [state.job]);

  return { state, submitTranscript, tasksById };
}
