"use client";

import React, { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardCopy,
  FileKey2,
  Hash,
  Info,
  Loader2,
  Shield,
  Upload,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { afipApi } from "@/services/afip";

// ─── utils ───────────────────────────────────────────────────────────────────
const onlyDigits = (v: string) => v.replace(/\D/g, "");

const formatCuitInput = (value: string) => {
  const d = onlyDigits(value);
  if (!d.length) return "";
  if (d.length <= 2) return d;
  if (d.length <= 10) return `${d.slice(0, 2)}-${d.slice(2)}`;
  return `${d.slice(0, 2)}-${d.slice(2, 10)}-${d.slice(10, 11)}`;
};

// ─── schema ──────────────────────────────────────────────────────────────────
const schema = z.object({
  cuit: z
    .string()
    .min(11, "El CUIT debe tener 11 dígitos")
    .refine((v) => /^\d{11}$/.test(onlyDigits(v)), "Ingresá 11 números"),
  companyName: z.string().min(3, "Ingresá el nombre de la empresa o persona"),
  certName: z
    .string()
    .min(3, "Al menos 3 caracteres")
    .regex(/^[A-Za-z0-9]+$/, "Solo letras y números, sin espacios"),
  environment: z.enum(["DEV", "PROD"]),
});

type FormValues = z.infer<typeof schema>;

// ─── Step indicator ───────────────────────────────────────────────────────────
function StepIndicator({ step }: { step: 1 | 2 | 3 }) {
  const steps = [
    { n: 1, label: "Datos del certificado" },
    { n: 2, label: "Copiar CSR en ARCA" },
    { n: 3, label: "Subir certificado" },
  ];
  return (
    <div className="flex items-center gap-0 mb-8">
      {steps.map((s, i) => {
        const done = step > s.n;
        const active = step === s.n;
        return (
          <React.Fragment key={s.n}>
            <div className="flex items-center gap-2 flex-shrink-0">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-all ${
                  done
                    ? "bg-[#27a0c9] border-[#27a0c9] text-white"
                    : active
                    ? "border-[#27a0c9] text-[#27a0c9] bg-white"
                    : "border-gray-200 text-gray-400 bg-white"
                }`}>
                {done ? <CheckCircle2 size={14} /> : s.n}
              </div>
              <span
                className={`text-sm hidden sm:block ${
                  active
                    ? "text-gray-900 font-medium"
                    : done
                    ? "text-[#27a0c9]"
                    : "text-gray-400"
                }`}>
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`flex-1 h-px mx-3 ${
                  step > s.n ? "bg-[#27a0c9]" : "bg-gray-200"
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ─── Field wrapper ────────────────────────────────────────────────────────────
function Field({
  label,
  icon: Icon,
  tooltip,
  error,
  children,
}: {
  label: string;
  icon: React.ElementType;
  tooltip?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-1.5">
      <Label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
        <Icon size={14} className="text-gray-400" />
        {label}
        {tooltip && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Info size={13} className="text-gray-400 cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs text-xs">
              {tooltip}
            </TooltipContent>
          </Tooltip>
        )}
      </Label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ─── component ───────────────────────────────────────────────────────────────
export default function ConfigurarCertificado() {
  const router = useRouter();

  const [serverError, setServerError] = useState<string | null>(null);
  const [csrText, setCsrText] = useState<string | null>(null);
  const [certRecordId, setCertRecordId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [showUpload, setShowUpload] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { environment: "DEV" },
    mode: "onChange",
  });

  const cuit = watch("cuit");
  const companyName = watch("companyName");
  const certName = watch("certName");
  const formattedCuit = useMemo(() => formatCuitInput(cuit || ""), [cuit]);

  const isFormValid = useMemo(
    () =>
      onlyDigits(cuit || "").length === 11 &&
      (companyName || "").length >= 3 &&
      /^[A-Za-z0-9]{3,}$/.test(certName || ""),
    [cuit, companyName, certName]
  );

  const currentStep: 1 | 2 | 3 = !csrText ? 1 : !showUpload ? 2 : 3;

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    try {
      const result = await afipApi.generateCsr({
        cuit: onlyDigits(values.cuit),
        companyName: values.companyName,
        certName: values.certName,
        environment: values.environment,
      });
      setCsrText(result.csrText);
      setCertRecordId(result.certRecordId);
    } catch (err: any) {
      setServerError(err?.message || "Ocurrió un error inesperado");
    }
  };

  const handleCopy = async () => {
    if (!csrText) return;
    await navigator.clipboard.writeText(csrText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUpload = async () => {
    if (!uploadFile || !certRecordId) return;
    setUploadError(null);
    setUploading(true);
    try {
      await afipApi.uploadCert(certRecordId, uploadFile);
      router.push("/flows/mis-certificados");
    } catch (err: any) {
      setUploadError(err?.message || "Error al subir el certificado");
    } finally {
      setUploading(false);
    }
  };

  return (
    <TooltipProvider>
      <div className="w-full max-w-2xl py-8">
        <StepIndicator step={currentStep} />

        {/* ── Step 1: Form ─────────────────────────────────────────────────── */}
        {!csrText && (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">
                Datos del certificado
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Completá los campos para generar la solicitud de firma (CSR) que
                luego pegás en ARCA.
              </p>
            </div>

            {/* Info notice */}
            <div className="mx-6 mt-5 flex items-start gap-3 rounded-lg bg-[#27a0c9]/8 border border-[#27a0c9]/20 px-4 py-3">
              <Info size={15} className="text-[#27a0c9] mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-700">
                Antes de continuar, habilitá{" "}
                <strong>WSASS</strong> (testing) o{" "}
                <strong>WSAS</strong> (producción) en ARCA.{" "}
                <Link
                  href="/flows/mis-certificados/guia"
                  className="text-[#27a0c9] font-medium underline underline-offset-2">
                  Ver guía paso a paso →
                </Link>
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="px-6 py-5 grid gap-5">
                {/* Environment */}
                <Field
                  label="Entorno"
                  icon={Shield}
                  tooltip="Homologación es para pruebas. Producción para facturación real.">
                  <div className="flex gap-6 mt-0.5">
                    {(["DEV", "PROD"] as const).map((env) => (
                      <label
                        key={env}
                        className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                        <input
                          type="radio"
                          value={env}
                          {...register("environment")}
                          className="accent-[#27a0c9]"
                        />
                        {env === "DEV"
                          ? "Homologación (testing)"
                          : "Producción"}
                      </label>
                    ))}
                  </div>
                </Field>

                {/* CUIT */}
                <Field
                  label="CUIT del titular"
                  icon={Hash}
                  tooltip="En testing usá tu propio CUIT para evitar confusiones."
                  error={errors.cuit?.message}>
                  <Input
                    inputMode="numeric"
                    placeholder="20-11111111-2"
                    value={formattedCuit}
                    onChange={(e) =>
                      setValue("cuit", onlyDigits(e.target.value))
                    }
                    className="font-mono"
                  />
                </Field>

                {/* Company name */}
                <Field
                  label="Nombre de la empresa o persona"
                  icon={Shield}
                  tooltip='Campo "O" (Organization) del CSR. Usá el nombre del titular del CUIT.'
                  error={errors.companyName?.message}>
                  <Input
                    placeholder="Mi Empresa SRL / Juan Pérez"
                    {...register("companyName")}
                  />
                </Field>

                {/* Cert name */}
                <Field
                  label="Nombre del certificado (CN)"
                  icon={FileKey2}
                  tooltip="Identificador en ARCA. Solo letras y números, sin espacios."
                  error={errors.certName?.message}>
                  <Input
                    placeholder="CertTest1"
                    {...register("certName")}
                    className="font-mono"
                  />
                </Field>

                {serverError && (
                  <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                    <AlertTriangle
                      size={15}
                      className="text-red-500 mt-0.5 flex-shrink-0"
                    />
                    <div>
                      <p className="text-sm font-medium text-red-700">
                        No pudimos generar el CSR
                      </p>
                      <p className="text-sm text-red-600 mt-0.5">
                        {serverError}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
                <button
                  type="button"
                  onClick={() => router.push("/flows/mis-certificados")}
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-1.5">
                  <ArrowLeft size={14} />
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !isFormValid}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-[#27a0c9] text-white text-sm font-medium hover:bg-[#1e7a9c] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                  {isSubmitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Generando...
                    </>
                  ) : (
                    <>
                      Generar CSR
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── Step 2: CSR output ───────────────────────────────────────────── */}
        {csrText && !showUpload && (
          <div className="space-y-4">
            {/* Success notice */}
            <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
              <CheckCircle2
                size={15}
                className="text-emerald-600 mt-0.5 flex-shrink-0"
              />
              <div>
                <p className="text-sm font-medium text-emerald-800">
                  CSR generado correctamente
                </p>
                <p className="text-sm text-emerald-700 mt-0.5">
                  Copiá el texto y pegalo en{" "}
                  <strong>ARCA → WSASS</strong> (testing) o{" "}
                  <strong>WSAS</strong> (producción) para obtener el
                  certificado firmado.
                </p>
              </div>
            </div>

            {/* CSR block */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-700">
                  Texto del CSR
                </span>
                <button
                  onClick={handleCopy}
                  className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border transition-all ${
                    copied
                      ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                      : "border-gray-200 text-gray-600 hover:border-[#27a0c9] hover:text-[#27a0c9]"
                  }`}>
                  {copied ? (
                    <>
                      <CheckCircle2 size={12} />
                      Copiado
                    </>
                  ) : (
                    <>
                      <ClipboardCopy size={12} />
                      Copiar
                    </>
                  )}
                </button>
              </div>
              <div className="p-4 bg-gray-50">
                <textarea
                  readOnly
                  value={csrText}
                  rows={10}
                  className="w-full bg-transparent font-mono text-xs text-gray-700 resize-none focus:outline-none leading-relaxed"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowUpload(true)}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-[#27a0c9] text-white text-sm font-medium hover:bg-[#1e7a9c] transition-colors">
                Ya obtuve el certificado
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Upload ───────────────────────────────────────────────── */}
        {csrText && showUpload && (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">
                Subir certificado firmado
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Descargaste el <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">.crt</code> desde ARCA. Subilo acá para activarlo en el sistema.
              </p>
            </div>

            <div className="px-6 py-5 grid gap-4">
              {/* Drop zone */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`w-full flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed py-10 transition-colors ${
                  uploadFile
                    ? "border-[#27a0c9] bg-[#27a0c9]/5"
                    : "border-gray-200 hover:border-[#27a0c9]/50 hover:bg-gray-50"
                }`}>
                {uploadFile ? (
                  <>
                    <CheckCircle2 size={28} className="text-[#27a0c9]" />
                    <p className="text-sm font-medium text-gray-900">
                      {uploadFile.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      Clic para cambiar el archivo
                    </p>
                  </>
                ) : (
                  <>
                    <Upload size={28} className="text-gray-300" />
                    <p className="text-sm text-gray-500">
                      Clic para seleccionar el certificado
                    </p>
                    <p className="text-xs text-gray-400">
                      Formatos aceptados: .crt, .pem
                    </p>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".crt,.pem"
                  className="hidden"
                  onChange={(e) => {
                    setUploadError(null);
                    setUploadFile(e.target.files?.[0] ?? null);
                  }}
                />
              </button>

              {uploadError && (
                <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                  <AlertTriangle
                    size={15}
                    className="text-red-500 mt-0.5 flex-shrink-0"
                  />
                  <p className="text-sm text-red-600">{uploadError}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
              <button
                type="button"
                onClick={() => setShowUpload(false)}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-1.5">
                <ArrowLeft size={14} />
                Atrás
              </button>
              <button
                disabled={!uploadFile || uploading}
                onClick={handleUpload}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-[#27a0c9] text-white text-sm font-medium hover:bg-[#1e7a9c] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                {uploading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Subiendo...
                  </>
                ) : (
                  <>
                    Activar certificado
                    <CheckCircle2 size={14} />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
