import { motion } from 'framer-motion';

const COLORS = [
  { letter: 'A', base: 'bg-blue-400 border-blue-600 shadow-[0_5px_0_0_#1d4ed8] text-white',    hover: 'hover:bg-blue-300',    badge: 'bg-blue-700',    correct: 'bg-green-400 border-green-600 shadow-[0_4px_0_0_#15803d] text-white scale-[1.03]', wrong: 'bg-red-400 border-red-600 shadow-[0_3px_0_0_#b91c1c] text-white', dim: 'bg-slate-100 border-slate-200 shadow-none text-slate-300 opacity-40 scale-[0.97]' },
  { letter: 'B', base: 'bg-emerald-400 border-emerald-600 shadow-[0_5px_0_0_#065f46] text-white', hover: 'hover:bg-emerald-300', badge: 'bg-emerald-700', correct: 'bg-green-400 border-green-600 shadow-[0_4px_0_0_#15803d] text-white scale-[1.03]', wrong: 'bg-red-400 border-red-600 shadow-[0_3px_0_0_#b91c1c] text-white', dim: 'bg-slate-100 border-slate-200 shadow-none text-slate-300 opacity-40 scale-[0.97]' },
  { letter: 'C', base: 'bg-amber-400 border-amber-600 shadow-[0_5px_0_0_#92400e] text-white',    hover: 'hover:bg-amber-300',    badge: 'bg-amber-700',    correct: 'bg-green-400 border-green-600 shadow-[0_4px_0_0_#15803d] text-white scale-[1.03]', wrong: 'bg-red-400 border-red-600 shadow-[0_3px_0_0_#b91c1c] text-white', dim: 'bg-slate-100 border-slate-200 shadow-none text-slate-300 opacity-40 scale-[0.97]' },
  { letter: 'D', base: 'bg-violet-400 border-violet-600 shadow-[0_5px_0_0_#4c1d95] text-white',  hover: 'hover:bg-violet-300',  badge: 'bg-violet-700',  correct: 'bg-green-400 border-green-600 shadow-[0_4px_0_0_#15803d] text-white scale-[1.03]', wrong: 'bg-red-400 border-red-600 shadow-[0_3px_0_0_#b91c1c] text-white', dim: 'bg-slate-100 border-slate-200 shadow-none text-slate-300 opacity-40 scale-[0.97]' },
];

export default function QuestionCard({ question, options, selectedAnswer, onSelect }) {
  return (
    <motion.div
      key={question}
      initial={{ opacity: 0, scale: 0.88, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.88, y: -20 }}
      transition={{ type: 'spring', bounce: 0.4, duration: 0.5 }}
      className="h-full flex flex-col bg-white/95 backdrop-blur-sm rounded-[2rem] shadow-xl p-4 border-[4px] border-white/70"
    >
      {/* Question text */}
      <div className="flex-shrink-0 text-center mb-3 px-1">
        <h2 className="text-xl md:text-2xl font-black text-slate-800 leading-snug">
          {question}
        </h2>
      </div>

      {/* 2 × 2 answer grid — fills remaining height */}
      <div className="flex-1 min-h-0 grid grid-cols-2 grid-rows-2 gap-2.5 md:gap-3">
        {options.map((option, idx) => {
          const c = COLORS[idx];
          const isSelected = selectedAnswer && selectedAnswer.text === option.text;
          const isWrongSelected = isSelected && !option.isCorrect;

          let cls;
          if (!selectedAnswer) {
            cls = `${c.base} ${c.hover} active:translate-y-[5px] active:shadow-none`;
          } else if (option.isCorrect) {
            cls = c.correct;
          } else if (isWrongSelected) {
            cls = c.wrong;
          } else {
            cls = c.dim;
          }

          return (
            <motion.button
              key={option.text}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.07, type: 'spring', bounce: 0.35 }}
              onClick={() => onSelect(option)}
              disabled={!!selectedAnswer}
              className={`
                relative flex flex-col items-center justify-center
                rounded-[1.25rem] border-[3px] font-black
                transition-all duration-200 ease-out select-none w-full h-full
                ${cls}
              `}
            >
              {/* Letter badge */}
              <div className={`absolute top-2 left-2.5 w-6 h-6 ${c.badge} rounded-full flex items-center justify-center text-white text-xs font-black shadow`}>
                {c.letter}
              </div>

              {/* Emoji */}
              <span className="text-3xl md:text-4xl mb-1 leading-none drop-shadow">
                {option.icon}
              </span>

              {/* Label */}
              <span className="text-sm md:text-base font-black text-center leading-tight px-2">
                {option.text}
              </span>

              {/* Correct tick badge */}
              {selectedAnswer && option.isCorrect && (
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: 'spring', bounce: 0.65, delay: 0.1 }}
                  className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-green-400 text-lg"
                >✅</motion.div>
              )}

              {/* Wrong cross badge */}
              {isWrongSelected && (
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: 'spring', bounce: 0.65, delay: 0.1 }}
                  className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-red-400 text-lg"
                >❌</motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
