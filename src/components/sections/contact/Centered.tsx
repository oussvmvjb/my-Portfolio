import type { SectionProps } from "../registry";
import SectionHeading from "@/components/ui/SectionHeading";
import Card from "@/components/ui/Card";
import ContactForm from "./ContactForm";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactCentered({ content }: SectionProps) {
  const { contact, person } = content;

  return (
    <div className="space-y-12 max-w-3xl mx-auto">
      <SectionHeading
        title={contact.title}
        subtitle={contact.subtitle}
        align="center"
      />

      {/* Quick info badges row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div className="p-4 rounded-2xl bg-surface border border-border flex flex-col items-center">
          <Mail className="size-5 text-primary mb-1" />
          <p className="text-xs text-muted uppercase font-semibold">{contact.info.email}</p>
          <a
            href={`mailto:${person.email}`}
            className="text-xs sm:text-sm font-bold text-fg hover:text-primary transition-colors mt-1"
          >
            {person.email}
          </a>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-border flex flex-col items-center">
          <Phone className="size-5 text-primary mb-1" />
          <p className="text-xs text-muted uppercase font-semibold">{contact.info.phone}</p>
          <a
            href={`tel:${person.phones[0]?.replace(/\s+/g, "")}`}
            className="text-xs sm:text-sm font-bold text-fg hover:text-primary transition-colors mt-1"
          >
            {person.phones[0]}
          </a>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-border flex flex-col items-center">
          <MapPin className="size-5 text-primary mb-1" />
          <p className="text-xs text-muted uppercase font-semibold">{contact.info.location}</p>
          <p className="text-xs sm:text-sm font-bold text-fg mt-1">
            {person.location.split("/")[0]}
          </p>
        </div>
      </div>

      {/* Centered Form */}
      <Card className="p-6 sm:p-10 shadow-xl">
        <ContactForm formContent={contact.form} />
      </Card>
    </div>
  );
}
