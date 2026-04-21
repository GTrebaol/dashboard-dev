import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import type { JiraIssue, MergeRequest, SonarAnalysis, Mep } from '@dashboard/shared'
import { useAuthStore } from '@/stores/auth'

const sonarProjectKeys = (import.meta.env.VITE_SONAR_PROJECTS ?? '')
  .split(',')
  .map((k: string) => k.trim())
  .filter(Boolean) as string[]

export function useDashboardData() {
  const auth = useAuthStore()

  const issues = ref<JiraIssue[]>([])
  const mrs = ref<MergeRequest[]>([])
  const analyses = ref<SonarAnalysis[]>([])
  const meps = ref<Mep[]>([])

  const loadingIssues = ref(true)
  const loadingMrs = ref(true)
  const loadingAnalyses = ref(sonarProjectKeys.length > 0)
  const loadingMeps = ref(true)

  const errorIssues = ref('')
  const errorMrs = ref('')
  const errorAnalyses = ref('')
  const errorMeps = ref('')

  const stats = computed(() => ({
    ticketsActifs: issues.value.filter((i) => i.statusCategory !== 'done').length,
    ticketsEnCours: issues.value.filter((i) => i.statusCategory === 'in_progress').length,
    mrsOuvertes: mrs.value.filter((m) => m.state === 'opened').length,
    mrsPipelinesKo: mrs.value.filter((m) => m.pipeline?.status === 'failed').length,
    mepsActives: meps.value.filter((m) => m.status === 'in_progress' || m.status === 'planned').length,
    mepsEnCours: meps.value.filter((m) => m.status === 'in_progress').length,
    alertesSonar: analyses.value.filter((a) => a.qualityGate !== 'OK').length,
    totalSonar: analyses.value.length,
  }))

  onMounted(async () => {
    const h = { Authorization: `Bearer ${auth.token}` }

    await Promise.all([
      axios.get<JiraIssue[]>('/api/jira/issues', { headers: h })
        .then((r) => { issues.value = r.data })
        .catch(() => { errorIssues.value = 'Impossible de charger les tickets JIRA' })
        .finally(() => { loadingIssues.value = false }),

      axios.get<MergeRequest[]>('/api/gitlab/merge-requests', { headers: h })
        .then((r) => { mrs.value = r.data })
        .catch(() => { errorMrs.value = 'Impossible de charger les MRs GitLab' })
        .finally(() => { loadingMrs.value = false }),

      ...(sonarProjectKeys.length
        ? [Promise.all(
            sonarProjectKeys.map((key) =>
              axios.get<SonarAnalysis>(`/api/sonar/project/${key}`, { headers: h })
                .then((r) => { analyses.value.push(r.data) })
                .catch(() => {}),
            ),
          ).finally(() => { loadingAnalyses.value = false })]
        : []),

      axios.get<Mep[]>('/api/snow/meps', { headers: h })
        .then((r) => { meps.value = r.data })
        .catch(() => { errorMeps.value = 'Impossible de charger les MEPs' })
        .finally(() => { loadingMeps.value = false }),
    ])
  })

  return {
    issues, mrs, analyses, meps,
    loadingIssues, loadingMrs, loadingAnalyses, loadingMeps,
    errorIssues, errorMrs, errorAnalyses, errorMeps,
    stats,
    hasSonarProjects: sonarProjectKeys.length > 0,
  }
}
