export interface AfipConfigPayload {
  cuit: string;
  certificate: File;
  privateKey: File;
}

export interface InvoiceData {
  total: number;
  // Agregar otros campos necesarios para la factura
}

class AfipApi {
  async configureAfip(data: AfipConfigPayload) {
    const formData = new FormData();
    formData.append("cuit", data.cuit);
    formData.append("certificate", data.certificate);
    formData.append("privateKey", data.privateKey);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/afip/config`,
      {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al configurar AFIP");
    }

    return response.json();
  }

  async generateInvoice(data: InvoiceData) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/afip/invoice`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al generar factura");
    }

    return response.json();
  }

  async getInvoiceStatus(invoiceId: string) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/afip/invoice/${invoiceId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al obtener estado de factura");
    }

    return response.json();
  }
}

export const afipApi = new AfipApi();
