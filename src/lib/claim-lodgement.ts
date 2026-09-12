import type { LodgeClaimInput } from "@/lib/api";

export type MobileClaimForm = {
  name: string;
  phone: string;
  email: string;
  employer: string;
  occupation: string;
  province: string;
  wage: string;
  idate: string;
  itype: string;
  location: string;
  desc: string;
};

export function buildClaimLodgementInput(
  form: MobileClaimForm,
  documentCount: number,
  declaration: boolean,
): LodgeClaimInput {
  const description = form.location.trim()
    ? `${form.desc.trim()} Location: ${form.location.trim()}`
    : form.desc.trim();

  return {
    workerName: form.name.trim(),
    workerPhone: form.phone.trim() || undefined,
    workerEmail: form.email.trim() || undefined,
    employerName: form.employer.trim(),
    province: form.province.trim() || undefined,
    occupation: form.occupation.trim() || undefined,
    weeklyWage: form.wage.trim() || undefined,
    injuryDate: form.idate.trim(),
    injuryType: form.itype.trim() || undefined,
    description,
    documentCount,
    declaration,
  };
}
