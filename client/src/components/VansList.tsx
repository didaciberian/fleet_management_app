import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Wrench, Edit2, Trash2, Eye, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface VansListProps {
  onEdit?: (van: any) => void;
  onView?: (van: any) => void;
  onRefresh?: () => void;
}

export function VansList({ onEdit, onView, onRefresh }: VansListProps) {
  const { data: vans, isLoading, refetch } = trpc.vans.list.useQuery();
  const deleteMutation = trpc.vans.delete.useMutation();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (deleteId === null) return;

    try {
      setIsDeleting(true);
      await deleteMutation.mutateAsync({ id: deleteId });
      toast.success("Furgoneta eliminada correctamente");
      setDeleteId(null);
      refetch();
      onRefresh?.();
    } catch (error: any) {
      toast.error(error.message || "Error al eliminar la furgoneta");
    } finally {
      setIsDeleting(false);
    }
  };

  const isItvExpired = (fechaITV: string | null) => {
    if (!fechaITV) return false;
    return new Date(fechaITV) < new Date();
  };

  const isItvExpiringsoon = (fechaITV: string | null) => {
    if (!fechaITV) return false;
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    const itvDate = new Date(fechaITV);
    return itvDate <= thirtyDaysFromNow && itvDate >= today;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="animate-spin w-8 h-8" />
        </CardContent>
      </Card>
    );
  }

  if (!vans || vans.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Furgonetas</CardTitle>
          <CardDescription>No hay furgonetas registradas</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Furgonetas</CardTitle>
          <CardDescription>Gestión de la flota ({vans.length} total)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Matrícula</TableHead>
                  <TableHead>Modelo</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>ITV</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vans.map((van: any) => (
                  <TableRow key={van.ID} className={van.AVERIA ? "bg-orange-50" : ""}>
                    <TableCell className="font-medium">{van.MATRICULA}</TableCell>
                    <TableCell>{van.MODELO}</TableCell>
                    <TableCell>{van.EMPRESA}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {van.ACTIVA ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            Activa
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                            Inactiva
                          </Badge>
                        )}
                        {van.AVERIA && (
                          <Badge variant="destructive" className="gap-1">
                            <Wrench className="w-3 h-3" />
                            Avería
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {isItvExpired(van.FECHA_ITV) ? (
                          <Badge variant="destructive" className="gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            Caducada
                          </Badge>
                        ) : isItvExpiringsoon(van.FECHA_ITV) ? (
                          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300 gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            Próxima
                          </Badge>
                        ) : van.ESTADO_ITV ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            Válida
                          </Badge>
                        ) : (
                          <Badge variant="outline">N/A</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onView?.(van)}
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit?.(van)}
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteId(van.ID)}
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar furgoneta</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas eliminar esta furgoneta? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Eliminar
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
