import { GetCurrentUserType } from "@/actions/getCurrentUser";
import { CommentSchemaType } from "@/schema/comment";
import { GuardianSchemaType } from "@/schema/guardian";
import { JobSchemaType } from "@/schema/jobs";
import { PostSchemaType } from "@/schema/post";
import {
  UserProfileWithDepartmentSection,
  UserWithProfile,
} from "@/types/types";
import { create } from "zustand";

export type ModalType =
  | "importStudents"
  | "archiveUser"
  | "createEvent"
  | "viewEvent"
  | "viewOnlyEvent"
  | "createDiscussion"
  | "createGuardian"
  | "updateGuardian"
  | "deleteGuardian"
  | "deletePost"
  | "editDiscussion"
  | "deleteComment"
  | "createWorkExperience"
  | "deleteWorkExperience"
  | "updateWorkExperience"
  | "createGroupChat"
  | "addNewMember"
// you can extend this type if you have more modal

// export type ModalType = "..." | "...." | "...."

type ModalData = {
  user?:
    | UserWithProfile
    | UserProfileWithDepartmentSection
    | GetCurrentUserType;
  calendarApi?: any;
  guardian?: GuardianSchemaType;
  post?: PostSchemaType;
  comment?: CommentSchemaType;
  workExperience?: JobSchemaType
};

type ModalStore = {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
};

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onClose: () => set({ type: null, isOpen: false }),
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
}));
