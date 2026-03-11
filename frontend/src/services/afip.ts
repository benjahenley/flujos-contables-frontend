import { supabase } from "@/lib/supabase";

export interface GenerateCsrPayload {
  cuit: string;
  companyName: string;
  certName: string;
  environment: "DEV" | "PROD";
}

export interface GenerateCsrResponse {
  csrText: string;
  certRecordId: string;
}

class AfipApi {
  private static async getAuthHeaders(): Promise<Record<string, string>> {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return {
      Authorization: `Bearer ${session?.access_token || ""}`,
      "Content-Type": "application/json",
    };
  }

  async generateCsr(payload: GenerateCsrPayload): Promise<GenerateCsrResponse> {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/certificates/generate-csr`,
      {
        method: "POST",
        headers: await AfipApi.getAuthHeaders(),
        body: JSON.stringify(payload),
      }
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.message || "Error al generar el CSR");
    }
    return res.json();
  }

  async uploadCert(certRecordId: string, file: File): Promise<{ success: boolean }> {
    const { data: { session } } = await supabase.auth.getSession();
    const formData = new FormData();
    formData.append("certificate", file);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/certificates/${certRecordId}/upload-cert`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.access_token || ""}`,
          // NOTE: do NOT set Content-Type here — browser sets it with boundary
        },
        body: formData,
      }
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.message || "Error al subir el certificado");
    }
    return res.json();
  }
}

export const afipApi = new AfipApi();
