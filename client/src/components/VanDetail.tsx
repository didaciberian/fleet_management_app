import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle, Wrench, ArrowLeft } from "lucide-react";
import { AveriasList } from "./AveriasList";
import { useState } from "react";
import { AveriaForm } from "./AveriaForm";

interface VanDetailProps {
  vanId: number;
  onBack?: () => void;
  onEdit?: (van: any) => void;
}

export function VanDetail({ vanId, onBack, onEdit }: VanDetailProps) {
  const { data: van, isLoading: vanLoading } = trpc.vans.getById.useQuery({ id: vanId });
  const { data: averias, isLoading: averiasLoading, refetch: refetchAverias } = trpc.averias.getByVanId.useQuery({ vanId });
  const [showAveriaForm, setShowAveriaForm] = useState(false);

  if (vanLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  if (!van) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-red-600">Furgoneta no encontrada</p>
        </CardContent>
      </Card>
    );
  }

  const isItvExpired = van.FECHA_ITV && new Date(van.FECHA_ITV) < new Date();
  const isItvExpiringsoon = van.FECHA_ITV && (() => {
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    const itvDate = new Date(van.FECHA_ITV);
    return itvDate <= thirtyDaysFromNow && itvDate >= today;
  })();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          )}
          <div>
            <h1 className="text-3xl font-bold">{van.MATRICULA}</h1>
            <p className="text-gray-600">{van.MODELO} - {van.TIPO}</p>
          </div>
        </div>
        <Button onClick={() => onEdit?.(van)}>Editar</Button>
      </div>

      {/* Alerts */}
      {(isItvExpired || isItvExpiringsoon || van.AVERIA) && (
        <Card className="border-yellow-300 bg-yellow-50">
          <CardContent className="pt-6 space-y-2">
            {isItvExpired && (
              <div className="flex items-center gap-2 text-red-800">
                <AlertTriangle className="h-4 w-4" />
                <span>ITV CADUCADA - Acción requerida</span>
              </div>
            )}
            {isItvExpiringsoon && (
              <div className="flex items-center gap-2 text-yellow-800">
                <AlertTriangle className="h-4 w-4" />
                <span>ITV próxima a caducar en {van.FECHA_ITV ? String(van.FECHA_ITV) : "N/A"}</span>
              </div>
            )}
            {van.AVERIA && (
              <div className="flex items-center gap-2 text-orange-800">
                <Wrench className="h-4 w-4" />
                <span>Furgoneta con avería activa</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Main Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* General Info */}
        <Card>
          <CardHeader>
            <CardTitle>Información General</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Fecha ITV</p>
              <p>{van.FECHA_ITV ? String(van.FECHA_ITV) : "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Empresa</p>
              <p>{van.EMPRESA}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Estado</p>
              <div className="flex gap-2 mt-1">
                {van.ACTIVA ? (
                  <Badge className="bg-green-100 text-green-800">Activa</Badge>
                ) : (
                  <Badge className="bg-gray-100 text-gray-800">Inactiva</Badge>
                )}
                {van.AVERIA && (
                  <Badge className="bg-orange-100 text-orange-800">Con Avería</Badge>
                )}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600">Número de Póliza</p>
              <p>{van.NUM_POLIZA || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Número de Llave</p>
              <p>{van.NUM_LLAVE || "N/A"}</p>
            </div>
          </CardContent>
        </Card>

        {/* Dates Info */}
        <Card>
          <CardHeader>
            <CardTitle>Fechas Importantes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Fecha ITV</p>
              <div className="flex items-center gap-2 mt-1">
                <p>{van.FECHA_ITV ? String(van.FECHA_ITV) : "N/A"}</p>
                {isItvExpired && <Badge variant="destructive">Caducada</Badge>}
                {isItvExpiringsoon && <Badge className="bg-yellow-100 text-yellow-800">Próxima</Badge>}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600">Fecha Activación</p>
              <p>{van.FECHA_ACTIVACION ? String(van.FECHA_ACTIVACION) : "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Fecha Fin Contrato</p>
              <p>{van.FECHA_FIN_CONTRATO ? String(van.FECHA_FIN_CONTRATO) : "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Fecha Defleeting</p>
              <p>{van.FECHA_DEFLEETING ? String(van.FECHA_DEFLEETING) : "N/A"}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Observations */}
      {van.OBSERVACIONES && (
        <Card>
          <CardHeader>
            <CardTitle>Observaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{van.OBSERVACIONES}</p>
          </CardContent>
        </Card>
      )}

      {/* Averias Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Historial de Averías</h2>
          <Button onClick={() => setShowAveriaForm(!showAveriaForm)}>
            {showAveriaForm ? "Cancelar" : "Agregar Avería"}
          </Button>
        </div>

        {showAveriaForm && (
          <AveriaForm
            vanId={vanId}
            onSuccess={() => {
              setShowAveriaForm(false);
              refetchAverias();
            }}
            onCancel={() => setShowAveriaForm(false)}
          />
        )}

        <AveriasList
          vanId={vanId}
          onRefresh={refetchAverias}
        />
      </div>
    </div>
  );
}
