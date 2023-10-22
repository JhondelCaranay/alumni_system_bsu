import { SafeUserWithProfileWithDapartment } from "@/types/types";
import axios from "axios";

export const getStudents = (queryString?: string): Promise<SafeUserWithProfileWithDapartment[]> => {
  if (!queryString) {
    return axios.get("/api/students").then((response) => response.data);
  } else {
    return axios.get(`/api/students?${queryString}`).then((response) => response.data);
  }
};
