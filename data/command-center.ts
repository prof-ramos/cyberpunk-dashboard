import type { ActivityLog, MissionStatsSummary, NetworkHealth } from "@/types"

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  {
    time: "25/06/2025 09:29",
    agent: "gh0st_Fire",
    action: "concluiu missão em",
    location: "Berlin",
    target: "zer0_Nigh",
  },
  {
    time: "25/06/2025 08:12",
    agent: "dr4g0n_V3in",
    action: "extraiu alvo de alto valor em",
    location: "Cairo",
    target: null,
  },
  {
    time: "24/06/2025 22:55",
    agent: "sn4ke_Sh4de",
    action: "perdeu comunicação em",
    location: "Havana",
    target: null,
  },
  {
    time: "24/06/2025 21:33",
    agent: "ph4nt0m_R4ven",
    action: "iniciou vigilância em",
    location: "Tokyo",
    target: null,
  },
  {
    time: "24/06/2025 19:45",
    agent: "v0id_Walk3r",
    action: "comprometeu a segurança em",
    location: "Moscow",
    target: "d4rk_M4trix",
  },
]

export const INITIAL_MISSION_STATS: MissionStatsSummary = {
  successful: {
    highRisk: 190,
    mediumRisk: 426,
    lowRisk: 920,
  },
  failed: {
    highRisk: 190,
    mediumRisk: 426,
    lowRisk: 920,
  },
}

export const INITIAL_NETWORK_HEALTH: NetworkHealth = {
  status: "online",
  network: "OPERACIONAL",
  uptime: "99.7%",
  activeAgents: 1247,
}
