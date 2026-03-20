import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { questions as allQuestions } from './data/questions';

import ProgressBar from './components/ProgressBar';
import QuestionCard from './components/QuestionCard';
import Mascot from './components/Mascot';
import ResultScreen from './components/ResultScreen';
import { playSound } from './utils/sound';

// Circular countdown timer
function CircularTimer({ timeLeft, maxTime = 15, answered }) {
  const size = 60;
  const radius = 23;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - timeLeft / maxTime);

  if (answered) {
    return (
      <div
        className="flex items-center justify-center rounded-full bg-green-100 text-2xl"
        style={{ width: size, height: size }}
      >
        ✅
      </div>
    );
  }

  const strokeColor = timeLeft <= 5 ? '#ef4444' : timeLeft <= 8 ? '#f97316' : '#22c55e';
  const bgFill = timeLeft <= 5 ? '#fee2e2' : timeLeft <= 8 ? '#ffedd5' : '#dcfce7';
  const textColor = timeLeft <= 5 ? 'text-red-500' : timeLeft <= 8 ? 'text-orange-500' : 'text-green-600';

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="-rotate-90" width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e2e8f0" strokeWidth="5" />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={strokeColor} strokeWidth="5" strokeLinecap="round"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.9, ease: 'linear' }}
        />
      </svg>
      <div
        className={`absolute inset-[5px] flex items-center justify-center rounded-full font-black text-base ${textColor}`}
        style={{ backgroundColor: bgFill }}
      >
        {timeLeft}
      </div>
    </div>
  );
}

const DIFFICULTY = {
  easy:   { icon: '🌈', label: 'Easy',   desc: 'Perfect for beginners!', btn: 'bg-emerald-400 border-emerald-600 shadow-[0_7px_0_0_#065f46] hover:bg-emerald-300 active:translate-y-[7px] active:shadow-[0_0px_0_0_#065f46] text-white' },
  medium: { icon: '⚡', label: 'Medium', desc: 'A fun challenge!',        btn: 'bg-amber-400 border-amber-600 shadow-[0_7px_0_0_#92400e] hover:bg-amber-300 active:translate-y-[7px] active:shadow-[0_0px_0_0_#92400e] text-amber-900' },
  hard:   { icon: '🔥', label: 'Hard',   desc: 'Are you a genius?!',      btn: 'bg-rose-400 border-rose-600 shadow-[0_7px_0_0_#9f1239] hover:bg-rose-300 active:translate-y-[7px] active:shadow-[0_0px_0_0_#9f1239] text-white' },
};

function App() {
  const [gameState, setGameState] = useState('start');
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});   // { [questionIndex]: option }
  const [timeLeft, setTimeLeft] = useState(15);

  // ── Derived state ──────────────────────────────────────────
  const selectedAnswer = answers[currentIndex] ?? null;
  const feedback = selectedAnswer ? (selectedAnswer.isCorrect ? 'correct' : 'incorrect') : null;
  const score = Object.values(answers).filter(a => a?.isCorrect).length;
  const isLastQuestion = questions.length > 0 && currentIndex === questions.length - 1;

  // ── Actions ────────────────────────────────────────────────
  const startGame = (diff) => {
    playSound('click');
    const filtered = allQuestions.filter(q => q.difficulty === diff);
    setQuestions(filtered.length > 0 ? filtered : allQuestions);
    setCurrentIndex(0);
    setAnswers({});
    setTimeLeft(15);
    setGameState('playing');
  };

  const handleAnswerSelect = (option) => {
    if (answers[currentIndex]) return;
    setAnswers(prev => ({ ...prev, [currentIndex]: option }));
    playSound(option.isCorrect ? 'correct' : 'incorrect');
  };

  const goPrev = () => {
    if (currentIndex === 0) return;
    playSound('click');
    setCurrentIndex(i => i - 1);
  };

  const goNext = () => {
    if (!selectedAnswer) return;
    playSound('click');
    if (isLastQuestion) {
      setGameState('result');
    } else {
      setCurrentIndex(i => i + 1);
    }
  };

  // Reset timer when navigating to an unanswered question
  useEffect(() => {
    if (gameState === 'playing' && !answers[currentIndex]) {
      setTimeLeft(15);
    }
  }, [currentIndex, gameState]);

  // Timer countdown
  useEffect(() => {
    if (gameState !== 'playing' || answers[currentIndex]) return;
    if (timeLeft > 0) {
      const id = setTimeout(() => setTimeLeft(t => t - 1), 1000);
      return () => clearTimeout(id);
    } else {
      // Time's up → auto-mark wrong
      setAnswers(prev => ({ ...prev, [currentIndex]: { text: '__timeout__', isCorrect: false } }));
      playSound('incorrect');
    }
  }, [gameState, timeLeft, answers, currentIndex]);

  /* ── START SCREEN ─────────────────────────────────────────── */
  if (gameState === 'start') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden relative w-full">
        {[
          { el: '☁️', cls: 'top-8 left-4 md:top-16 md:left-12 text-5xl md:text-7xl', y: [0, -22, 0], dur: 4 },
          { el: '☁️', cls: 'bottom-16 right-4 md:right-12 text-6xl md:text-8xl', y: [0, 28, 0], dur: 6 },
          { el: '🌸', cls: 'top-1/3 left-2 md:left-8 text-3xl md:text-5xl', y: [0, -14, 0], dur: 3.5 },
          { el: '🎈', cls: 'top-1/4 right-2 md:right-8 text-3xl md:text-5xl', y: [0, 14, 0], dur: 3 },
        ].map((d, i) => (
          <motion.div key={i} animate={{ y: d.y }} transition={{ repeat: Infinity, duration: d.dur, ease: 'easeInOut' }}
            className={`absolute pointer-events-none opacity-50 ${d.cls}`}>{d.el}</motion.div>
        ))}
        <motion.div animate={{ scale: [1, 1.25, 1], rotate: [0, 180, 360] }} transition={{ repeat: Infinity, duration: 7, ease: 'linear' }}
          className="absolute top-28 right-8 md:right-28 text-4xl md:text-5xl opacity-40 pointer-events-none">✨</motion.div>
        <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, -180, -360] }} transition={{ repeat: Infinity, duration: 9, ease: 'linear' }}
          className="absolute bottom-28 left-8 md:left-28 text-3xl md:text-4xl opacity-40 pointer-events-none">⭐</motion.div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 60 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: 'spring', bounce: 0.5, duration: 0.9 }}
          className="bg-white/95 backdrop-blur-md p-7 md:p-10 rounded-[3rem] shadow-2xl max-w-md w-full text-center border-[5px] border-white/60 relative z-10"
        >
          <motion.div animate={{ y: [0, -18, 0], rotate: [-3, 3, -3] }} transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
            className="text-[6.5rem] md:text-[8rem] leading-none mb-1 drop-shadow-2xl">🚀</motion.div>
          <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-500 via-fuchsia-500 to-orange-500 mb-1 tracking-tight">Fun Quest!</h1>
          <p className="text-base text-slate-400 font-bold uppercase tracking-widest mb-7">Choose your level ✨</p>

          <div className="space-y-4 relative z-10">
            {['easy', 'medium', 'hard'].map((level, i) => {
              const cfg = DIFFICULTY[level];
              return (
                <motion.button key={level} initial={{ opacity: 0, x: -60 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.12, type: 'spring', bounce: 0.5 }}
                  onClick={() => startGame(level)}
                  className={`w-full py-4 px-5 text-xl md:text-2xl font-black rounded-[2rem] capitalize transition-all duration-150 ease-out border-[4px] select-none flex items-center justify-between ${cfg.btn}`}
                >
                  <span className="flex items-center gap-3">
                    <span className="text-3xl md:text-4xl bg-white/20 rounded-2xl p-2 leading-none">{cfg.icon}</span>
                    <span className="flex flex-col items-start">
                      <span className="text-xl md:text-2xl font-black leading-tight">{cfg.label}</span>
                      <span className="text-xs md:text-sm font-semibold opacity-80 normal-case">{cfg.desc}</span>
                    </span>
                  </span>
                  <span className="text-2xl opacity-70 mr-1">→</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </div>
    );
  }

  /* ── RESULT SCREEN ────────────────────────────────────────── */
  if (gameState === 'result') {
    return (
      <ResultScreen
        score={score}
        total={questions.length}
        onRestart={() => { playSound('click'); setGameState('start'); }}
      />
    );
  }

  /* ── GAME SCREEN (fits viewport, no scroll) ──────────────── */
  const currentQuestion = questions[currentIndex];

  return (
    <div className="h-screen overflow-hidden flex flex-col relative">
      {/* Subtle background decorations */}
      <motion.div animate={{ y: [0, -18, 0] }} transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
        className="absolute top-6 left-2 text-4xl opacity-20 pointer-events-none select-none">☁️</motion.div>
      <motion.div animate={{ y: [0, 20, 0] }} transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut' }}
        className="absolute bottom-10 right-2 text-5xl opacity-20 pointer-events-none select-none">☁️</motion.div>

      {/* ── Main content column ── */}
      <div className="flex-1 flex flex-col w-full max-w-xl mx-auto px-3 pt-3 pb-3 min-h-0 relative z-10">

        {/* Header: Score | Q counter | Timer */}
        <div className="flex items-center justify-between gap-2 flex-shrink-0 mb-2">
          <motion.div key={score} initial={{ scale: 0.7 }} animate={{ scale: [0.7, 1.2, 1] }} transition={{ duration: 0.35 }}
            className="flex items-center gap-1.5 bg-white/90 rounded-2xl px-3 py-1.5 shadow-md border-[3px] border-white/60">
            <span className="text-xl leading-none">⭐</span>
            <span className="font-black text-lg text-violet-600">{score}</span>
          </motion.div>

          <div className="bg-white/90 rounded-2xl px-4 py-1.5 shadow-md border-[3px] border-white/60">
            <span className="font-black text-base text-slate-600">
              <span className="text-violet-500">{currentIndex + 1}</span>
              <span className="text-slate-300 mx-1 font-semibold">/</span>
              <span>{questions.length}</span>
            </span>
          </div>

          <div className="bg-white/90 rounded-2xl p-1.5 shadow-md border-[3px] border-white/60">
            <CircularTimer timeLeft={timeLeft} answered={!!selectedAnswer} />
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex-shrink-0 mb-2">
          <ProgressBar current={currentIndex + 1} total={questions.length} />
        </div>

        {/* Mascot */}
        <div className="flex-shrink-0">
          <Mascot feedback={feedback} />
        </div>

        {/* Question card — fills all remaining height */}
        <div className="flex-1 min-h-0 mt-2">
          <QuestionCard
            question={currentQuestion.question}
            options={currentQuestion.options}
            selectedAnswer={selectedAnswer}
            onSelect={handleAnswerSelect}
          />
        </div>

        {/* ── Navigation: Home | Previous | Next ── */}
        <div className="flex gap-3 mt-2 flex-shrink-0">
          {/* Home button — icon only */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => { playSound('click'); setGameState('start'); }}
            className="w-12 py-3 bg-white/90 border-[3px] border-white shadow-md rounded-[1.5rem] flex items-center justify-center text-xl text-slate-600 hover:bg-white transition-colors flex-shrink-0"
            title="Back to Menu"
          >
            🏠
          </motion.button>

          {/* Previous button */}
          <motion.button
            whileTap={currentIndex > 0 ? { scale: 0.95 } : {}}
            onClick={goPrev}
            disabled={currentIndex === 0}
            className={`flex-1 py-3 text-base font-black rounded-[1.5rem] border-[3px] transition-all duration-150 ease-out select-none flex items-center justify-center gap-2
              ${currentIndex === 0
                ? 'bg-white/30 border-white/20 text-slate-300 cursor-not-allowed'
                : 'bg-white/90 border-white shadow-md text-slate-600 hover:bg-white active:scale-95'
              }`}
          >
            <span>←</span> Previous
          </motion.button>

          {/* Next / See Results button */}
          <motion.button
            whileTap={selectedAnswer ? { scale: 0.95 } : {}}
            onClick={goNext}
            disabled={!selectedAnswer}
            className={`flex-1 py-3 text-base font-black rounded-[1.5rem] border-[3px] transition-all duration-150 ease-out select-none flex items-center justify-center gap-2
              ${!selectedAnswer
                ? 'bg-violet-200/50 border-violet-200 text-violet-300 cursor-not-allowed'
                : isLastQuestion
                  ? 'bg-amber-400 border-amber-600 shadow-[0_5px_0_0_#92400e] text-white hover:bg-amber-300 active:translate-y-[5px] active:shadow-none'
                  : 'bg-violet-500 border-violet-700 shadow-[0_5px_0_0_#4c1d95] text-white hover:bg-violet-400 active:translate-y-[5px] active:shadow-none'
              }`}
          >
            {isLastQuestion
              ? <><span>Results</span><span>🏆</span></>
              : <><span>Next</span><span>→</span></>
            }
          </motion.button>
        </div>

      </div>
    </div>
  );
}

export default App;
