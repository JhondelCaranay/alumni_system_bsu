import {
  ArchiveDepartmentSchemaType,
  CreateDepartmentSchemaType,
  DepartmentSchemaType,
  UpdateDepartmentSchemaType,
} from "@/schema/department";
import axios from "axios";

export const getDeparments = (): Promise<DepartmentSchemaType[]> =>
  axios.get("/api/departments").then((response) => response.data);

export const createDeparment = (
  data: CreateDepartmentSchemaType
): Promise<DepartmentSchemaType> =>
  axios.post("/api/departments", data).then((response) => response.data);

export const updateDeparment = (
  departmentId: string,
  data: UpdateDepartmentSchemaType
): Promise<DepartmentSchemaType> =>
  axios
    .patch(`/api/departments/${departmentId}`, data)
    .then((response) => response.data);

export const archiveDeparment = (
  departmentId: string
): Promise<DepartmentSchemaType> =>
  axios
    .delete(`/api/departments/${departmentId}`)
    .then((response) => response.data);
