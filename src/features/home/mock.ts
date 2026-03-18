export type Item = {
  id: string
  title: string
  subtitle?: string
  image?: string
}

const logo = '/Weeknd.png'

export const recently: Item[] = [
  { id: '1', title: 'Midnight City', subtitle: 'M83', image: logo },
  { id: '2', title: 'Blinding Lights', subtitle: 'The Weeknd', image: logo },
  { id: '3', title: 'Take On Me', subtitle: 'a-ha', image: logo },
]

export const forYou: Item[] = [
  { id: '4', title: 'Плейлісти для вас', subtitle: 'Найпопулярніші треки', image: logo },
  { id: '5', title: 'Чіл-аут вечір', subtitle: 'Ретельно підібрані треки', image: logo },
  { id: '6', title: 'Українська хвиля', subtitle: 'Найкраще з української сцени', image: logo },
  { id: '7', title: 'Робочий настрій', subtitle: 'Музика для концентрації та продуктивності', image: logo },
]

export const albums: Item[] = [
  { id: '8', title: "RENT'S DUE (DELUXE)", subtitle: 'AlfaNex • Nemzzz', image: logo },
  { id: '9', title: 'LONDON', subtitle: 'Мінімаллаллаулалл', image: logo },
  { id: '10', title: 'JACKB', subtitle: 'JACKотуоатуот', image: logo },
  { id: '13', title: "RENT'S DUE (DELUXE)", subtitle: 'AlfaNex • Nemzzz', image: logo },
  { id: '11', title: 'Sunif', subtitle: 'Мінімаллаллаулалл', image: logo },
  { id: '12', title: 'GOdf', subtitle: 'JACKотуоатуот', image: logo },
]