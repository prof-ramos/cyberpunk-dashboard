import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { IntelligenceView } from "@/components/dashboard/views"

export default function IntelligencePage() {
  return (
    <DashboardShell activeTab="intelligence">
      <IntelligenceView />
    </DashboardShell>
  )
}
