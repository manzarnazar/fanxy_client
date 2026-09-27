import { AtSign, Calendar, CheckCircle2, Mail, Phone, User, UserRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { UpdateProfileInput } from "@/features/settings/types/settings.types";

const GENDER_OPTIONS = ["Male", "Female", "Other", "Prefer not to say"];
const BIO_MAX_LENGTH = 200;

interface SettingsPersonalInfoFormProps {
  form: UpdateProfileInput;
  onFieldChange: <TKey extends keyof UpdateProfileInput>(key: TKey, value: UpdateProfileInput[TKey]) => void;
}

interface FieldShellProps {
  label: string;
  optional?: boolean;
  filled: boolean;
  children: React.ReactNode;
}

/** Design-spec field: label turns cyan when filled, well gets a 1.5px cyan border + trailing mint check. */
function FieldShell({ label, optional = false, filled, children }: FieldShellProps) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label className={cn("font-sans text-[11px] font-medium", filled ? "text-primary-light" : "text-text-secondary/60")}>
          {label}
        </label>
        {optional && <span className="font-sans text-[9.5px] font-light text-text-secondary/45">Optional</span>}
      </div>
      {children}
    </div>
  );
}

function fieldWellClassName(filled: boolean): string {
  return cn(
    "flex h-12 items-center gap-2.5 rounded-[13px] border-[1.5px] bg-surface-elevated/70 px-3.5 transition-colors",
    filled ? "border-primary/50" : "border-primary/16",
  );
}

function FieldIcon({ icon: Icon, filled }: { icon: LucideIcon; filled: boolean }) {
  return <Icon className={cn("h-4 w-4 shrink-0", filled ? "text-primary-light" : "text-primary-light/55")} aria-hidden="true" />;
}

function FilledCheck({ filled }: { filled: boolean }) {
  if (!filled) return null;
  return <CheckCircle2 className="h-[17px] w-[17px] shrink-0 text-success" aria-hidden="true" />;
}

const INPUT_CLASSNAME =
  "min-w-0 flex-1 bg-transparent font-sans text-[14px] text-text-primary outline-none placeholder:text-placeholder";

export function SettingsPersonalInfoForm({ form, onFieldChange }: SettingsPersonalInfoFormProps) {
  return (
    <div className="rounded-[22px] border border-primary/14 bg-surface/50 p-6">
      <div className="mb-4.5 flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/14 text-primary-light">
          <UserRound className="h-[21px] w-[21px]" aria-hidden="true" />
        </span>
        <div>
          <div className="font-display text-[21px] leading-none font-semibold text-text-primary">Personal Information</div>
          <div className="mt-1 font-sans text-[12px] font-light text-text-secondary/60">
            This information appears on your public profile.
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        <FieldShell label="Full Name" filled={form.fullName.length > 0}>
          <div className={fieldWellClassName(form.fullName.length > 0)}>
            <FieldIcon icon={User} filled={form.fullName.length > 0} />
            <input
              value={form.fullName}
              onChange={(event) => onFieldChange("fullName", event.target.value)}
              className={INPUT_CLASSNAME}
            />
            <FilledCheck filled={form.fullName.length > 0} />
          </div>
        </FieldShell>

        <FieldShell label="Username" filled={form.username.length > 0}>
          <div className={fieldWellClassName(form.username.length > 0)}>
            <FieldIcon icon={AtSign} filled={form.username.length > 0} />
            <input
              value={form.username}
              onChange={(event) => onFieldChange("username", event.target.value)}
              className={INPUT_CLASSNAME}
            />
            <FilledCheck filled={form.username.length > 0} />
          </div>
        </FieldShell>

        <FieldShell label="Email Address" filled={form.email.length > 0}>
          <div className={fieldWellClassName(form.email.length > 0)}>
            <FieldIcon icon={Mail} filled={form.email.length > 0} />
            <input
              value={form.email}
              onChange={(event) => onFieldChange("email", event.target.value)}
              type="email"
              className={INPUT_CLASSNAME}
            />
            <FilledCheck filled={form.email.length > 0} />
          </div>
        </FieldShell>

        <FieldShell label="Mobile Number" optional filled={form.mobileNumber.length > 0}>
          <div className={fieldWellClassName(form.mobileNumber.length > 0)}>
            <FieldIcon icon={Phone} filled={form.mobileNumber.length > 0} />
            <input
              value={form.countryCode}
              onChange={(event) => onFieldChange("countryCode", event.target.value)}
              placeholder="+1"
              aria-label="Country code"
              className="w-11 shrink-0 bg-transparent font-sans text-[14px] text-text-primary outline-none placeholder:text-placeholder"
            />
            <span className="h-5 w-px shrink-0 bg-primary/16" aria-hidden="true" />
            <input
              value={form.mobileNumber}
              onChange={(event) => onFieldChange("mobileNumber", event.target.value)}
              aria-label="Mobile number"
              className={INPUT_CLASSNAME}
            />
            <FilledCheck filled={form.mobileNumber.length > 0} />
          </div>
        </FieldShell>

        <FieldShell label="Date of Birth" optional filled={form.dateOfBirth.length > 0}>
          <div className={fieldWellClassName(form.dateOfBirth.length > 0)}>
            <FieldIcon icon={Calendar} filled={form.dateOfBirth.length > 0} />
            <input
              value={form.dateOfBirth}
              onChange={(event) => onFieldChange("dateOfBirth", event.target.value)}
              type="date"
              aria-label="Date of birth"
              className={INPUT_CLASSNAME}
            />
            <FilledCheck filled={form.dateOfBirth.length > 0} />
          </div>
        </FieldShell>

        <FieldShell label="Gender" optional filled={form.gender.length > 0}>
          <div className={fieldWellClassName(form.gender.length > 0)}>
            <FieldIcon icon={UserRound} filled={form.gender.length > 0} />
            <select
              value={form.gender}
              onChange={(event) => onFieldChange("gender", event.target.value)}
              aria-label="Gender"
              className="min-w-0 flex-1 bg-transparent font-sans text-[14px] text-text-primary outline-none"
            >
              <option value="" className="bg-surface-elevated">
                Prefer not to say
              </option>
              {GENDER_OPTIONS.map((option) => (
                <option key={option} value={option} className="bg-surface-elevated">
                  {option}
                </option>
              ))}
            </select>
            <FilledCheck filled={form.gender.length > 0} />
          </div>
        </FieldShell>

        <div className="sm:col-span-2">
          <div className="mb-1.5 flex items-center justify-between">
            <label
              className={cn(
                "font-sans text-[11px] font-medium",
                form.bio.length > 0 ? "text-primary-light" : "text-text-secondary/60",
              )}
            >
              Bio
            </label>
            <span className="font-sans text-[10px] font-light text-text-secondary/45">
              {form.bio.length}/{BIO_MAX_LENGTH}
            </span>
          </div>
          <textarea
            value={form.bio}
            onChange={(event) => onFieldChange("bio", event.target.value.slice(0, BIO_MAX_LENGTH))}
            placeholder="Tell people about yourself…"
            rows={3}
            className={cn(
              "w-full resize-none rounded-[13px] border-[1.5px] bg-surface-elevated/70 px-3.5 py-3 font-sans text-[14px] leading-relaxed text-text-primary outline-none placeholder:text-placeholder",
              form.bio.length > 0 ? "border-primary/50" : "border-primary/16",
            )}
          />
        </div>
      </div>
    </div>
  );
}
