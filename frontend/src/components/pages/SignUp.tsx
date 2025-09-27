"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth";
import Image from "next/image";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      setIsLoading(false);
      return;
    }

    try {
      const result = await authService.signUp({
        email: formData.email,
        password: formData.password,
        name: formData.name,
      });

      setSuccessMessage(result.message);
      // Don't redirect immediately - let user know to check email
    } catch (error) {
      console.error("Sign up error:", error);
      setError(
        error instanceof Error ? error.message : "Error al crear cuenta"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleResendConfirmation = async () => {
    if (!formData.email) {
      setError("Por favor ingresa tu email");
      return;
    }

    try {
      setIsLoading(true);
      const result = await authService.resendConfirmation(formData.email);
      setSuccessMessage(result.message);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Error al reenviar confirmación"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-3xl flex items-center justify-center bg-gray-50 h-fit py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-xs h-fit space-y-8 overflow-hidden">
        <div className="flex flex-col items-center justify-center w-full">
          <Image
            src="/logo-celeste.png"
            alt="Logo"
            width={50}
            height={50}
            className="mb-4"
          />

          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Crear Cuenta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Unite y comenzá a facturar en automático en segundos.
          </p>
        </div>

        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
            <p>{successMessage}</p>
            <button
              type="button"
              onClick={handleResendConfirmation}
              className="mt-2 text-sm underline hover:no-underline"
              disabled={isLoading}>
              Reenviar email de confirmación
            </button>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700">
                Nombre
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="Tu nombre"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700">
                Confirmar Contraseña
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading || !!successMessage}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading
                ? "Creando cuenta..."
                : successMessage
                ? "Revisa tu email"
                : "Crear Cuenta"}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes cuenta?{" "}
              <button
                type="button"
                onClick={() => router.push("/auth/sign-in")}
                className="font-medium text-primary hover:text-primary-dark">
                Inicia sesión aquí
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
