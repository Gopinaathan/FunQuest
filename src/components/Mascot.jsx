import { motion, AnimatePresence } from 'framer-motion';

const STATES = {
  waiting: {
    emoji: '🤖',
    message: 'Pick your answer!',
    msgCls: 'text-violet-700 bg-violet-50 border-violet-200',
    anim: { y: [0, -6, 0], rotate: [-2, 2, -2], transition: { repeat: Infinity, duration: 2.5, ease: 'easeInOut' } },
  },
  correct: {
    emoji: '🌟',
    message: 'Amazing! You got it! 🎉',
    msgCls: 'text-green-800 bg-green-50 border-green-300',
    anim: { scale: [1, 1.3, 0.9, 1.15, 1], rotate: [0, -15, 15, -10, 0], y: [0, -18, 0], transition: { duration: 0.7 } },
  },
  incorrect: {
    emoji: '😅',
    message: 'Oops! Keep trying! 💪',
    msgCls: 'text-red-700 bg-red-50 border-red-200',
    anim: { x: [0, -10, 10, -7, 7, 0], scale: [1, 0.9, 1], transition: { duration: 0.55 } },
  },
};

export default function Mascot({ feedback }) {
  const key = feedback === 'correct' ? 'correct' : feedback === 'incorrect' ? 'incorrect' : 'waiting';
  const { emoji, message, msgCls, anim } = STATES[key];

  return (
    <div className="flex items-center justify-center gap-3 w-full py-1">
      {/* Emoji */}
      <motion.div key={key} animate={anim} className="text-[2.8rem] leading-none drop-shadow-xl flex-shrink-0">
        {emoji}
      </motion.div>

      {/* Speech bubble */}
      <AnimatePresence mode="wait">
        <motion.div
          key={message}
          initial={{ opacity: 0, x: -10, scale: 0.85 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 10, scale: 0.85 }}
          transition={{ type: 'spring', bounce: 0.45 }}
          className={`px-4 py-1.5 rounded-2xl border-[2px] text-sm font-black tracking-wide shadow-sm ${msgCls}`}
        >
          {message}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
