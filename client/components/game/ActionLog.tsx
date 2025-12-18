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
  playerPosition?: { x: number; y: number };
}

export default function ActionLog({ maxEntries = 5, playerPosition }: ActionLogProps) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [positionHistory, setPositionHistory] = useState<Array<{ x: number; y: number }>>([]);
  const logEndRef = useRef<HTMLDivElement>(null);
  const logCounterRef = useRef<number>(0); // Counter để đảm bảo key unique

  // Auto scroll to bottom
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // Expose function để thêm log từ bên ngoài
  useEffect(() => {
    // Tạo custom event để thêm log
    const handleAddLog = (event: CustomEvent<Omit<LogEntry, "id" | "timestamp">>) => {
      logCounterRef.current += 1; // Tăng counter mỗi lần có log mới
      const timestamp = Date.now();
      const newLog: LogEntry = {
        id: `${timestamp}-${logCounterRef.current}`, // Kết hợp timestamp và counter để đảm bảo unique
        timestamp: timestamp,
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

  // Track position changes
  useEffect(() => {
    if (playerPosition) {
      setPositionHistory((prev) => {
        const newHistory = [...prev, playerPosition];
        // Keep last 5 positions
        return newHistory.slice(-5);
      });
    }
  }, [playerPosition]);

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
    <div className="bg-black/85 border-2 border-zinc-600 p-3 shadow-2xl font-pixel min-w-[260px] max-w-[300px] backdrop-blur-sm">
      {/* Header */}
      <div className="border-b-2 border-zinc-700 pb-2 mb-2">
        <h3 className="text-amber-400 text-xs font-pixel uppercase">Nhật ký</h3>
      </div>

      {/* Game Events Log */}
      <div className="mb-3">
        <div className="text-[10px] text-zinc-500 font-pixel mb-1">Sự kiện:</div>
        <div className="bg-black/60 border border-zinc-700 p-2 h-20 overflow-y-auto space-y-1">
          {logs.map((log, i) => (
            <div
              key={log.id}
              className={`text-[10px] ${getLogColor(log.type)} font-pixel leading-tight`}
              style={{ opacity: 1 - i * 0.2 }}
              dangerouslySetInnerHTML={{ __html: `&gt; ${log.message}` }}
            />
          ))}
          <div ref={logEndRef} />
        </div>
      </div>

      {/* Position History */}
      {positionHistory.length > 0 && (
        <div>
          <div className="text-[10px] text-zinc-500 font-pixel mb-1">Vị trí:</div>
          <div className="bg-black/60 border border-zinc-700 p-2 space-y-0.5">
            {positionHistory.slice().reverse().map((pos, i) => (
              <div
                key={i}
                className="text-[10px] text-zinc-300 font-mono"
                style={{ opacity: 1 - i * 0.15 }}
              >
                &gt; Vị trí: ({pos.x}, {pos.y})
              </div>
            ))}
          </div>
        </div>
      )}
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

