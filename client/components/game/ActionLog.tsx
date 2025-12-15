"use client";

import { useEffect, useRef, useState } from "react";

interface LogEntry {
  id: string;
  message: string;
  type?: "info" | "warning" | "success" | "error";
  timestamp: number;
}

interface ActionLogProps {
  maxEntries?: number;
}

export default function ActionLog({ maxEntries = 5 }: ActionLogProps) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const logEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // Expose function để thêm log từ bên ngoài
  useEffect(() => {
    // Tạo custom event để thêm log
    const handleAddLog = (event: CustomEvent<Omit<LogEntry, "id" | "timestamp">>) => {
      const newLog: LogEntry = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        ...event.detail,
      };
      setLogs((prev) => {
        const updated = [...prev, newLog];
        return updated.slice(-maxEntries);
      });
    };

    window.addEventListener("addGameLog" as any, handleAddLog as EventListener);
    return () => {
      window.removeEventListener("addGameLog" as any, handleAddLog as EventListener);
    };
  }, [maxEntries]);

  // Initial log
  useEffect(() => {
    const initialLog: LogEntry = {
      id: "initial",
      message: "Bạn vừa bước vào một căn phòng lạnh lẽo...",
      type: "info",
      timestamp: Date.now(),
    };
    setLogs([initialLog]);
  }, []);

  const getLogColor = (type?: string) => {
    switch (type) {
      case "warning":
        return "text-yellow-400";
      case "success":
        return "text-green-400";
      case "error":
        return "text-red-400";
      default:
        return "text-zinc-300";
    }
  };

  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 pointer-events-auto z-30 w-full max-w-2xl px-4">
      <div className="bg-black/70 backdrop-blur-sm border-2 border-amber-600 p-3 rounded-lg shadow-lg font-pixel text-sm max-h-32 overflow-y-auto">
        <div className="space-y-1">
          {logs.map((log) => (
            <div
              key={log.id}
              className={`${getLogColor(log.type)} animate-fade-in`}
            >
              &gt; {log.message}
            </div>
          ))}
          <div ref={logEndRef} />
        </div>
      </div>
    </div>
  );
}

// Helper function để thêm log từ bất kỳ đâu
export function addGameLog(
  message: string,
  type?: "info" | "warning" | "success" | "error"
) {
  const event = new CustomEvent("addGameLog", {
    detail: { message, type },
  });
  window.dispatchEvent(event);
}

