import React, { useEffect, useState } from 'react'
import ImportStudentsModal from '../modals/ImportStudentsModal'

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
        <ImportStudentsModal />
    </>
  )
}

export default ModalProvider