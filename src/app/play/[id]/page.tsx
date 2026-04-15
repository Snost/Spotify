import { redirect } from 'next/navigation'

type Props = {
  params: Promise<{ id: string }>
}

export default async function TrackPlayPage({ params }: Props) {
  const { id } = await params
  redirect(`/player?trackId=${id}`)
}