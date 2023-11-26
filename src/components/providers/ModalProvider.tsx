import React, { useEffect, useState } from 'react'
import ImportStudentsModal from '../modals/ImportStudentsModal'
import ArchiveUserModal from '../modals/ArchiveUserModal';
import CreateEventModal from '../modals/CreateEventModal';
import ViewEventModal from '../modals/ViewEventModal';
import CreateDiscussionModal from '../modals/CreateDiscussionModal';
import CreateGuardianModal from '../modals/CreateGuardianModal';
import UpdateGuardianModal from '../modals/UpdateGuardianModal';
import DeleteGurdianModal from '../modals/DeleteGuardianModal';
import DeletePostModal from '../modals/DeletePostModal';
import EditDiscussionModal from '../modals/EditDiscussionModal';

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true)
  }, [])

  if(!isMounted) {
    return null
  }
   
  return (
    <>
        <ArchiveUserModal />
        <ImportStudentsModal />
        <CreateEventModal />
        <ViewEventModal />
        <CreateDiscussionModal />
        <CreateGuardianModal />
        <UpdateGuardianModal />
        <DeleteGurdianModal />
        <DeletePostModal />
        <EditDiscussionModal />
    </>
  )
}

export default ModalProvider