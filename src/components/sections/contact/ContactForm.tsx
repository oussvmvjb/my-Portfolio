"use client";

import { useState } from "react";
import { z } from "zod";
import type { ContactContent } from "@/types/content";
import Button from "@/components/ui/Button";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";

const createContactSchema = (validation: { required: string; email: string }) =>
  z.object({
    name: z.string().min(1, { message: validation.required }),
    email: z.string().min(1, { message: validation.required }).email({ message: validation.email }),
    subject: z.string().min(1, { message: validation.required }),
    message: z.string().min(5, { message: validation.required }),
  });

export default function ContactForm({
  formContent,
}: {
  formContent: ContactContent["form"];
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const schema = createContactSchema(formContent.validation);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0].toString()] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-start" noValidate>
      {/* Name and Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="contact-name" className="block text-xs font-semibold text-fg mb-1">
            {formContent.name} *
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className={`w-full rounded-xl border bg-surface px-4 py-2.5 text-sm text-fg transition-all focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.name ? "border-red-500" : "border-border hover:border-primary/40"
            }`}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-500">{errors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="contact-email" className="block text-xs font-semibold text-fg mb-1">
            {formContent.email} *
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full rounded-xl border bg-surface px-4 py-2.5 text-sm text-fg transition-all focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.email ? "border-red-500" : "border-border hover:border-primary/40"
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email}</p>
          )}
        </div>
      </div>

      {/* Subject */}
      <div>
        <label htmlFor="contact-subject" className="block text-xs font-semibold text-fg mb-1">
          {formContent.subject} *
        </label>
        <input
          id="contact-subject"
          name="subject"
          type="text"
          value={formData.subject}
          onChange={handleChange}
          className={`w-full rounded-xl border bg-surface px-4 py-2.5 text-sm text-fg transition-all focus:outline-none focus:ring-2 focus:ring-primary ${
            errors.subject ? "border-red-500" : "border-border hover:border-primary/40"
          }`}
        />
        {errors.subject && (
          <p className="mt-1 text-xs text-red-500">{errors.subject}</p>
        )}
      </div>

      {/* Message */}
      <div>
        <label htmlFor="contact-message" className="block text-xs font-semibold text-fg mb-1">
          {formContent.message} *
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          value={formData.message}
          onChange={handleChange}
          className={`w-full rounded-xl border bg-surface px-4 py-2.5 text-sm text-fg transition-all focus:outline-none focus:ring-2 focus:ring-primary resize-y ${
            errors.message ? "border-red-500" : "border-border hover:border-primary/40"
          }`}
        />
        {errors.message && (
          <p className="mt-1 text-xs text-red-500">{errors.message}</p>
        )}
      </div>

      {/* Status Messages */}
      {status === "success" && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-sm">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>{formContent.success}</span>
        </div>
      )}

      {status === "error" && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 text-sm">
          <AlertCircle className="size-4 shrink-0" />
          <span>{formContent.error}</span>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={status === "sending"}
        className="w-full sm:w-auto"
      >
        <Send className="size-4" />
        <span>{status === "sending" ? formContent.sending : formContent.send}</span>
      </Button>
    </form>
  );
}
