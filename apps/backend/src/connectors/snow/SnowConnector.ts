import type { Mep, MepStatus } from '@dashboard/shared'
import { BaseConnector } from '../BaseConnector'

const STATUS_MAP: Record<string, MepStatus> = {
  scheduled: 'planned',
  implement: 'in_progress',
  review: 'in_progress',
  closed: 'completed',
  canceled: 'cancelled',
}

export class SnowConnector extends BaseConnector {
  constructor(baseURL: string, token: string) {
    super(baseURL, { Authorization: `Bearer ${token}` })
  }

  async getMeps(): Promise<Mep[]> {
    const { data } = await this.client.get('/api/now/table/change_request', {
      params: {
        sysparm_query: 'type=normal',
        sysparm_fields:
          'sys_id,short_description,description,state,start_date,end_date,u_environment,requested_by,u_affected_services',
        sysparm_limit: 100,
      },
    })
    return data.result.map((raw: any) => this.mapMep(raw))
  }

  private mapMep(raw: any): Mep {
    return {
      id: raw.sys_id,
      title: raw.short_description,
      description: raw.description || undefined,
      status: STATUS_MAP[raw.state] ?? 'planned',
      plannedStart: raw.start_date,
      plannedEnd: raw.end_date,
      environment: raw.u_environment || 'unknown',
      requester: raw.requested_by?.display_value,
      affectedServices: raw.u_affected_services
        ? raw.u_affected_services.split(',').map((s: string) => s.trim())
        : [],
    }
  }
}
