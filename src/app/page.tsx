import { EbookQuiz } from '@/components/EbookQuiz'

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const utmSource = typeof params.utm_source === 'string' ? params.utm_source : null
  const ref = typeof params.ref === 'string' ? params.ref : null

  return (
    <main className="min-h-screen">
      <EbookQuiz initialUtmSource={utmSource ?? ref} />
    </main>
  )
}
