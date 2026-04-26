import { useState } from "react";
import { useLeadModal } from "../../context/LeadModalContext.jsx";
import { Modal } from "../ui/Modal.jsx";
import { LeadForm } from "../sections/LeadForm.jsx";
import styles from "./GlobalLeadModal.module.css";

export function GlobalLeadModal() {
  const { open, closeModal, presetService } = useLeadModal();
  const [done, setDone] = useState(false);

  return (
    <Modal
      open={open}
      onClose={() => {
        setDone(false);
        closeModal();
      }}
      title="Бесплатная консультация"
    >
      {done ? (
        <p className={styles.ok}>Заявка отправлена. Мы свяжемся с вами в ближайшее время.</p>
      ) : (
        <>
          <p className={styles.hint}>Оставьте контакты — перезвоним и подскажем следующий шаг.</p>
          <LeadForm
            defaultService={presetService}
            compact={false}
            onSuccess={() => setDone(true)}
          />
        </>
      )}
    </Modal>
  );
}
