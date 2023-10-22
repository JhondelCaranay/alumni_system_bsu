import { SafeUserWithProfileWithDapartment } from "@/types/types";
import axios from "axios";

export const getStudents = (queryString: string): Promise<SafeUserWithProfileWithDapartment[]> =>
  axios.get(`/api/students${queryString}`).then((response) => response.data);
