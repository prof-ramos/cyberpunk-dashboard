import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { OperationsView } from "@/components/dashboard/views"

export default function OperationsPage() {
  return (
    <DashboardShell activeTab="operations">
      <OperationsView />
    </DashboardShell>
  )
}
