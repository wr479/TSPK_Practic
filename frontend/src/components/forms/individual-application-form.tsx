"use client";

import { useMemo, useState } from "react";
import type { CityDto, ParticipationFormatDto } from "@/lib/api";
import { submitIndividualApplication, ApiError } from "@/lib/api";

type Option = {
  value: string;
  label: string;
};

const initialState = {
  fullName: "",
  phone: "",
  email: "",
  cityId: "",
  participationFormatId: "",
  comment: "",
};

type FormState = typeof initialState;

type Props = {
  cities: CityDto[];
  participationFormats: ParticipationFormatDto[];
};

export function IndividualApplicationForm({ cities, participationFormats }: Props) {
  const [form, setForm] = useState<FormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const cityOptions = useMemo<Option[]>(
    () =>
      cities
        .filter((city) => city.isActive)
        .map((city) => ({ value: city.id, label: city.name })),
    [cities],
  );

  const formatOptions = useMemo<Option[]>(
    () =>
      participationFormats
        .filter((format) => format.isActive)
        .map((format) => ({ value: format.id, label: format.name })),
    [participationFormats],
  );

  const handleChange = (field: keyof FormState) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const resetForm = () => {
    setForm(initialState);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      await submitIndividualApplication({
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        cityId: form.cityId,
        participationFormatId: form.participationFormatId,
        comment: form.comment.trim() || undefined,
      });

      setSuccessMessage("Заявка отправлена. Координатор свяжется в течение двух рабочих дней.");
      resetForm();
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Не удалось отправить заявку. Попробуйте ещё раз позднее.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm text-muted">
          ФИО
          <input
            type="text"
            name="fullName"
            value={form.fullName}
            onChange={handleChange("fullName")}
            required
            className="rounded-xl border border-stroke bg-[#F2F6ED] px-4 py-3 text-sm text-foreground outline-none transition focus:border-[#4CAF50]"
            placeholder="Иван Иванов"
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
            placeholder="user@example.ru"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-muted">
          Город
          <select
            name="cityId"
            value={form.cityId}
            onChange={handleChange("cityId")}
            required
            className="rounded-xl border border-stroke bg-[#F2F6ED] px-4 py-3 text-sm text-foreground outline-none transition focus:border-[#4CAF50]"
          >
            <option value="">Выберите город</option>
            {cityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="md:col-span-2 flex flex-col gap-2 text-sm text-muted">
          Формат участия
          <select
            name="participationFormatId"
            value={form.participationFormatId}
            onChange={handleChange("participationFormatId")}
            required
            className="rounded-xl border border-stroke bg-[#F2F6ED] px-4 py-3 text-sm text-foreground outline-none transition focus:border-[#4CAF50]"
          >
            <option value="">Выберите формат</option>
            {formatOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="flex flex-col gap-2 text-sm text-muted">
        Комментарий
        <textarea
          name="comment"
          value={form.comment}
          onChange={handleChange("comment")}
          rows={4}
          className="rounded-xl border border-stroke bg-[#F2F6ED] px-4 py-3 text-sm text-foreground outline-none transition focus:border-[#4CAF50]"
          placeholder="Дополнительная информация"
        />
      </label>
      {successMessage ? (
        <p className="rounded-xl border border-[#C9ECCE] bg-[#F2FBF3] px-4 py-3 text-sm text-[#2E7D32]">
          {successMessage}
        </p>
      ) : null}
      {errorMessage ? (
        <p className="rounded-xl border border-[#F8D7DA] bg-[#FFF5F5] px-4 py-3 text-sm text-[#C62828]">
          {errorMessage}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary justify-center disabled:cursor-not-allowed disabled:opacity-80"
      >
        {isSubmitting ? "Отправляем..." : "Отправить заявку"}
      </button>
    </form>
  );
}
