const baseCounts = {
  BCS: 1250,
  Bank: 800,
  PrimaryTeacher: 600,
  University: 400,
};

const startDate = new Date('2026-01-01');

const getDailyIncrement = (date, examType) => {
  const seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
  const x = Math.sin(seed * (examType.length + 1)) * 10000;
  const random = x - Math.floor(x);
  return Math.floor(random * 5) + 7;
};

export const getParticipantCount = (examType = 'BCS') => {
  const base = baseCounts[examType] || 1000;
  const today = new Date();
  const daysDiff = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));

  let totalIncrease = 0;
  for (let i = 0; i < daysDiff; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    totalIncrease += getDailyIncrement(d, examType);
  }

  return base + totalIncrease;
};

const randn = () => {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
};

export const getLeaderboard = (userScore, totalQuestions, examType = 'BCS') => {
  const totalParticipants = getParticipantCount(examType) + 1;

  const mean = totalQuestions * 0.6;
  const stdDev = totalQuestions * 0.15;
  const scores = [];

  for (let i = 0; i < totalParticipants - 1; i++) {
    let s = mean + randn() * stdDev;
    s = Math.max(0, Math.min(totalQuestions, Math.round(s * 2) / 2));
    scores.push(s);
  }

  scores.push(userScore);
  scores.sort((a, b) => b - a);

  const rank = scores.indexOf(userScore) + 1;
  const percentile = ((totalParticipants - rank) / (totalParticipants - 1)) * 100;

  return { rank, total: totalParticipants, percentile };
};
