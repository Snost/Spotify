export type Item = { id: string; title: string; subtitle?: string }

export const recently: Item[] = [
  { id: '1', title: 'Midnight City', subtitle: 'M83' },
  { id: '2', title: 'Blinding Lights', subtitle: 'The Weeknd' },
  { id: '3', title: 'Take On Me', subtitle: 'a-ha' },
]

export const forYou: Item[] = [
  { id: '4', title: 'Плейлісти для вас', subtitle: 'Найпопулярніші треки' },
  { id: '5', title: 'Чіл-аут вечір', subtitle: 'Ретельно підібрані треки' },
]

export const mood: Item[] = [
  { id: '6', title: 'Українська хвиля', subtitle: 'Найкраще з української музики' },
  { id: '7', title: 'Робочий настрій', subtitle: 'Музика для фокусу та продуктивності' },
  { id: '8', title: 'Нічні прогулянки', subtitle: 'Спокійні треки для вечора' },
]

export const albums: Item[] = [
  { id: '9', title: "RENT'S DUE (DELUXE)", subtitle: 'AlfaNex • Nemzzz' },
  { id: '10', title: 'LONDON', subtitle: 'Мінімал • ...' },
  { id: '11', title: 'JACKB...', subtitle: 'JACKB...' },
]