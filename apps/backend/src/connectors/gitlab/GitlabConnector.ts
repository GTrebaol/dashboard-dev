import type { MergeRequest, Pipeline } from '@dashboard/shared'
import { BaseConnector } from '../BaseConnector'

export class GitlabConnector extends BaseConnector {
  constructor(baseURL: string, token: string) {
    super(baseURL, { 'PRIVATE-TOKEN': token })
  }

  async getOpenMergeRequests(username: string): Promise<MergeRequest[]> {
    const { data } = await this.client.get('/api/v4/merge_requests', {
      params: {
        state: 'opened',
        author_username: username,
        per_page: 50,
      },
    })
    return data.map(this.mapMR)
  }

  private mapMR(raw: any): MergeRequest {
    const pipeline: Pipeline | undefined = raw.head_pipeline
      ? {
          id: raw.head_pipeline.id,
          status: raw.head_pipeline.status,
          webUrl: raw.head_pipeline.web_url,
          updatedAt: raw.head_pipeline.updated_at,
        }
      : undefined

    return {
      id: raw.id,
      iid: raw.iid,
      title: raw.title,
      state: raw.state,
      webUrl: raw.web_url,
      sourceBranch: raw.source_branch,
      targetBranch: raw.target_branch,
      projectId: raw.project_id,
      projectName: raw.references?.full?.split('!')?.[0] ?? String(raw.project_id),
      pipeline,
      createdAt: raw.created_at,
      updatedAt: raw.updated_at,
    }
  }
}
