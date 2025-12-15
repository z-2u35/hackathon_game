"use client";

import { useState, useRef, useEffect } from "react";
import { addGameLog } from "./ActionLog";

interface ActionConsoleProps {
  onMove?: () => void;
  onRest?: () => void;
  onSearch?: () => void;
  onAttack?: () => void;
  onFocusLight?: () => void;
  onWhisper?: () => void;
  canMove?: boolean;
  oil?: number;
  sanity?: number;
}

interface LogEntry {
  id: string;
  message: string;
  timestamp: number;
}

export default function ActionConsole({
  onMove,
  onRest,
  onSearch,
  onAttack,
  onFocusLight,
  onWhisper,
  canMove = true,
  oil = 100,
  sanity = 100,
}: ActionConsoleProps) {
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: "init", message: "Bạn nghe thấy tiếng thì thầm...", timestamp: Date.now() },
  ]);
  const logEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // Listen to global log events
  useEffect(() => {
    const handleAddLog = (event: CustomEvent<{ message: string; type?: string }>) => {
      const newLog: LogEntry = {
        id: Date.now().toString(),
        message: event.detail.message,
        timestamp: Date.now(),
      };
      setLogs((prev) => [...prev, newLog].slice(-10)); // Keep last 10 logs
    };

    window.addEventListener("addGameLog" as any, handleAddLog as EventListener);
    return () => {
      window.removeEventListener("addGameLog" as any, handleAddLog as EventListener);
    };
  }, []);

  const handleAction = (action: string, callback?: () => void) => {
    if (callback) {
      callback();
    }
    const actionLog: LogEntry = {
      id: Date.now().toString(),
      message: `> ${action}`,
      timestamp: Date.now(),
    };
    setLogs((prev) => [...prev, actionLog].slice(-10));
  };

  return (
    <div className="absolute bottom-4 right-4 pointer-events-auto z-30">
      <div className="bg-black/90 border-4 border-zinc-600 p-3 shadow-2xl font-pixel min-w-[320px] max-w-[400px]">
        {/* Header */}
        <div className="border-b-2 border-zinc-700 pb-2 mb-3">
          <h3 className="text-amber-400 text-sm font-pixel uppercase">Bảng Điều Khiển</h3>
        </div>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {/* Move */}
          <button
            onClick={() => handleAction("Di chuyển", onMove)}
            disabled={!canMove}
            className="bg-zinc-800 hover:bg-zinc-700 border-2 border-zinc-600 hover:border-amber-500 disabled:opacity-50 disabled:cursor-not-allowed py-2 px-3 text-xs font-pixel transition-all active:scale-95"
          >
            👣 Di chuyển
          </button>

          {/* Rest */}
          <button
            onClick={() => handleAction("Nghỉ ngơi", onRest)}
            className="bg-zinc-800 hover:bg-zinc-700 border-2 border-zinc-600 hover:border-green-500 py-2 px-3 text-xs font-pixel transition-all active:scale-95"
          >
            😴 Nghỉ ngơi
          </button>

          {/* Search */}
          <button
            onClick={() => handleAction("Tìm kiếm", onSearch)}
            className="bg-zinc-800 hover:bg-zinc-700 border-2 border-zinc-600 hover:border-blue-500 py-2 px-3 text-xs font-pixel transition-all active:scale-95"
          >
            🔍 Tìm kiếm
          </button>

          {/* Attack */}
          {onAttack && (
            <button
              onClick={() => handleAction("Tấn công", onAttack)}
              className="bg-red-900 hover:bg-red-800 border-2 border-red-600 hover:border-red-400 py-2 px-3 text-xs font-pixel transition-all active:scale-95"
            >
              ⚔️ Tấn công
            </button>
          )}
        </div>

        {/* Special Actions */}
        {(onFocusLight || onWhisper) && (
          <div className="grid grid-cols-2 gap-2 mb-3">
            {onFocusLight && (
              <button
                onClick={() => handleAction("Làm choáng", onFocusLight)}
                disabled={oil < 10}
                className="bg-amber-900 hover:bg-amber-800 border-2 border-amber-600 hover:border-amber-400 disabled:opacity-50 disabled:cursor-not-allowed py-2 px-3 text-xs font-pixel transition-all active:scale-95"
              >
                💡 Làm choáng
              </button>
            )}
            {onWhisper && (
              <button
                onClick={() => handleAction("Dùng Memory Shard", onWhisper)}
                disabled={sanity < 20}
                className="bg-purple-900 hover:bg-purple-800 border-2 border-purple-600 hover:border-purple-400 disabled:opacity-50 disabled:cursor-not-allowed py-2 px-3 text-xs font-pixel transition-all active:scale-95"
              >
                💬 Memory Shard
              </button>
            )}
          </div>
        )}

        {/* Log Window */}
        <div className="bg-black/60 border-2 border-zinc-700 p-2 h-24 overflow-y-auto">
          <div className="space-y-0.5">
            {logs.map((log) => (
              <div
                key={log.id}
                className="text-[10px] text-zinc-300 font-pixel leading-tight"
                dangerouslySetInnerHTML={{ __html: log.message }}
              />
            ))}
            <div ref={logEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
}

