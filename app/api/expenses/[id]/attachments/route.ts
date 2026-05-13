import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { put } from '@vercel/blob'
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE } from '@/lib/constants'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user) {
    return Response.json({ error: '인증이 필요합니다.' }, { status: 401 })
  }

  const { id } = await params

  const expense = await prisma.expenseRequest.findUnique({ where: { id } })
  if (!expense) {
    return Response.json({ error: '신청을 찾을 수 없습니다.' }, { status: 404 })
  }

  if (expense.requesterId !== session.user.id) {
    return Response.json({ error: '접근 권한이 없습니다.' }, { status: 403 })
  }

  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    if (!files || files.length === 0) {
      return Response.json({ error: '파일을 선택해 주세요.' }, { status: 400 })
    }

    const attachments = []
    for (const file of files) {
      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        return Response.json(
          { error: `${file.name}: 허용되지 않는 파일 형식입니다. (JPG, PNG, WEBP, PDF만 가능)` },
          { status: 400 }
        )
      }
      if (file.size > MAX_FILE_SIZE) {
        return Response.json(
          { error: `${file.name}: 파일 크기는 10MB 이하여야 합니다.` },
          { status: 400 }
        )
      }

      // Vercel Blob에 업로드 (서버리스 환경 대응)
      const blob = await put(`expenses/${id}/${file.name}`, file, {
        access: 'public',
        addRandomSuffix: true,
      })

      const attachment = await prisma.attachment.create({
        data: {
          fileName: file.name,
          filePath: blob.url,
          mimeType: file.type,
          fileSize: file.size,
          expenseRequestId: id,
        },
      })
      attachments.push(attachment)
    }

    return Response.json({ attachments }, { status: 201 })
  } catch (error) {
    console.error('[attachments POST]', error)
    return Response.json({ error: '파일 업로드 중 오류가 발생했습니다.' }, { status: 500 })
  }
}
