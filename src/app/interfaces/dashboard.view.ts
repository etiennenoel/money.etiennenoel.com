import { DashboardPeriodView } from './dashboard-period.view';

export interface DashboardView {
  selectedPeriod: DashboardPeriodView;
  previousPeriod: DashboardPeriodView;
}
