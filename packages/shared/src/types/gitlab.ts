export interface Pipeline {
  id: number
  status: 'running' | 'pending' | 'success' | 'failed' | 'canceled' | 'skipped'
  webUrl: string
  updatedAt: string
}

export interface MergeRequest {
  id: number
  iid: number
  title: string
  state: 'opened' | 'closed' | 'merged' | 'locked'
  webUrl: string
  sourceBranch: string
  targetBranch: string
  projectId: number
  projectName: string
  pipeline?: Pipeline
  createdAt: string
  updatedAt: string
}
