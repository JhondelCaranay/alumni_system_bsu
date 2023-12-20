import axios from "axios";

export type DashboardWidgetTotalType = {
  students: number;
  alumni: number;
  student_alumni_with_jobs: number;
  upcomming_events: number;
};

export type DashboardAlumniTotalType = {
  id: number;
  year: number;
  graduates: number;
};

export const getDashboardWidget = (): Promise<DashboardWidgetTotalType> =>
  axios.get(`/api/dashboard/totals`).then((response) => response.data);

export const getDashboardAlumni = (
  year_span: number
): Promise<DashboardAlumniTotalType[]> =>
  axios
    .get(`/api/dashboard/alumni?year_span=${year_span}`)
    .then((response) => response.data);
