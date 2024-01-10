import React, { useEffect, useState } from "react";
import ImportStudentsModal from "../modals/ImportStudentsModal";
import ArchiveUserModal from "../modals/ArchiveUserModal";
import CreateEventModal from "../modals/CreateEventModal";
import ViewEventModal from "../modals/ViewEventModal";
import CreateDiscussionModal from "../modals/CreateDiscussionModal";
import CreateGuardianModal from "../modals/CreateGuardianModal";
import UpdateGuardianModal from "../modals/UpdateGuardianModal";
import DeleteGurdianModal from "../modals/DeleteGuardianModal";
import DeletePostModal from "../modals/DeletePostModal";
import EditDiscussionModal from "../modals/EditDiscussionModal";
import ViewOnylyEventModal from "../modals/ViewOnylyEventModal";
import DeleteCommentModal from "../modals/DeleteCommentModal";
import CreateWorkExperienceModal from "../modals/CreateWorkExperienceModal";
import DeleteWorkExperienceModal from "../modals/DeleteWorkExperienceModal";
import UpdateWorkExperienceModal from "../modals/UpdateWorkExperienceModal";
import CreateGroupChatModal from "../modals/CreateGroupChatModal";
import AddMemberModal from "../modals/AddMemberModal";
import RemoveMemberModal from "../modals/RemoveMemberModal";
import CreateStudentModal from "../modals/CreateStudentModal";
import BulkUpdateStudentsModal from "../modals/BulkUpdateStudentsModal";
import CreateUserModal from "../modals/CreateUserModal";
import ViewPhotoModal from "../modals/ViewPhotoModal";

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <ArchiveUserModal />
      <ImportStudentsModal />
      <CreateEventModal />
      <ViewEventModal />
      <ViewOnylyEventModal />
      <CreateDiscussionModal />
      <CreateGuardianModal />
      <UpdateGuardianModal />
      <DeleteGurdianModal />
      <DeletePostModal />
      <EditDiscussionModal />
      <DeleteCommentModal />
      <CreateWorkExperienceModal />
      <DeleteWorkExperienceModal />
      <UpdateWorkExperienceModal />
      <CreateGroupChatModal />
      <AddMemberModal />
      <RemoveMemberModal />
      <CreateStudentModal />
      <BulkUpdateStudentsModal />
      <CreateUserModal />
      <ViewPhotoModal />
    </>
  );
};

export default ModalProvider;
