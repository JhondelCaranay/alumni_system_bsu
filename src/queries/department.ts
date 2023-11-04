import {
  CreateDepartmentSchemaType,
  DepartmentSchemaType,
  UpdateDepartmentSchemaType,
} from "@/schema/department";
import axios from "axios";

export const getDeparments = (): Promise<DepartmentSchemaType[]> =>
  axios.get("/api/departments").then((response) => response.data);

export const createDeparment = (data: CreateDepartmentSchemaType): Promise<DepartmentSchemaType> =>
  axios.post("/api/departments", data).then((response) => response.data);

export const updateDeparment = (
  departmentId: string,
  data: UpdateDepartmentSchemaType
): Promise<UpdateDepartmentSchemaType> =>
  axios.patch(`/api/departments/${departmentId}`, data).then((response) => response.data);
