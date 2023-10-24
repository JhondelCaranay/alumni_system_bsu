import { SafeUserWithProfileWithDapartmentWithSection } from "@/types/types";
import axios from "axios";

import q from "query-string";

export type getStudentsQuery = {
  role?: string;
  schoolYear?: string;
  department?: string;
};

export const getStudents = ({
  role,
  schoolYear,
  department,
}: getStudentsQuery): Promise<SafeUserWithProfileWithDapartmentWithSection[]> => {
  let query = q.stringify(
    {
      role,
      schoolYear,
      department,
    },
    {
      skipEmptyString: true,
      skipNull: true,
    }
  );

  if (!query) {
    return axios.get("/api/students").then((response) => response.data);
  } else {
    return axios.get(`/api/students?${query}`).then((response) => response.data);
  }
};
