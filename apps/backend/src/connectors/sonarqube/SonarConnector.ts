import type { SonarAnalysis } from '@dashboard/shared'
import { BaseConnector } from '../BaseConnector'

export class SonarConnector extends BaseConnector {
  constructor(baseURL: string, token: string) {
    // Sonar attend un Basic auth avec le token comme username et un mot de passe vide
    const encoded = Buffer.from(`${token}:`).toString('base64')
    super(baseURL, { Authorization: `Basic ${encoded}` })
  }

  async getProjectAnalysis(projectKey: string): Promise<SonarAnalysis> {
    const [measuresRes, gateRes] = await Promise.all([
      this.client.get('/api/measures/component', {
        params: {
          component: projectKey,
          metricKeys: 'coverage,bugs,vulnerabilities,code_smells,duplicated_lines_density',
        },
      }),
      this.client.get('/api/qualitygates/project_status', {
        params: { projectKey },
      }),
    ])

    const measures = Object.fromEntries(
      measuresRes.data.component.measures.map((m: any) => [m.metric, parseFloat(m.value)]),
    )

    return {
      projectKey,
      projectName: measuresRes.data.component.name,
      qualityGate: gateRes.data.projectStatus.status,
      metrics: {
        coverage: measures['coverage'],
        bugs: measures['bugs'] ?? 0,
        vulnerabilities: measures['vulnerabilities'] ?? 0,
        codeSmells: measures['code_smells'] ?? 0,
        duplications: measures['duplicated_lines_density'],
      },
      analyzedAt: new Date().toISOString(),
    }
  }
}
