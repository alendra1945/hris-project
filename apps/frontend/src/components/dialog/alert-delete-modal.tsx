import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useModal } from '@/hooks/use-modal-store';
import { modalEventSubject } from '@/hooks/use-modal-store';
import { useSubscribe } from '@/hooks/use-subscribe';

export default function AlertDeleteModal() {
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === 'alertDelete';
  const alertData = data?.alertDeleteData;
  const handleClose = () => {
    onClose({ isConfirm: true });
  };
  const handleConfirm = () => {
    onClose({ isConfirm: true, detail: alertData?.detail });
  };
  return (
    <AlertDialog open={isModalOpen} onOpenChange={handleClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{alertData?.title || 'Are you absolutely sure?'}</AlertDialogTitle>
          <AlertDialogDescription>
            {alertData?.description || 'This action cannot be undone. This will permanently delete your data.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
