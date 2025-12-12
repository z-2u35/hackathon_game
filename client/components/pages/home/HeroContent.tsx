"use client";

import HomeActionButton from "./HomeActionButton";

export default function HeroContent() {
  return (
    <div className="z-10 text-center flex flex-col items-center gap-6 w-full px-4 py-12">
      <h1
        className="relative text-5xl md:text-9xl font-pixel font-bold mb-2 tracking-tighter text-transparent
          bg-clip-text bg-linear-to-b from-amber-300 to-amber-700
          animate-flicker animate-jitter animate-gradient-ghost"
      >
        ASTEROS
        {/* Glitch đỏ */}
        <span className="absolute top-0 left-0 text-red-400 opacity-70 animate-glitch1
          border-2 border-red-600 shadow-[0_0_10px_rgba(255,0,0,0.8)]">
          ASTEROS
        </span>
        {/* Glitch xanh dương */}
        <span className="absolute top-0 left-0 text-blue-400 opacity-70 animate-glitch2
          border-2 border-blue-600 shadow-[0_0_10px_rgba(0,0,255,0.8)]">
          ASTEROS
        </span>
        {/* Glitch tím */}
        <span className="absolute top-0 left-0 text-purple-400 opacity-70 animate-glitch3
          border-2 border-purple-600 shadow-[0_0_10px_rgba(128,0,128,0.8)]">
          ASTEROS
        </span>
        {/* Glitch xám-đen */}
        <span className="absolute top-0 left-0 text-gray-800 opacity-80 animate-glitch4
          border-2 border-gray-900 shadow-[0_0_15px_rgba(0,0,0,0.9)]">
          ASTEROS
        </span>
      </h1>
      <HomeActionButton />

      <style jsx>{`
        /* Flicker kiểu TV pixel kinh dị */
        @keyframes flicker {
          0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% { opacity: 1; }
          20%, 22%, 24%, 55% { opacity: 0.3; }
        }
        .animate-flicker { animation: flicker 1.5s infinite; }

        /* Jitter rung mạnh kiểu ma quái */
        @keyframes jitter {
          0%,100% { transform: translate(0,0); }
          10% { transform: translate(-2px,1px); }
          20% { transform: translate(1px,-2px); }
          30% { transform: translate(-3px,2px); }
          40% { transform: translate(2px,-1px); }
          50% { transform: translate(-1px,2px); }
          60% { transform: translate(1px,-2px); }
          70% { transform: translate(-2px,1px); }
          80% { transform: translate(2px,-1px); }
          90% { transform: translate(-1px,1px); }
        }
        .animate-jitter { animation: jitter 0.8s infinite; }

        /* Gradient nhấp nháy màu vàng-cam-đỏ kinh dị */
        @keyframes gradient-ghost {
       0%   { background-image: linear-gradient(to bottom, #ff9f00, #ff6f00); } /* retro cam */
  10%  { background-image: linear-gradient(to bottom, #ff5722, #ff1744); } /* đỏ hồng */
  20%  { background-image: linear-gradient(to bottom, #ff6f00, #ffc107); } /* cam vàng */
  30%  { background-image: linear-gradient(to bottom, #ffd600, #ffea00); } /* vàng sáng */
  40%  { background-image: linear-gradient(to bottom, #ff5722, #e91e63); } /* đỏ hồng tối */
  50%  { background-image: linear-gradient(to bottom, #ffeb3b, #ff3d00); } /* vàng → đỏ cam */
  60%  { background-image: linear-gradient(to bottom, #ffc107, #ff6f00); } /* vàng cam retro */
  70%  { background-image: linear-gradient(to bottom, #9e9e9e, #616161); } /* xám sáng → xám đậm */
  80%  { background-image: linear-gradient(to bottom, #757575, #424242); } /* xám trung → xám tối */
  90%  { background-image: linear-gradient(to bottom, #b0bec5, #90a4ae); } /* xám lạnh */
  100% { background-image: linear-gradient(to bottom, #9e9e9e, #616161); } /* xám retro */
        }
        .animate-gradient-ghost {
          animation: gradient-ghost 3s infinite;
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
        }

        /* Các keyframes glitch */
        @keyframes glitch1 {
          0% { transform: translate(0); clip-path: inset(0 0 0 0); }
          20% { transform: translate(-3px,-3px); clip-path: inset(10% 0 85% 0); }
          40% { transform: translate(3px,3px); clip-path: inset(85% 0 10% 0); }
          60% { transform: translate(-2px,2px); clip-path: inset(50% 0 45% 0); }
          80% { transform: translate(2px,-2px); clip-path: inset(45% 0 50% 0); }
          100% { transform: translate(0); clip-path: inset(0 0 0 0); }
        }
        @keyframes glitch2 {
          0% { transform: translate(0); clip-path: inset(0 0 0 0); }
          20% { transform: translate(2px,2px); clip-path: inset(15% 0 70% 0); }
          40% { transform: translate(-2px,-2px); clip-path: inset(70% 0 15% 0); }
          60% { transform: translate(1px,-1px); clip-path: inset(45% 0 50% 0); }
          80% { transform: translate(-1px,1px); clip-path: inset(50% 0 45% 0); }
          100% { transform: translate(0); clip-path: inset(0 0 0 0); }
        }
        @keyframes glitch3 {
          0% { transform: translate(0); clip-path: inset(0 0 0 0); }
          20% { transform: translate(-1px,2px); clip-path: inset(20% 0 65% 0); }
          40% { transform: translate(1px,-2px); clip-path: inset(65% 0 20% 0); }
          60% { transform: translate(2px,1px); clip-path: inset(40% 0 55% 0); }
          80% { transform: translate(-2px,-1px); clip-path: inset(55% 0 40% 0); }
          100% { transform: translate(0); clip-path: inset(0 0 0 0); }
        }
        @keyframes glitch4 {
          0% { transform: translate(0); clip-path: inset(0 0 0 0); }
          20% { transform: translate(3px,-2px); clip-path: inset(10% 0 80% 0); }
          40% { transform: translate(-3px,2px); clip-path: inset(80% 0 10% 0); }
          60% { transform: translate(2px,-1px); clip-path: inset(50% 0 45% 0); }
          80% { transform: translate(-2px,1px); clip-path: inset(45% 0 50% 0); }
          100% { transform: translate(0); clip-path: inset(0 0 0 0); }
        }

        /* Apply glitch animations */
        .animate-glitch1 { animation: glitch1 2s infinite; position: absolute; top:0; left:0; }
        .animate-glitch2 { animation: glitch2 2.2s infinite; position: absolute; top:0; left:0; }
        .animate-glitch3 { animation: glitch3 2.5s infinite; position: absolute; top:0; left:0; }
        .animate-glitch4 { animation: glitch4 2.3s infinite; position: absolute; top:0; left:0; }
      `}</style>
    </div>
  );
}
