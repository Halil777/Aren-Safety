import { ObservationsDashboard } from "../components/observations-dashboard";
import { TasksDashboard } from "../components/tasks-dashboard";

export function DashboardPageV2() {
  return (
    <div className="p-6 space-y-8">
      <ObservationsDashboard />
      <TasksDashboard />
    </div>
  );
}
