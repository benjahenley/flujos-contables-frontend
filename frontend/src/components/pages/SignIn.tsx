"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth";
import Image from "next/image";

export default function SignInPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await authService.signIn(
        formData.email,
        formData.password
      );
      console.log("Sign in successful:", result);

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Sign in error:", error);
      setError(
        error instanceof Error ? error.message : "Error al iniciar sesión"
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
      setError(""); // Clear error
      alert(result.message);
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
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 h-fit bg-gray-50 p-10 rounded-3xl">
        <div className="flex flex-col items-center justify-center">
          <Image
            src="/logo-celeste.png"
            alt="Logo"
            width={50}
            height={50}
            className="mb-4"
          />
          <h2 className=" text-center text-3xl font-extrabold text-gray-900">
            Iniciar Sesión
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Accede a tu cuenta de Flujos Contables
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              <p>{error}</p>
              {error.includes("verify your email") && (
                <button
                  type="button"
                  onClick={handleResendConfirmation}
                  className="mt-2 text-sm underline hover:no-underline"
                  disabled={isLoading}>
                  Reenviar email de confirmación
                </button>
              )}
            </div>
          )}

          <div className="space-y-4">
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
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes cuenta?{" "}
              <button
                type="button"
                onClick={() => router.push("/auth/sign-up")}
                className="font-medium text-primary hover:text-primary-dark">
                Regístrate aquí
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
