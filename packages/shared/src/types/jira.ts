export interface JiraIssue {
  id: string
  key: string
  summary: string
  status: string
  statusCategory: 'todo' | 'in_progress' | 'done'
  priority: string
  projectKey: string
  projectName: string
  url: string
  updatedAt: string
}
