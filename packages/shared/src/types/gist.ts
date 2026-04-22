export interface Gist {
  id: string
  title: string
  description?: string | null
  content: string
  language?: string | null
  shareToken: string
  authorId: string
  author: { id: string; username: string; email: string }
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface CreateGistDto {
  title: string
  description?: string
  content: string
  language?: string
  tags?: string[]
}
