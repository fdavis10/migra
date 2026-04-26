import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { CITIZENSHIP_OPTIONS, REGION_OPTIONS } from "../../constants/formOptions.js";
import { submitLead } from "../../api/leads.js";
import { Button } from "../ui/Button.jsx";
import styles from "./LeadForm.module.css";

const phonePattern = /^[\d\s+()\-]{10,}$/;

export function LeadForm({ defaultService = "", onSuccess, compact = false }) {
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
          Имя
          <input className={styles.input} type="text" {...register("name")} />
        </label>
      ) : null}
      <label className={styles.label}>
        Телефон *
        <input
          className={styles.input}
          type="tel"
          autoComplete="tel"
          {...register("phone", {
            required: "Укажите телефон",
            pattern: { value: phonePattern, message: "Проверьте формат телефона" },
          })}
        />
        {errors.phone ? <span className={styles.err}>{errors.phone.message}</span> : null}
      </label>
      <label className={styles.label}>
        Гражданство
        <select className={styles.input} {...register("citizenship")}>
          <option value="">Выберите</option>
          {CITIZENSHIP_OPTIONS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>
      <label className={styles.label}>
        Регион
        <select className={styles.input} {...register("region")}>
          <option value="">Выберите</option>
          {REGION_OPTIONS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>
      {!compact ? (
        <label className={styles.label}>
          Услуга
          <input className={styles.input} type="text" {...register("service")} />
        </label>
      ) : null}
      {!compact ? (
        <label className={styles.label}>
          Сообщение
          <textarea className={styles.textarea} rows={3} {...register("message")} />
        </label>
      ) : null}
      <label className={styles.check}>
        <input type="checkbox" {...register("consent", { required: true })} />
        <span>Согласие с политикой конфиденциальности *</span>
      </label>
      {errors.consent ? <span className={styles.err}>Необходимо согласие</span> : null}
      <Button type="submit" variant="primary" disabled={isSubmitting}>
        {isSubmitting ? "Отправка…" : compact ? "Перезвоните мне" : "Отправить"}
      </Button>
    </form>
  );
}
