import fs from 'fs';
import path from 'path';

const baseDir = path.join(process.cwd(), 'data/questionBank');

export async function GET() {
  try {
    if (!fs.existsSync(baseDir)) {
      return Response.json([]);
    }

    const examTypes = fs.readdirSync(baseDir, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    const exams = [];

    for (const type of examTypes) {
      const typeDir = path.join(baseDir, type);
      const files = fs.readdirSync(typeDir)
        .filter((file) => file.endsWith('.json'))
        .sort()
        .reverse();

      for (const file of files) {
        const filePath = path.join(typeDir, file);
        const raw = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(raw);
        const info = data.examInfo || {};

        exams.push({
          slug: `${type}/${file.replace('.json', '')}`,
          examType: type,
          examCategory: info.examCategory || 'General',
          examName: info.examName || file.replace('.json', ''),
          examDate: info.examDate || '',
          totalMarks: info.totalMarks || 100,
          totalQuestions: info.totalQuestions || 100,
          timeLimitMinutes: info.timeLimitMinutes || null,
        });
      }
    }

    return Response.json(exams);
  } catch (error) {
    console.error('Failed to load question bank list:', error);
    return Response.json({ error: 'Failed to load exams' }, { status: 500 });
  }
}
