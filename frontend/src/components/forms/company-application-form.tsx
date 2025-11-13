"use client";

import { useMemo, useState } from "react";
import type { TariffDto } from "@/lib/api";
import { submitCompanyApplication, ApiError } from "@/lib/api";

const initialState = {
  companyName: "",
  contactPerson: "",
  phone: "",
  email: "",
  tariffId: "",
  comment: "",
};

type FormState = typeof initialState;

type Props = {
  tariffs: TariffDto[];
};

export function CompanyApplicationForm({ tariffs }: Props) {
  const [form, setForm] = useState<FormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const tariffOptions = useMemo(
    () =>
      tariffs
        .filter((tariff) => tariff.isActive)
        .map((tariff) => ({
          value: tariff.id,
          label: tariff.price ? `${tariff.name} — ${formatPrice(tariff.price)}` : tariff.name,
        })),
    [tariffs],
  );

  const hasTariffs = tariffOptions.length > 0;

  const handleChange = (field: keyof FormState) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const resetForm = () => setForm(initialState);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      await submitCompanyApplication({
        companyName: form.companyName.trim(),
        contactPerson: form.contactPerson.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        tariffId: form.tariffId,
        comment: form.comment.trim() || undefined,
      });

      setSuccessMessage("Заявка отправлена. Мы свяжемся с вашим представителем в ближайшее время.");
      resetForm();
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Не удалось отправить заявку. Попробуйте позже.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 rounded-[28px] border border-[#D9E8D1] bg-white p-8 shadow-soft md:grid-cols-2">
      <label className="flex flex-col gap-2 text-sm text-muted">
        Название компании
        <input
          type="text"
          name="companyName"
          value={form.companyName}
          onChange={handleChange("companyName")}
          required
          className="rounded-xl border border-stroke bg-[#F2F6ED] px-4 py-3 text-sm text-foreground outline-none transition focus:border-[#4CAF50]"
          placeholder="ООО «Пример»"
        />
      </label>
      <label className="flex flex-col gap-2 text-sm text-muted">
        Контактное лицо
        <input
          type="text"
          name="contactPerson"
          value={form.contactPerson}
          onChange={handleChange("contactPerson")}
          required
          className="rounded-xl border border-stroke bg-[#F2F6ED] px-4 py-3 text-sm text-foreground outline-none transition focus:border-[#4CAF50]"
          placeholder="Иван Петров"
        />
      </label>
      <label className="flex flex-col gap-2 text-sm text-muted">
        Телефон
        <input
          type="tel"
          name="phone"
          value={form.phone}
          onChange={handleChange("phone")}
          required
          className="rounded-xl border border-stroke bg-[#F2F6ED] px-4 py-3 text-sm text-foreground outline-none transition focus:border-[#4CAF50]"
          placeholder="+7 (999) 000-00-00"
        />
      </label>
      <label className="flex flex-col gap-2 text-sm text-muted">
        Email
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange("email")}
          required
          className="rounded-xl border border-stroke bg-[#F2F6ED] px-4 py-3 text-sm text-foreground outline-none transition focus:border-[#4CAF50]"
          placeholder="company@forest.ru"
        />
      </label>
      <label className="flex flex-col gap-2 text-sm text-muted">
        Тариф
        <select
          name="tariffId"
          value={form.tariffId}
          onChange={handleChange("tariffId")}
          required
          disabled={!hasTariffs}
          className="rounded-xl border border-stroke bg-[#F2F6ED] px-4 py-3 text-sm text-foreground outline-none transition focus:border-[#4CAF50] disabled:opacity-60"
        >
          <option value="" disabled={!hasTariffs}>
            {hasTariffs ? "Выберите тариф" : "Тарифы появятся позже"}
          </option>
          {tariffOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <label className="md:col-span-2 flex flex-col gap-2 text-sm text-muted">
        Комментарий
        <textarea
          name="comment"
          value={form.comment}
          onChange={handleChange("comment")}
          rows={4}
          className="rounded-xl border border-stroke bg-[#F2F6ED] px-4 py-3 text-sm text-foreground outline-none transition focus:border-[#4CAF50]"
          placeholder="Расскажите о желаемом формате участия"
        />
      </label>
      {successMessage ? (
        <p className="md:col-span-2 rounded-xl border border-[#C9ECCE] bg-[#F2FBF3] px-4 py-3 text-sm text-[#2E7D32]">
          {successMessage}
        </p>
      ) : null}
      {errorMessage ? (
        <p className="md:col-span-2 rounded-xl border border-[#F8D7DA] bg-[#FFF5F5] px-4 py-3 text-sm text-[#C62828]">
          {errorMessage}
        </p>
      ) : null}
      <div className="md:col-span-2 flex justify-center">
        <button
          type="submit"
          disabled={isSubmitting || !hasTariffs}
          className="btn-primary inline-flex w-full max-w-xs justify-center disabled:cursor-not-allowed disabled:opacity-80"
        >
          {isSubmitting ? "Отправляем..." : hasTariffs ? "Отправить заявку" : "Нет тарифов"}
        </button>
      </div>
    </form>
  );
}

function formatPrice(value: number) {
  return value.toLocaleString("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  });
}
