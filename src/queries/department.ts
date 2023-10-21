import { SafeDeparment } from "@/types/types";
import axios from "axios";

export const getDeparments = (): Promise<SafeDeparment[]> =>
  axios.get("/api/departments").then((response) => response.data);
