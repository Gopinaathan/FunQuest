import { motion } from 'framer-motion';

export default function ProgressBar({ current, total }) {
  const progress = (current / total) * 100;

  return (
    <div className="w-full">
      {/* Bar track */}
      <div className="w-full bg-white/60 rounded-full h-5 overflow-hidden border-[3px] border-white/50 shadow-inner relative">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 relative overflow-hidden"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ type: 'spring', stiffness: 50, damping: 14 }}
        >
          {/* Shimmer sweep */}
          <motion.div
            animate={{ x: ['-120%', '220%'] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: 'linear' }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
          />
        </motion.div>
      </div>

      {/* Step dots below the bar */}
      <div className="flex justify-between mt-1.5 px-0.5">
        {Array.from({ length: total }).map((_, i) => (
          <motion.div
            key={i}
            animate={i < current ? { scale: [1, 1.4, 1] } : {}}
            transition={{ duration: 0.3 }}
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              i < current ? 'bg-violet-400' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
