export const getTimeLimit = (totalQuestions, explicitTimeLimitMinutes) => {
  if (explicitTimeLimitMinutes && Number(explicitTimeLimitMinutes) > 0) {
    return Number(explicitTimeLimitMinutes) * 60;
  }
  if (totalQuestions >= 200) return 80 * 60;
  if (totalQuestions >= 100) return 40 * 60;
  return 2 * 60 * 60;
};

export const getPassMark = (totalQuestions) => Math.round(totalQuestions * 0.7);

export const calculateExamResults = (answers, questions) => {
  let correct = 0;
  let wrong = 0;

  Object.entries(answers).forEach(([qIndex, selected]) => {
    const question = questions[Number(qIndex)];
    if (Number(selected) === question.ans) {
      correct++;
    } else {
      wrong++;
    }
  });

  const skipped = questions.length - Object.keys(answers).length;
  const totalScore = correct - wrong * 0.25;

  return { correct, wrong, skipped, totalScore };
};

export const formatTimer = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

export const formatDateTime = (d = new Date()) => {
  const pad = (n) => String(n).padStart(2, '0');
  const date = `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()}`;
  let hours = d.getHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  const time = `${hours}:${pad(d.getMinutes())} ${ampm}`;
  return `${date} | ${time}`;
};

export const getRandomItems = (arr, n) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
};
