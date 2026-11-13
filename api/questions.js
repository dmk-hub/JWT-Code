import { prisma } from '../server/core/db.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  const { courseSlug } = req.query; // Ví dụ: /api/questions?courseSlug=ielts

  try {
    // Lấy 10 câu hỏi ngẫu nhiên thuộc khóa học
    const questions = await prisma.question.findMany({
      where: {
        lesson: {
          course: { slug: courseSlug || 'ielts' }
        }
      },
      take: 10,
      // Không trả về đáp án đúng để chống gian lận
      select: {
        id: true,
        text: true,
        optionA: true,
        optionB: true,
        optionC: true,
        optionD: true,
        difficulty: true
      }
    })

    res.status(200).json(questions)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}