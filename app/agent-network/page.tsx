import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { AgentNetworkView } from "@/components/dashboard/views"

export default function AgentNetworkPage() {
  return (
    <DashboardShell activeTab="agent-network">
      <AgentNetworkView />
    </DashboardShell>
  )
}
