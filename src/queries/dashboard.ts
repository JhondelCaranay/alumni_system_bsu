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

export type DashboardJobsPerYearType = {
  id: number;
  year: number;
  studentsWithJob: number;
  alumniWithJob: number;
};

export type TotalMaleFemaleStudentsType = {
  id: number;
  year: string;
  male: number;
  female: number;
  total: number;
};

export const getDashboardWidget = (): Promise<DashboardWidgetTotalType> =>
  axios.get(`/api/dashboard/totals`).then((response) => response.data);

export const getDashboardAlumni = (
  year_span: number
): Promise<DashboardAlumniTotalType[]> =>
  axios
    .get(`/api/dashboard/alumni?year_span=${year_span}`)
    .then((response) => response.data);

export const getDashboardJobsPerYear = (
  departmentId: string
): Promise<DashboardJobsPerYearType[]> =>
  axios
    .get(`/api/dashboard/jobs?departmentId=${departmentId}`)
    .then((response) => response.data);

export const getDashboardMaleFemaleStudents = (
  departmentId: string,
  year: number
): Promise<TotalMaleFemaleStudentsType[]> =>
  axios
    .get(`/api/dashboard/students?departmentId=${departmentId}&year=${year}`)
    .then((response) => response.data);
