import { useState } from "react";
import { useLeadModal } from "../../context/LeadModalContext.jsx";
import { useTranslation } from "@/i18n/useTranslation";
import { Modal } from "../ui/Modal.jsx";
import { LeadForm } from "../sections/LeadForm.jsx";
import styles from "./GlobalLeadModal.module.css";

export function GlobalLeadModal() {
  const { t } = useTranslation();
  const { open, closeModal, presetService } = useLeadModal();
  const [done, setDone] = useState(false);

  return (
    <Modal
      open={open}
      onClose={() => {
        setDone(false);
        closeModal();
      }}
      title={t("modal.leadTitle")}
    >
      {done ? (
        <p className={styles.ok}>{t("modal.leadSuccess")}</p>
      ) : (
        <>
          <p className={styles.hint}>{t("modal.leadHint")}</p>
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
