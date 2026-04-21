import type { JiraIssue } from '@dashboard/shared'
import { BaseConnector } from '../BaseConnector'

export class JiraConnector extends BaseConnector {
  constructor(baseURL: string, token: string) {
    super(baseURL, { Authorization: `Bearer ${token}` })
  }

  async getIssuesForUser(accountId: string): Promise<JiraIssue[]> {
    const jql = `assignee = "${accountId}" AND statusCategory in ("To Do","In Progress") ORDER BY updated DESC`
    const { data } = await this.client.post('/rest/api/3/search', {
      jql,
      maxResults: 50,
      fields: ['summary', 'status', 'priority', 'project', 'updated'],
    })
    return data.issues.map((raw: any) => this.mapIssue(raw))
  }

  private mapIssue(raw: any): JiraIssue {
    const catKey: string = raw.fields.status.statusCategory.key
    const statusCategory =
      catKey === 'indeterminate' ? 'in_progress' : catKey === 'new' ? 'todo' : 'done'

    return {
      id: raw.id,
      key: raw.key,
      summary: raw.fields.summary,
      status: raw.fields.status.name,
      statusCategory,
      priority: raw.fields.priority?.name ?? 'None',
      projectKey: raw.fields.project.key,
      projectName: raw.fields.project.name,
      url: `${process.env.JIRA_BASE_URL}/browse/${raw.key}`,
      updatedAt: raw.fields.updated,
    }
  }
}
