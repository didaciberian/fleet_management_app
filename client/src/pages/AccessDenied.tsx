import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";

export default function AccessDenied() {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-red-100 p-4 rounded-full">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Acceso Denegado</h1>

        <p className="text-gray-600 mb-6">
          Lo sentimos, pero solo se permite el acceso con emails que terminen en <strong>@iberianrd.es</strong>.
        </p>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-700">
            Si crees que esto es un error, contacta con el administrador del sistema.
          </p>
        </div>

        <Button
          onClick={() => logout()}
          className="w-full bg-red-600 hover:bg-red-700 text-white"
        >
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );
}
