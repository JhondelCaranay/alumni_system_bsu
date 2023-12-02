import {
  SectionSchemaType,
  CreateSectionSchemaType,
  UpdateSectionSchemaType,
} from "@/schema/section";
import axios from "axios";

export const getSections = (): Promise<SectionSchemaType[]> =>
  axios.get("/api/sections").then((response) => response.data);

export const createSection = (
  data: CreateSectionSchemaType
): Promise<SectionSchemaType> =>
  axios.post("/api/sections", data).then((response) => response.data);

export const updateSection = (
  sectionId: string,
  data: UpdateSectionSchemaType
): Promise<SectionSchemaType> =>
  axios
    .patch(`/api/sections/${sectionId}`, data)
    .then((response) => response.data);
