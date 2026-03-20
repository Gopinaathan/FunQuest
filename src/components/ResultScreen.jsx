import { motion } from 'framer-motion';

export default function ResultScreen({ score, total, onRestart }) {
  const pct = Math.round((score / total) * 100);
  const stars = pct === 100 ? 3 : pct >= 70 ? 2 : pct >= 40 ? 1 : 0;

  const tiers = {
    perfect: {
      emoji: '🏆', message: 'Perfect Score!',
      gradient: 'from-yellow-400 via-amber-400 to-orange-400',
      btn: 'bg-amber-400 border-amber-600 shadow-[0_7px_0_0_#92400e] hover:bg-amber-300 active:translate-y-[7px] active:shadow-[0_0px_0_0_#92400e] text-white',
    },
    great: {
      emoji: '🌟', message: 'Great Job!',
      gradient: 'from-violet-400 via-fuchsia-400 to-pink-400',
      btn: 'bg-violet-500 border-violet-700 shadow-[0_7px_0_0_#4c1d95] hover:bg-violet-400 active:translate-y-[7px] active:shadow-[0_0px_0_0_#4c1d95] text-white',
    },
    good: {
      emoji: '😊', message: 'Good Try!',
      gradient: 'from-blue-400 via-cyan-400 to-teal-400',
      btn: 'bg-blue-500 border-blue-700 shadow-[0_7px_0_0_#1e3a8a] hover:bg-blue-400 active:translate-y-[7px] active:shadow-[0_0px_0_0_#1e3a8a] text-white',
    },
    keep: {
      emoji: '💪', message: 'Keep Practicing!',
      gradient: 'from-rose-400 via-pink-400 to-fuchsia-400',
      btn: 'bg-rose-500 border-rose-700 shadow-[0_7px_0_0_#9f1239] hover:bg-rose-400 active:translate-y-[7px] active:shadow-[0_0px_0_0_#9f1239] text-white',
    },
  };

  const tier = pct === 100 ? tiers.perfect : pct >= 70 ? tiers.great : pct >= 40 ? tiers.good : tiers.keep;

  // Confetti for passing scores
  const confetti = pct >= 70
    ? Array.from({ length: 50 }).map((_, i) => {
        const colors = ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
        return (
          <motion.div
            key={i}
            initial={{ y: -40, x: `${Math.random() * 100}vw`, opacity: 0, scale: 0, rotate: 0 }}
            animate={{
              y: '100vh',
              opacity: [0, 1, 1, 0],
              scale: [0, 1, 1, 0.3],
              rotate: Math.random() > 0.5 ? 360 : -360,
            }}
            transition={{
              delay: Math.random() * 2.5,
              duration: 2.5 + Math.random() * 3,
              repeat: Infinity,
              ease: 'easeIn',
            }}
            className="absolute z-0 w-3 h-4 rounded-sm pointer-events-none"
            style={{ backgroundColor: colors[i % colors.length] }}
          />
        );
      })
    : null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 w-full relative overflow-hidden">
      {confetti}

      <motion.div
        initial={{ scale: 0.75, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', bounce: 0.55, duration: 0.8 }}
        className="bg-white/95 backdrop-blur-md rounded-[3rem] shadow-2xl max-w-sm w-full text-center relative z-10 overflow-hidden border-[5px] border-white/60"
      >
        {/* Gradient header banner */}
        <div className={`bg-gradient-to-br ${tier.gradient} pt-8 pb-14 px-6 relative`}>
          <motion.div
            animate={{ scale: [1, 1.15, 1], rotate: [0, -5, 5, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="text-[5.5rem] md:text-[7rem] leading-none drop-shadow-2xl"
          >
            {tier.emoji}
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-black text-white drop-shadow-md mt-2">
            {tier.message}
          </h1>
        </div>

        {/* Stars row — overlaps banner */}
        <div className="flex justify-center gap-3 -mt-7 relative z-10 mb-1">
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.4 + i * 0.15, type: 'spring', bounce: 0.65 }}
              className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-2xl md:text-3xl shadow-lg border-[3px] ${
                i < stars
                  ? 'bg-yellow-400 border-yellow-500'
                  : 'bg-slate-100 border-slate-200 opacity-40'
              }`}
            >
              ⭐
            </motion.div>
          ))}
        </div>

        {/* Score section */}
        <div className="px-6 pt-3 pb-7">
          <div className="bg-slate-50 rounded-[2rem] p-5 mb-5 border-[3px] border-slate-100">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Your Score</p>
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-6xl md:text-7xl font-black text-slate-800">{score}</span>
              <span className="text-2xl text-slate-300 font-semibold">/</span>
              <span className="text-3xl font-black text-slate-400">{total}</span>
            </div>
            <p className={`mt-1.5 text-lg font-black bg-gradient-to-r ${tier.gradient} text-transparent bg-clip-text`}>
              {pct}% Correct!
            </p>
          </div>

          <button
            onClick={onRestart}
            className={`w-full py-4 text-xl md:text-2xl font-black rounded-[2rem] border-[4px] transition-all duration-150 ease-out select-none flex items-center justify-center gap-3 ${tier.btn}`}
          >
            <span className="text-2xl">🔄</span> Play Again!
          </button>
        </div>
      </motion.div>
    </div>
  );
}
