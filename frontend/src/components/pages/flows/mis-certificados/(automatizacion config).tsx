"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// UI (shadcn/ui) — ajusta import paths si usás otra lib de UI
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Icons (lucide-react)
import {
  ArrowLeft,
  CheckCircle2,
  FileKey2,
  Hash,
  Info,
  Loader2,
  Shield,
  User2,
  Eye,
  EyeOff,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { afipApi } from "@/services/afip";

// -------------------- utils --------------------
const onlyDigits = (v: string) => v.replace(/\D/g, "");

const formatCuitInput = (value: string) => {
  const digits = onlyDigits(value);
  if (digits.length === 0) return "";
  if (digits.length <= 2) return digits;
  if (digits.length <= 10) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
  return `${digits.slice(0, 2)}-${digits.slice(2, 10)}-${digits.slice(10, 11)}`;
};

const schema = z.object({
  cuit: z
    .string()
    .min(11, "El CUIT debe tener 11 dígitos")
    .refine((v) => /^\d{11}$/.test(onlyDigits(v)), "Ingresá 11 números"),
  username: z.string().min(4, "Usuario demasiado corto"),
  password: z.string().min(6, "La clave debe tener al menos 6 caracteres"),
  alias: z.string().min(3, "El alias debe tener al menos 3 caracteres"),
  autoAuthorizeWSFE: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

export default function ConfigurarPDV() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { autoAuthorizeWSFE: true },
    mode: "onChange",
  });

  const cuit = watch("cuit");
  const username = watch("username");
  const password = watch("password");
  const alias = watch("alias");
  const autoAuthorizeWSFE = watch("autoAuthorizeWSFE");

  const formattedCuit = useMemo(() => {
    return formatCuitInput(cuit || "");
  }, [cuit]);

  // Verificar si todos los campos están completos y el switch está habilitado
  const isFormValid = useMemo(() => {
    return (
      cuit &&
      cuit.length === 11 &&
      username &&
      username.length >= 3 &&
      password &&
      password.length >= 6 &&
      alias &&
      alias.length >= 3 &&
      autoAuthorizeWSFE
    );
  }, [cuit, username, password, alias, autoAuthorizeWSFE]);

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    setSuccessMsg(null);

    try {
      console.log({
        cuit: onlyDigits(values.cuit),
        username: values.username,
        password: values.password,
        alias: values.alias,
      });
      const response = await afipApi.createCertDev({
        cuit: onlyDigits(values.cuit),
        username: values.username,
        password: values.password,
        alias: values.alias,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error al configurar AFIP");
      }

      setSuccessMsg(
        "¡Listo! Guardamos tu certificado de homologación y dejamos WSFE autorizado. Ya podés seguir con el mapeo del CSV y las pruebas de emisión."
      );
    } catch (err: any) {
      setServerError(err?.message || "Ocurrió un error inesperado");
    }
  };

  const handleBackToList = () => router.push("/flows/mis-certificados");

  return (
    <TooltipProvider>
      <div className="w-full max-w-3xl p-4 md:p-8">
        {successMsg ? (
          <Alert className="border-emerald-500/40">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <AlertTitle className="font-semibold">
              ¡Configuración completada!
            </AlertTitle>
            <AlertDescription className="mt-1 text-sm">
              {successMsg}
            </AlertDescription>
          </Alert>
        ) : (
          <Card className=" border-border/60">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-xl">
                    Crear certificado de desarrollo
                  </CardTitle>
                  <CardDescription className="pt-2">
                    Generá tu certificado de <strong>desarrollo</strong> y
                    autorizá el web service de facturación (WSFE) en un paso.
                  </CardDescription>
                </div>
                <div className="hidden md:flex h-10 items-center gap-2 rounded-md border px-3 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4 " />
                </div>
              </div>
            </CardHeader>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <CardContent className="grid gap-6 pt-6">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Consejo</AlertTitle>
                  <AlertDescription className="text-sm">
                    Asegurate de haber adherido <strong>WSASS</strong> en AFIP
                    (Homologación). Sin eso, la creación del certificado puede
                    fallar.{" "}
                    <Link
                      href="/flows/mis-certificados/guia"
                      className="text-primary hover:text-blue-800 underline font-medium">
                      Ver guía paso a paso
                    </Link>
                  </AlertDescription>
                </Alert>

                {/* CUIT */}
                <div className="grid gap-2">
                  <Label htmlFor="cuit" className="flex items-center gap-2">
                    <Hash className="h-4 w-4" /> CUIT del emisor
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        Ingresá 11 números. El formato se aplica
                        automáticamente.
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <Input
                    id="cuit"
                    inputMode="numeric"
                    placeholder="20-11111111-2"
                    value={formattedCuit}
                    onChange={(e) =>
                      setValue("cuit", onlyDigits(e.target.value))
                    }
                  />
                  {errors.cuit && (
                    <p className="text-xs text-destructive">
                      {errors.cuit.message}
                    </p>
                  )}
                </div>

                {/* Usuario AFIP */}
                <div className="grid gap-2">
                  <Label htmlFor="username" className="flex items-center gap-2">
                    <User2 className="h-4 w-4" /> Usuario AFIP
                  </Label>
                  <Input
                    id="username"
                    autoComplete="username"
                    placeholder="20-11111111-2"
                    {...register("username")}
                  />
                  {errors.username && (
                    <p className="text-xs text-destructive">
                      {errors.username.message}
                    </p>
                  )}
                </div>

                {/* Clave fiscal (temporal) */}
                <div className="grid gap-2">
                  <Label htmlFor="password" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" /> Clave fiscal (uso temporal)
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="••••••••"
                      {...register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:text-foreground"
                      aria-label={
                        showPassword ? "Ocultar clave" : "Mostrar clave"
                      }>
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    La clave se usa solo para ejecutar la automatización de AFIP
                    y no se almacena.
                  </p>
                  {errors.password && (
                    <p className="text-xs text-destructive">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Alias del certificado */}
                <div className="grid gap-2">
                  <Label htmlFor="alias" className="flex items-center gap-2">
                    <FileKey2 className="h-4 w-4" /> Alias
                  </Label>
                  <Input
                    id="alias"
                    placeholder="afipsdk"
                    {...register("alias")}
                  />
                  {errors.alias && (
                    <p className="text-xs text-destructive">
                      {errors.alias.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
                  <div>
                    <p className="font-medium">
                      Autorizar WSFE automáticamente
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Tras generar el certificado, autorizamos el servicio de
                      facturación (WSFE) para que puedas emitir enseguida.
                    </p>
                  </div>
                  <Switch
                    {...register("autoAuthorizeWSFE")}
                    onCheckedChange={(v) => setValue("autoAuthorizeWSFE", v)}
                  />
                </div>

                {serverError && (
                  <Alert
                    variant="destructive"
                    className="border-destructive/50">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle className="font-semibold">
                      No pudimos completar la configuración
                    </AlertTitle>
                    <AlertDescription className="mt-1 text-sm">
                      {serverError}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>

              <CardFooter className="flex items-center justify-between gap-3 border-t bg-muted/20 px-6 py-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBackToList}
                  className="gap-2">
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="gap-2"
                  disabled={isSubmitting || !isFormValid}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Procesando...
                    </>
                  ) : (
                    <>Guardar y continuar</>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        )}
      </div>
    </TooltipProvider>
  );
}
