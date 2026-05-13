import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'

// private Blob 파일을 서버에서 fetch해서 클라이언트에 스트리밍
export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const url = request.nextUrl.searchParams.get('url')
  if (!url) {
    return new Response('url 파라미터가 필요합니다.', { status: 400 })
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) {
    return new Response('스토리지 설정이 없습니다.', { status: 500 })
  }

  try {
    const blobRes = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!blobRes.ok) {
      return new Response('파일을 찾을 수 없습니다.', { status: blobRes.status })
    }

    const contentType = blobRes.headers.get('Content-Type') ?? 'application/octet-stream'
    const contentLength = blobRes.headers.get('Content-Length')

    // 파일명을 URL에서 추출
    const fileName = decodeURIComponent(url.split('/').pop()?.split('?')[0] ?? 'download')

    const headers = new Headers({
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="${fileName}"`,
    })
    if (contentLength) headers.set('Content-Length', contentLength)

    return new Response(blobRes.body, { headers })
  } catch (error) {
    console.error('[blob GET]', error)
    return new Response('파일 다운로드에 실패했습니다.', { status: 500 })
  }
}
