export interface SonarMetrics {
  coverage?: number
  bugs: number
  vulnerabilities: number
  codeSmells: number
  duplications?: number
}

export interface SonarAnalysis {
  projectKey: string
  projectName: string
  qualityGate: 'OK' | 'WARN' | 'ERROR'
  metrics: SonarMetrics
  analyzedAt: string
}

export interface SonarMRAnalysis extends SonarAnalysis {
  mrIid: number
  mrTitle: string
}
