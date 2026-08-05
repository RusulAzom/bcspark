export const questionBankConfig = {
  BCS: {
    questionLimit: 20,
    passMarkPct: 0.7,
    negativePerWrong: 0.25,
    label: 'BCS',
  },
  Bank: {
    questionLimit: 20,
    passMarkPct: 0.7,
    negativePerWrong: 0.25,
    label: 'Bank',
  },
  PrimaryTeacher: {
    questionLimit: 20,
    passMarkPct: 0.7,
    negativePerWrong: 0.25,
    label: 'Primary Teacher',
  },
  University: {
    questionLimit: 20,
    passMarkPct: 0.7,
    negativePerWrong: 0.25,
    label: 'University Admission',
  },
};

export const getQuestionBankConfig = (examType) => {
  return questionBankConfig[examType] || questionBankConfig.BCS;
};
