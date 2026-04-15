export function getEntityHref(type: 'track' | 'album' | 'playlist', id: string) {
  if (type === 'track') {
    return `/player?trackId=${id}`
  }

  if (type === 'album') {
    return `/album/${id}`
  }

  return `/playlist/${id}`
}