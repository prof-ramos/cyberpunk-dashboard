import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { SystemsView } from "@/components/dashboard/views"

export default function SystemsPage() {
  return (
    <DashboardShell activeTab="systems">
      <SystemsView />
    </DashboardShell>
  )
}
