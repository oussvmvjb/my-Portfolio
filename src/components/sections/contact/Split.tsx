import type { SectionProps } from "../registry";
import SectionHeading from "@/components/ui/SectionHeading";
import Card from "@/components/ui/Card";
import ContactForm from "./ContactForm";
import { Mail, Phone, MapPin } from "lucide-react";
import { Github, Gitlab, Linkedin } from "@/components/ui/Icons";

export default function ContactSplit({ content }: SectionProps) {
  const { contact, person } = content;

  return (
    <div className="space-y-12">
      <SectionHeading title={contact.title} subtitle={contact.subtitle} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Info Column */}
        <div className="lg:col-span-5 space-y-4 text-start">
          {/* Email Card */}
          <Card className="p-5 flex items-center gap-4">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shrink-0">
              <Mail className="size-6" />
            </span>
            <div>
              <p className="text-xs text-muted font-semibold uppercase">{contact.info.email}</p>
              <a
                href={`mailto:${person.email}`}
                className="text-sm sm:text-base font-bold text-fg hover:text-primary transition-colors"
              >
                {person.email}
              </a>
            </div>
          </Card>

          {/* Phone Card */}
          <Card className="p-5 flex items-center gap-4">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shrink-0">
              <Phone className="size-6" />
            </span>
            <div>
              <p className="text-xs text-muted font-semibold uppercase">{contact.info.phone}</p>
              <div className="flex flex-col gap-0.5">
                {person.phones.map((phone) => (
                  <a
                    key={phone}
                    href={`tel:${phone.replace(/\s+/g, "")}`}
                    className="text-sm sm:text-base font-bold text-fg hover:text-primary transition-colors"
                  >
                    {phone}
                  </a>
                ))}
              </div>
            </div>
          </Card>

          {/* Location Card */}
          <Card className="p-5 flex items-center gap-4">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shrink-0">
              <MapPin className="size-6" />
            </span>
            <div>
              <p className="text-xs text-muted font-semibold uppercase">{contact.info.location}</p>
              <p className="text-sm sm:text-base font-bold text-fg">
                {person.location}
              </p>
            </div>
          </Card>

          {/* Socials card */}
          <Card className="p-5">
            <p className="text-xs text-muted font-semibold uppercase mb-3">Connect Online</p>
            <div className="flex items-center gap-3">
              {person.socials.github && (
                <a
                  href={person.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="p-3 rounded-xl border border-border bg-surface text-fg hover:border-primary hover:text-primary transition-colors"
                >
                  <Github className="size-5" />
                </a>
              )}
              {person.socials.gitlab && (
                <a
                  href={person.socials.gitlab}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitLab"
                  className="p-3 rounded-xl border border-border bg-surface text-fg hover:border-primary hover:text-primary transition-colors"
                >
                  <Gitlab className="size-5" />
                </a>
              )}
              {person.socials.linkedin && (
                <a
                  href={person.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="p-3 rounded-xl border border-border bg-surface text-fg hover:border-primary hover:text-primary transition-colors"
                >
                  <Linkedin className="size-5" />
                </a>
              )}
            </div>
          </Card>
        </div>

        {/* Right Form Column */}
        <div className="lg:col-span-7">
          <Card className="p-6 sm:p-10">
            <ContactForm formContent={contact.form} />
          </Card>
        </div>
      </div>
    </div>
  );
}
