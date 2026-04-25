import { useEffect, useState } from 'react';

const colors = {
  bg: '#0A0A0B',
  cardBg: 'rgba(20, 18, 16, 0.4)',
  warm: '#FFA85C',
  coral: '#FF6B5A',
  gold: '#D4A574',
  text: '#F5F0EB',
  muted: '#8A7F76',
  accent: '#FF8C42'
};

// Soft ambient background
const AmbientBg = () => {
  const [t, setT] = useState(0);

  useEffect(() => {
    const i = setInterval(() => setT((p) => p + 0.008), 40);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(255, 140, 66, 0.08) 0%, rgba(255, 107, 90, 0.04) 50%, transparent 70%)',
          top: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          filter: 'blur(100px)',
          opacity: 0.6 + Math.sin(t) * 0.2
        }}
      />
    </div>
  );
};

// Exact ORIENTIR symbol from reference
const OrientirSymbol = ({ size = 120 }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120">
      <defs>
        <linearGradient id="symbolGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={colors.warm} stopOpacity="0.95" />
          <stop offset="50%" stopColor={colors.coral} stopOpacity="0.9" />
          <stop offset="100%" stopColor={colors.gold} stopOpacity="0.85" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="1" />
        </filter>
      </defs>

      {/* Outer circle */}
      <circle cx="60" cy="60" r="45" fill="none" stroke="url(#symbolGrad)" strokeWidth="1.5" opacity="0.9" />

      {/* Four cardinal points */}
      <circle cx="60" cy="15" r="3.5" fill={colors.warm} opacity="0.95" />
      <circle cx="60" cy="105" r="3.5" fill={colors.coral} opacity="0.95" />
      <circle cx="15" cy="60" r="3.5" fill={colors.gold} opacity="0.95" />
      <circle cx="105" cy="60" r="3.5" fill={colors.warm} opacity="0.95" />

      {/* Horizontal line */}
      <line x1="15" y1="60" x2="105" y2="60" stroke="url(#symbolGrad)" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />

      {/* Vertical line - full */}
      <line x1="60" y1="15" x2="60" y2="105" stroke="url(#symbolGrad)" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />

      {/* Diamond shape at top */}
      <path
        d="M 60 28 L 70 38 L 60 48 L 50 38 Z"
        fill="none"
        stroke="url(#symbolGrad)"
        strokeWidth="1.5"
        strokeLinejoin="miter"
        opacity="0.9"
      />

      {/* Two lower diagonal lines */}
      <line x1="60" y1="60" x2="45" y2="85" stroke="url(#symbolGrad)" strokeWidth="1.5" strokeLinecap="round" opacity="0.85" />
      <line x1="60" y1="60" x2="75" y2="85" stroke="url(#symbolGrad)" strokeWidth="1.5" strokeLinecap="round" opacity="0.85" />
    </svg>
  );
};

// Glass card
const Card = ({ children, className = '' }) => (
  <div
    className={`rounded-3xl p-6 ${className}`}
    style={{
      background: colors.cardBg,
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.06)'
    }}
  >
    {children}
  </div>
);

// Questions
const questions = {
  logic: [
    { q: 'Насколько ясно вы понимаете свои текущие цели?', id: 'l1' },
    { q: 'Как легко вам выстраивать последовательность действий?', id: 'l2' },
    { q: 'Насколько чётко вы видите причинно-следственные связи?', id: 'l3' }
  ],
  empathy: [
    { q: 'Насколько вы чувствуете эмоции окружающих?', id: 'e1' },
    { q: 'Как легко вам выражать свои чувства?', id: 'e2' },
    { q: 'Насколько вы в контакте со своим внутренним состоянием?', id: 'e3' }
  ],
  adapt: [
    { q: 'Как легко вы принимаете неожиданные изменения?', id: 'a1' },
    { q: 'Насколько гибко вы переключаетесь между задачами?', id: 'a2' },
    { q: 'Как комфортно вам в неопределённости?', id: 'a3' }
  ],
  meaning: [
    { q: 'Насколько вы чувствуете смысл в том, что делаете?', id: 'm1' },
    { q: 'Как сильна ваша связь с внутренними ценностями?', id: 'm2' },
    { q: 'Насколько ваши действия соответствуют вашей миссии?', id: 'm3' }
  ]
};

export default function App() {
  const [screen, setScreen] = useState('home');
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);

  const allQuestions = [...questions.logic, ...questions.empathy, ...questions.adapt, ...questions.meaning];

  const handleAnswer = (val) => {
    const q = allQuestions[currentQ];
    const newAnswers = { ...answers, [q.id]: val };
    setAnswers(newAnswers);

    if (currentQ < allQuestions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      const calc = (ids) => {
        const vals = ids.map((id) => newAnswers[id] || 3);
        return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 20);
      };

      const logic = calc(['l1', 'l2', 'l3']);
      const empathy = calc(['e1', 'e2', 'e3']);
      const adapt = calc(['a1', 'a2', 'a3']);
      const meaning = calc(['m1', 'm2', 'm3']);
      const cq = Math.round((logic + empathy + adapt + meaning) / 4);

      setResults({ logic, empathy, adapt, meaning, cq });
      setScreen('results');
    }
  };

  const restart = () => {
    setScreen('home');
    setCurrentQ(0);
    setAnswers({});
    setResults(null);
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: colors.bg, color: colors.text }}>
      <AmbientBg />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-white/5">
          <div className="flex items-center gap-3 cursor-pointer" onClick={restart}>
            <OrientirSymbol size={36} />
            <div>
              <h1 className="text-sm tracking-[0.25em] font-light">ORIENTIR</h1>
              <p className="text-[9px] opacity-30 -mt-0.5">inner navigation</p>
            </div>
          </div>
        </div>

        {/* Home */}
        {screen === 'home' && (
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center pb-16">
            <OrientirSymbol size={180} />

            <h2 className="text-2xl font-light tracking-[0.2em] mt-10 mb-3" style={{ color: colors.warm }}>
              ORIENTIR
            </h2>
            <p className="text-xs tracking-[0.3em] opacity-30 mb-8">INNER NAVIGATION QUICK TEST</p>

            <p className="text-sm leading-relaxed max-w-sm opacity-70 mb-12">
              Измерьте свой CQ — коэффициент когерентности сознания. Быстрая калибровка внутреннего компаса через 12
              вопросов.
            </p>

            <button
              onClick={() => setScreen('test')}
              className="px-12 py-4 rounded-full text-xs tracking-[0.25em] transition-all hover:scale-105 active:scale-95"
              style={{
                background: `linear-gradient(135deg, ${colors.warm}33, ${colors.coral}22)`,
                border: '1px solid rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(10px)',
                boxShadow: `0 4px 20px ${colors.warm}15`
              }}
            >
              НАЧАТЬ
            </button>

            <p className="text-[10px] opacity-20 mt-12 tracking-wider">≈ 3 минуты</p>
          </div>
        )}

        {/* Test */}
        {screen === 'test' && (
          <div className="flex-1 flex flex-col px-6 py-8">
            <div className="text-center mb-6">
              <p className="text-[10px] tracking-[0.25em] opacity-30 mb-3">
                {currentQ < 3 ? 'ЛОГИКА' : currentQ < 6 ? 'ЭМПАТИЯ' : currentQ < 9 ? 'АДАПТИВНОСТЬ' : 'СМЫСЛ'}
              </p>
              <div className="h-0.5 rounded-full max-w-xs mx-auto" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${((currentQ + 1) / allQuestions.length) * 100}%`,
                    background: `linear-gradient(90deg, ${colors.warm}, ${colors.coral})`
                  }}
                />
              </div>
              <p className="text-[9px] opacity-20 mt-2">
                {currentQ + 1} / {allQuestions.length}
              </p>
            </div>

            <div className="flex-1 flex flex-col justify-center max-w-lg mx-auto w-full">
              <p className="text-base font-light text-center leading-relaxed mb-14 px-4">{allQuestions[currentQ].q}</p>

              <div className="flex justify-center gap-3 mb-3">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    onClick={() => handleAnswer(val)}
                    className="w-14 h-14 rounded-full text-sm font-light transition-all hover:scale-110 active:scale-95"
                    style={{
                      background: val >= 4 ? `${colors.warm}22` : colors.cardBg,
                      border: `1px solid ${val >= 4 ? `${colors.warm}44` : 'rgba(255,255,255,0.06)'}`,
                      backdropFilter: 'blur(10px)',
                      boxShadow: val >= 4 ? `0 0 20px ${colors.warm}22` : 'none'
                    }}
                  >
                    {val}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-[9px] opacity-25 px-3">
                <span>редко</span>
                <span>часто</span>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {screen === 'results' && results && (
          <div className="flex-1 px-5 py-8 overflow-auto">
            <div className="text-center mb-8">
              <p className="text-[9px] tracking-[0.25em] opacity-25 mb-5">ВАШ РЕЗУЛЬТАТ</p>
              <div className="inline-block mb-6">
                <OrientirSymbol size={100} />
              </div>
              <div className="text-5xl font-extralight mb-2" style={{ color: colors.warm }}>
                {results.cq}
              </div>
              <p className="text-[10px] tracking-[0.25em] opacity-30">CQ INDEX</p>
            </div>

            <Card className="mb-4 max-w-md mx-auto">
              <p className="text-[9px] tracking-[0.25em] opacity-30 mb-5">ЧЕТЫРЕ ОСИ</p>
              {[
                { label: 'Логика', value: results.logic, color: colors.warm },
                { label: 'Эмпатия', value: results.empathy, color: colors.coral },
                { label: 'Адаптивность', value: results.adapt, color: colors.accent },
                { label: 'Смысл', value: results.meaning, color: colors.gold }
              ].map((axis, i) => (
                <div key={i} className="mb-4 last:mb-0">
                  <div className="flex justify-between mb-2">
                    <span className="text-xs opacity-60">{axis.label}</span>
                    <span className="text-xs font-light" style={{ color: axis.color }}>
                      {axis.value}%
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ width: `${axis.value}%`, background: axis.color }}
                    />
                  </div>
                </div>
              ))}
            </Card>

            <Card className="mb-6 max-w-md mx-auto">
              <p className="text-sm leading-relaxed" style={{ color: colors.warm }}>
                {results.cq >= 75
                  ? 'Высокая когерентность — вы в потоке'
                  : results.cq >= 50
                    ? 'Умеренная когерентность — есть зоны роста'
                    : 'Время для перекалибровки'}
              </p>
            </Card>

            <button
              onClick={restart}
              className="w-full max-w-md mx-auto block py-4 rounded-full text-xs tracking-[0.25em] transition-all hover:scale-[1.02]"
              style={{
                background: `linear-gradient(135deg, ${colors.warm}22, ${colors.coral}15)`,
                border: '1px solid rgba(255, 255, 255, 0.06)',
                backdropFilter: 'blur(10px)'
              }}
            >
              ПРОЙТИ ЗАНОВО
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
