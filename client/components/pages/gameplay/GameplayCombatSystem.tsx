"use client";

export default function CombatSystem() {
  const actions = ["Attack", "Focus Light", "Whisper", "Flee"];

  return (
    <div className="text-white">
      <h2 className="text-2xl font-bold mb-4">⚔ 3. Chiến Đấu – Turn-based Text Combat</h2>
      <div className="flex flex-wrap gap-4">
        {actions.map((action) => (
          <button key={action} className="px-4 py-2 bg-amber-700/50 rounded hover:bg-amber-600 transition-all">
            {action}
          </button>
        ))}
      </div>
      {/* Visual: mockup chat battle text */}
    </div>
  );
}
