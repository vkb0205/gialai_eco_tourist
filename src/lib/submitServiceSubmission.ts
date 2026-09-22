import { isSupabaseConfigured, supabase } from "@/lib/supabase"

export type ServiceSubmissionKey = "general" | "car" | "visa" | "flight"

export type ServiceSubmissionInput = {
  serviceKey: ServiceSubmissionKey
  contactName: string
  phone: string
  email?: string
  preferredContactTime?: string
  details: Record<string, string>
  sourcePath?: string
  privacyConsent: boolean
}

const missingConfigurationMessage =
  "Biểu mẫu chưa được kết nối với hệ thống lưu trữ. Vui lòng gọi trực tiếp cho chúng tôi."

/**
 * Persist a website enquiry without returning the inserted row to the public
 * browser. The database policy intentionally allows INSERT only.
 */
export async function submitServiceSubmission(
  input: ServiceSubmissionInput,
): Promise<void> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error(missingConfigurationMessage)
  }

  const { error } = await supabase.from("service_submissions").insert({
    service_key: input.serviceKey,
    contact_name: input.contactName.trim(),
    phone: input.phone.trim(),
    email: input.email?.trim() || null,
    preferred_contact_time: input.preferredContactTime?.trim() || null,
    details: input.details,
    source_path:
      input.sourcePath ||
      `${window.location.pathname}${window.location.search}${window.location.hash}`,
    privacy_consent: input.privacyConsent,
  })

  if (error) throw error
}

/** Convert an unknown submit error into a message safe to show to a visitor. */
export function submissionErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message === missingConfigurationMessage) {
    return error.message
  }

  return "Không thể ghi nhận yêu cầu lúc này. Vui lòng thử lại hoặc gọi trực tiếp cho chúng tôi."
}
