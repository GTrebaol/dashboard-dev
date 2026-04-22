export type MepStatus = 'planned' | 'in_progress' | 'completed' | 'cancelled' | 'failed'

export interface Mep {
  id: string
  title: string
  description?: string
  status: MepStatus
  plannedStart: string
  plannedEnd: string
  environment: string
  requester?: string
  affectedServices: string[]
}
