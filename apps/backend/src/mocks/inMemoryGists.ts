import type { Gist } from '@dashboard/shared'

function cuid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

const seedGists: Gist[] = [
  {
    id: cuid(),
    title: 'Snippet axios avec retry automatique',
    description: 'Interceptor axios qui retente les requêtes en cas d\'erreur réseau',
    content: `import axios from 'axios'

const client = axios.create({ baseURL: '/api' })

client.interceptors.response.use(
  res => res,
  async err => {
    const config = err.config
    if (!config || config._retryCount >= 3) return Promise.reject(err)
    config._retryCount = (config._retryCount ?? 0) + 1
    await new Promise(r => setTimeout(r, 300 * config._retryCount))
    return client(config)
  }
)

export default client`,
    language: 'typescript',
    shareToken: cuid(),
    authorId: 'dev-001',
    author: { id: 'dev-001', username: 'dev.user', email: 'dev.user@company.com' },
    tags: ['axios', 'typescript', 'http'],
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: cuid(),
    title: 'Requête SQL — Top 10 utilisateurs actifs',
    description: 'Compte les actions par utilisateur sur les 30 derniers jours',
    content: `SELECT
  u.id,
  u.username,
  COUNT(a.id) AS action_count
FROM users u
JOIN audit_logs a ON a.user_id = u.id
WHERE a.created_at >= NOW() - INTERVAL '30 days'
GROUP BY u.id, u.username
ORDER BY action_count DESC
LIMIT 10;`,
    language: 'sql',
    shareToken: cuid(),
    authorId: 'dev-002',
    author: { id: 'dev-002', username: 'alice.martin', email: 'alice.martin@company.com' },
    tags: ['sql', 'postgresql', 'analytics'],
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: cuid(),
    title: 'Script bash — nettoyage des branches Git mergées',
    description: 'Supprime les branches locales déjà mergées dans main',
    content: `#!/bin/bash
set -e

echo "Branches mergées dans main :"
git branch --merged main | grep -v "^\\*\\|main\\|develop"

read -p "Supprimer ces branches ? (y/N) " confirm
if [[ "$confirm" == "y" ]]; then
  git branch --merged main \\
    | grep -v "^\\*\\|main\\|develop" \\
    | xargs -r git branch -d
  echo "Branches supprimées."
fi`,
    language: 'bash',
    shareToken: cuid(),
    authorId: 'dev-001',
    author: { id: 'dev-001', username: 'dev.user', email: 'dev.user@company.com' },
    tags: ['bash', 'git', 'devops'],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
]

const store = new Map<string, Gist>(seedGists.map((g) => [g.id, g]))

export const inMemoryGists = {
  findAll(filters: { tags?: string[]; author?: string; search?: string }): Gist[] {
    return Array.from(store.values())
      .filter((g) => {
        if (filters.author && g.author.username !== filters.author) return false
        if (filters.search) {
          const q = filters.search.toLowerCase()
          if (!g.title.toLowerCase().includes(q) && !g.author.username.toLowerCase().includes(q))
            return false
        }
        if (filters.tags?.length) {
          if (!filters.tags.some((t) => g.tags.includes(t))) return false
        }
        return true
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  },

  findByShareToken(shareToken: string): Gist | undefined {
    return Array.from(store.values()).find((g) => g.shareToken === shareToken)
  },

  findById(id: string): Gist | undefined {
    return store.get(id)
  },

  create(data: {
    title: string
    description?: string
    content: string
    language?: string
    tags?: string[]
    author: { id: string; username: string; email: string }
  }): Gist {
    const id = cuid()
    const now = new Date().toISOString()
    const gist: Gist = {
      id,
      title: data.title,
      description: data.description ?? null,
      content: data.content,
      language: data.language ?? null,
      shareToken: cuid(),
      authorId: data.author.id,
      author: data.author,
      tags: data.tags ?? [],
      createdAt: now,
      updatedAt: now,
    }
    store.set(id, gist)
    return gist
  },

  delete(id: string): boolean {
    return store.delete(id)
  },
}
