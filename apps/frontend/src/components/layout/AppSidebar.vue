<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import {
  LayoutDashboard, GitMerge, CheckSquare, ShieldCheck,
  FileCode2, Bookmark, Activity, Settings, LogOut,
  ChevronDown,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const initials = computed(() =>
  (auth.user?.username ?? 'U')
    .split(/[._-]/)
    .map((p: string) => p[0]?.toUpperCase() ?? '')
    .slice(0, 2)
    .join(''),
)

async function handleLogout() {
  await auth.logout()
  router.push('/login')
}

const workNav = [
  { label: 'Overview',   path: '/dashboard', icon: LayoutDashboard },
  { label: 'Merge Reqs', path: '/dashboard', icon: GitMerge, count: null },
  { label: 'Tasks',      path: '/dashboard', icon: CheckSquare, count: null },
  { label: 'Quality',    path: '/dashboard', icon: ShieldCheck, count: null },
]

const shareNav = [
  { label: 'Snippets',   path: '/gists', icon: FileCode2 },
  { label: 'Pins',       path: '/gists', icon: Bookmark },
  { label: 'DevOps',     path: '/gists', icon: Activity },
]
</script>

<template>
  <aside style="border-right:1px solid var(--oborder); background:var(--bg); display:flex; flex-direction:column; position:sticky; top:0; height:100vh; overflow-y:auto;">

    <!-- Brand lockup -->
    <div style="display:flex; align-items:center; gap:10px; padding:0 16px; height:56px; border-bottom:1px solid var(--oborder); flex-shrink:0;">
      <!-- brand mark: red rounded square with diamond cutout -->
      <div style="width:22px; height:22px; border-radius:6px; background:var(--brand); flex-shrink:0; position:relative; display:grid; place-items:center;">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style="position:absolute;">
          <path d="M6 1L11 6L6 11L1 6Z" fill="white" fill-opacity="0.9"/>
        </svg>
      </div>
      <span style="font-weight:600; letter-spacing:-0.01em; font-size:14px;">orbit</span>
      <span class="mono" style="font-size:10.5px; color:var(--text-faint); margin-left:auto;">v4.2</span>
    </div>

    <!-- Workspace switcher -->
    <div style="padding:10px 12px; border-bottom:1px solid var(--oborder); flex-shrink:0;">
      <button style="width:100%; display:flex; align-items:center; gap:8px; padding:8px 10px; background:var(--bg-1); border:1px solid var(--oborder); border-radius:6px; font-size:12.5px; color:var(--text-dim);">
        <span style="width:6px; height:6px; border-radius:50%; background:var(--lime); flex-shrink:0;" />
        <span style="flex:1; text-align:left; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">Mon équipe</span>
        <ChevronDown style="width:13px; height:13px; color:var(--text-faint); flex-shrink:0;" />
      </button>
    </div>

    <!-- Nav -->
    <nav style="flex:1; padding:10px 8px 4px; overflow-y:auto;">
      <!-- Work group -->
      <p style="padding:6px 10px; font-size:10.5px; text-transform:uppercase; letter-spacing:0.09em; color:var(--text-faint); margin:0;">Work</p>
      <RouterLink
        v-for="item in workNav"
        :key="item.label"
        :to="item.path"
        :class="cn('o-nav-item', route.path.startsWith(item.path) && item.path === '/dashboard' ? 'active' : '')"
        style="text-decoration:none;"
      >
        <component :is="item.icon" class="nav-ico" />
        <span>{{ item.label }}</span>
      </RouterLink>

      <!-- Share & Ops group -->
      <p style="padding:6px 10px; font-size:10.5px; text-transform:uppercase; letter-spacing:0.09em; color:var(--text-faint); margin:8px 0 0;">Share &amp; Ops</p>
      <RouterLink
        v-for="item in shareNav"
        :key="item.label"
        :to="item.path"
        :class="cn('o-nav-item', route.path.startsWith('/gists') && item.path === '/gists' && item.label === 'Snippets' ? 'active' : '')"
        style="text-decoration:none;"
      >
        <component :is="item.icon" class="nav-ico" />
        <span>{{ item.label }}</span>
      </RouterLink>
    </nav>

    <!-- Settings + user footer -->
    <div style="border-top:1px solid var(--oborder); flex-shrink:0;">
      <button class="o-nav-item" style="width:100%;">
        <Settings class="nav-ico" />
        <span>Settings</span>
      </button>

      <!-- User card -->
      <div style="display:flex; align-items:center; gap:10px; padding:10px 12px; border-top:1px solid var(--oborder);">
        <div style="width:26px; height:26px; border-radius:50%; background:linear-gradient(135deg,#3a3a40,#18181b); display:grid; place-items:center; font-size:11px; font-weight:600; color:var(--text-dim); border:1px solid var(--oborder); flex-shrink:0;">
          {{ initials }}
        </div>
        <div style="flex:1; min-width:0;">
          <div style="font-size:12.5px; font-weight:500; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">{{ auth.user?.username }}</div>
          <div style="font-size:11px; color:var(--text-faint); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">{{ auth.user?.email }}</div>
        </div>
        <button class="o-icon-btn" title="Se déconnecter" @click="handleLogout">
          <LogOut style="width:13px; height:13px;" />
        </button>
      </div>
    </div>
  </aside>
</template>
