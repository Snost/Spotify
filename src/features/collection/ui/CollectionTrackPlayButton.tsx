'use client'

import { TrackPlayToggle } from '@/features/player/ui/TrackPlayToggle'

type Props = {
  trackId: string
  source: 'playlist' | 'album'
  contextExternalId: string
}

export function CollectionTrackPlayButton({
  trackId,
  source,
  contextExternalId,
}: Props) {
  return (
    <TrackPlayToggle
      trackId={trackId}
      source={source}
      contextExternalId={contextExternalId}
      variant="round"
      size="sm"
    />
  )
}