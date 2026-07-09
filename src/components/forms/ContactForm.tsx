"use client";

import { useState } from "react";
import { z as zodZ } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Locale } from "@/lib/i18n/config";

const translations = {
  tr: {
    nameLabel: "AD SOYAD *",
    namePlaceholder: "Adınız Soyadınız",
    emailLabel: "E-POSTA ADRESİ *",
    emailPlaceholder: "ornek@mail.com",
    phoneLabel: "TELEFON NUMARASI",
    phonePlaceholder: "+90 555 000 00 00",
    subjectLabel: "KONU",
    subjectPlaceholder: "Mesajınızın konusu",
    messageLabel: "MESAJINIZ *",
    messagePlaceholder: "Mesajınızı buraya yazın...",
    submitLoading: "GÖNDERİLİYOR...",
    submitLabel: "GÖNDER",
    errorGeneric: "Bir hata oluştu. Lütfen tekrar deneyin.",
    validationName: "İsim en az 2 karakter olmalı",
    validationEmail: "Geçerli bir e-posta girin",
    validationMessage: "Mesaj en az 10 karakter olmalı",
  },
  en: {
    nameLabel: "FULL NAME *",
    namePlaceholder: "Your Full Name",
    emailLabel: "EMAIL ADDRESS *",
    emailPlaceholder: "example@mail.com",
    phoneLabel: "PHONE NUMBER",
    phonePlaceholder: "+90 555 000 00 00",
    subjectLabel: "SUBJECT",
    subjectPlaceholder: "Subject of your message",
    messageLabel: "YOUR MESSAGE *",
    messagePlaceholder: "Write your message here...",
    submitLoading: "SENDING...",
    submitLabel: "SUBMIT",
    errorGeneric: "An error occurred. Please try again.",
    validationName: "Name must be at least 2 characters",
    validationEmail: "Please enter a valid email",
    validationMessage: "Message must be at least 10 characters",
  }
};

type FormData = {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
};

type Status = "idle" | "loading" | "success" | "error";
type FieldErrors = Partial<Record<keyof FormData, string[]>>;

type ContactFormProps = {
  formTitle?: string;
  successMessage?: string;
  locale: Locale;
};

export function ContactForm({
  formTitle = "Bize Ulaşın",
  successMessage = "Mesajınız alındı. En kısa sürede size dönüş yapacağız.",
  locale,
}: ContactFormProps) {
  const t = translations[locale] || translations.tr;
  const [status, setStatus] = useState<Status>("idle");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const schema = zodZ.object({
    name: zodZ.string().min(2, t.validationName),
    email: zodZ.string().email(t.validationEmail),
    phone: zodZ.string().optional(),
    subject: zodZ.string().optional(),
    message: zodZ.string().min(10, t.validationMessage),
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Alan hatasını temizle
    if (fieldErrors[name as keyof FormData]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setFieldErrors({});

    // Client-side validasyon
    const result = schema.safeParse(formData);
    if (!result.success) {
      setFieldErrors(result.error.flatten().fieldErrors as FieldErrors);
      setStatus("idle");
      return;
    }

    // Honeypot alanını al
    const form = e.currentTarget;
    const honeypot = (form.elements.namedItem("website") as HTMLInputElement)?.value || "";

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, honeypot }),
      });

      if (res.ok) {
        setStatus("success");
      } else {
        const data = await res.json();
        if (data.error && typeof data.error === "object") {
          setFieldErrors(data.error);
        }
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-none border border-neutral-200 bg-neutral-50 p-8 md:p-12 text-center space-y-4">
        <div className="text-4xl text-black">✓</div>
        <p className="text-base font-sans text-neutral-800 leading-relaxed font-light">{successMessage}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {formTitle && (
        <h3 className="text-xl sm:text-2xl font-serif font-medium uppercase tracking-wider text-black border-b border-neutral-200 pb-4 mb-6">
          {formTitle}
        </h3>
      )}

      {/* Honeypot — spam botları için gizli alan */}
      <div className="absolute opacity-0 pointer-events-none h-0 overflow-hidden" aria-hidden="true">
        <input name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2 flex flex-col">
          <Label htmlFor="name" className="text-xs font-bold tracking-widest uppercase text-neutral-800">
            {t.nameLabel}
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder={t.namePlaceholder}
            aria-invalid={!!fieldErrors.name}
          />
          {fieldErrors.name && (
            <p className="text-xs text-red-600 font-sans tracking-wide mt-1 font-medium">{fieldErrors.name[0]}</p>
          )}
        </div>

        <div className="space-y-2 flex flex-col">
          <Label htmlFor="email" className="text-xs font-bold tracking-widest uppercase text-neutral-800">
            {t.emailLabel}
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder={t.emailPlaceholder}
            aria-invalid={!!fieldErrors.email}
          />
          {fieldErrors.email && (
            <p className="text-xs text-red-600 font-sans tracking-wide mt-1 font-medium">{fieldErrors.email[0]}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2 flex flex-col">
          <Label htmlFor="phone" className="text-xs font-bold tracking-widest uppercase text-neutral-800">
            {t.phoneLabel}
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone || ""}
            onChange={handleChange}
            placeholder={t.phonePlaceholder}
          />
        </div>

        <div className="space-y-2 flex flex-col">
          <Label htmlFor="subject" className="text-xs font-bold tracking-widest uppercase text-neutral-800">
            {t.subjectLabel}
          </Label>
          <Input
            id="subject"
            name="subject"
            value={formData.subject || ""}
            onChange={handleChange}
            placeholder={t.subjectPlaceholder}
          />
        </div>
      </div>

      <div className="space-y-2 flex flex-col">
        <Label htmlFor="message" className="text-xs font-bold tracking-widest uppercase text-neutral-800">
          {t.messageLabel}
        </Label>
        <Textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder={t.messagePlaceholder}
          rows={6}
          aria-invalid={!!fieldErrors.message}
        />
        {fieldErrors.message && (
          <p className="text-xs text-red-600 font-sans tracking-wide mt-1 font-medium">{fieldErrors.message[0]}</p>
        )}
      </div>

      {status === "error" && (
        <p className="text-xs text-red-600 font-sans tracking-wide font-medium">
          {t.errorGeneric}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full sm:w-auto inline-flex items-center justify-center bg-black text-white border border-black hover:bg-neutral-900 hover:text-white transition-all duration-300 uppercase tracking-[0.2em] text-xs font-semibold py-4 px-8 rounded-none cursor-pointer text-center disabled:opacity-50"
      >
        {status === "loading" ? t.submitLoading : t.submitLabel}
      </button>
    </form>
  );
}
