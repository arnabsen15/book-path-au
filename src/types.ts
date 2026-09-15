export interface OutboundLink {
  label: string
  url: string
}

export interface FreePath {
  available: boolean
  note: string
  links: OutboundLink[]
}

export interface AudiobookInfo {
  librivox?: OutboundLink
}

export interface Book {
  id: string
  title: string
  author: string
  isbn?: string
  year?: number
  tags?: string[]
  free: FreePath
  audiobook?: AudiobookInfo
}
