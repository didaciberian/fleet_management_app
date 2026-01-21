import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function Login() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const loginMutation = trpc.auth.login.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      console.log("Attempting login with password...");
      const result = await loginMutation.mutateAsync({ password });
      console.log("Login result:", result);

      if (result.success) {
        // Store session token in localStorage
        localStorage.setItem("sessionToken", result.token);
        // Redirect to home page - no reload needed
        setLocation("/");
      } else {
        setError(result.message || "Contraseña incorrecta");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(
        err?.message || err?.data?.message || "Contraseña incorrecta"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <div className="p-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Gestión de Flota
            </h1>
            <p className="text-slate-600">Ingresa la contraseña para acceder</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Contraseña
              </label>
              <Input
                type="password"
                placeholder="Ingresa la contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading || !password}
              className="w-full"
            >
              {isLoading ? "Verificando..." : "Acceder"}
            </Button>
          </form>

          <p className="text-xs text-slate-500 text-center mt-6">
            Aplicación de gestión de flota de furgonetas
          </p>
        </div>
      </Card>
    </div>
  );
}
