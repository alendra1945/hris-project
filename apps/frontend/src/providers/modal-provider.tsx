'use client';
import { useEffect, useState } from 'react';
import AlertDeleteModal from '@/components/dialog/alert-delete-modal';
export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);
  if (!isMounted) {
    return null;
  }
  return (
    <>
      <AlertDeleteModal />
    </>
  );
};
