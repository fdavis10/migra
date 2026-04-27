import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { CITIZENSHIP_OPTIONS, REGION_OPTIONS } from "../../constants/formOptions.js";
import { submitLead } from "../../api/leads.js";
import { useTranslation } from "@/i18n/useTranslation";
import { Button } from "../ui/Button.jsx";
import styles from "./LeadForm.module.css";

const phonePattern = /^[\d\s+()\-]{10,}$/;

export function LeadForm({ defaultService = "", onSuccess, compact = false }) {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      phone: "",
      citizenship: "",
      region: "",
      service: defaultService,
      message: "",
      consent: false,
    },
  });

  useEffect(() => {
    setValue("service", defaultService || "");
  }, [defaultService, setValue]);

  async function onSubmit(values) {
    await submitLead({
      name: values.name,
      phone: values.phone,
      citizenship: values.citizenship,
      region: values.region,
      service: values.service,
      message: values.message,
      source_page: pathname,
    });
    reset();
    onSuccess?.();
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      {!compact ? (
        <label className={styles.label}>
          {t("leadForm.name")}
          <input className={styles.input} type="text" {...register("name")} />
        </label>
      ) : null}
      <label className={styles.label}>
        {t("leadForm.phone")} *
        <input
          className={styles.input}
          type="tel"
          autoComplete="tel"
          {...register("phone", {
            required: t("leadForm.phoneRequired"),
            pattern: { value: phonePattern, message: t("leadForm.phonePattern") },
          })}
        />
        {errors.phone ? <span className={styles.err}>{errors.phone.message}</span> : null}
      </label>
      <label className={styles.label}>
        {t("leadForm.citizenship")}
        <select className={styles.input} {...register("citizenship")}>
          <option value="">{t("leadForm.choose")}</option>
          {CITIZENSHIP_OPTIONS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>
      <label className={styles.label}>
        {t("leadForm.region")}
        <select className={styles.input} {...register("region")}>
          <option value="">{t("leadForm.choose")}</option>
          {REGION_OPTIONS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>
      {!compact ? (
        <label className={styles.label}>
          {t("leadForm.service")}
          <input className={styles.input} type="text" {...register("service")} />
        </label>
      ) : null}
      {!compact ? (
        <label className={styles.label}>
          {t("leadForm.message")}
          <textarea className={styles.textarea} rows={3} {...register("message")} />
        </label>
      ) : null}
      <label className={styles.check}>
        <input type="checkbox" {...register("consent", { required: true })} />
        <span>{t("leadForm.consentPrivacy")}</span>
      </label>
      {errors.consent ? <span className={styles.err}>{t("leadForm.consentNeeded")}</span> : null}
      <Button type="submit" variant="primary" disabled={isSubmitting}>
        {isSubmitting ? t("leadForm.sending") : compact ? t("leadForm.submitCallback") : t("leadForm.submitSend")}
      </Button>
    </form>
  );
}
