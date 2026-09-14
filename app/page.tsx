import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { CommandCenterView } from "@/components/dashboard/views"

export default function HomePage() {
  return (
    <DashboardShell activeTab="command-center">
      <CommandCenterView />
    </DashboardShell>
  )
}
