import axios from "axios";

export type DashboardWidgetTotalType = {
  students: number;
  alumni: number;
  student_alumni_with_jobs: number;
  upcomming_events: number;
};

export const getDashboardWidget = (): Promise<DashboardWidgetTotalType> =>
  axios.get(`/api/dashboard/totals`).then((response) => response.data);
