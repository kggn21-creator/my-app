import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { getDownloadUrl } from '@vercel/blob'

// private Blob 파일의 서명된 다운로드 URL을 반환
export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return Response.json({ error: '인증이 필요합니다.' }, { status: 401 })
  }

  const url = request.nextUrl.searchParams.get('url')
  if (!url) {
    return Response.json({ error: 'url 파라미터가 필요합니다.' }, { status: 400 })
  }

  try {
    const downloadUrl = await getDownloadUrl(url)
    return Response.redirect(downloadUrl)
  } catch (error) {
    console.error('[blob GET]', error)
    return Response.json({ error: '파일 다운로드 링크 생성에 실패했습니다.' }, { status: 500 })
  }
}
