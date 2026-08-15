import fs from 'fs';
import path from 'path';

const baseDir = path.join(process.cwd(), 'data/questionBank');

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const exam = searchParams.get('exam');

    if (!type || !exam) {
      return Response.json({ error: 'Missing type or exam parameter' }, { status: 400 });
    }

    const filePath = path.join(baseDir, type, `${exam}.json`);

    if (!fs.existsSync(filePath)) {
      return Response.json({ error: 'Exam not found' }, { status: 404 });
    }

    const raw = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(raw);

    return Response.json(data);
  } catch (error) {
    console.error('Failed to load exam questions:', error);
    return Response.json({ error: 'Failed to load exam' }, { status: 500 });
  }
}
