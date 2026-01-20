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
import { Edit2, Trash2, Loader2 } from "lucide-react";
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
import { AveriaForm } from "./AveriaForm";

interface AeriasListProps {
  vanId: number;
  onRefresh?: () => void;
}

export function AveriasList({ vanId, onRefresh }: AeriasListProps) {
  const { data: averias, isLoading, refetch } = trpc.averias.getByVanId.useQuery({ vanId });
  const deleteMutation = trpc.averias.delete.useMutation();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingAveria, setEditingAveria] = useState<any>(null);

  const handleDelete = async () => {
    if (deleteId === null) return;

    try {
      setIsDeleting(true);
      await deleteMutation.mutateAsync({ id: deleteId });
      toast.success("Avería eliminada correctamente");
      setDeleteId(null);
      refetch();
      onRefresh?.();
    } catch (error: any) {
      toast.error(error.message || "Error al eliminar la avería");
    } finally {
      setIsDeleting(false);
    }
  };

  const isActive = (averia: any) => !averia.FECHA_SALIDA_TALLER;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="animate-spin w-8 h-8" />
        </CardContent>
      </Card>
    );
  }

  if (!averias || averias.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Historial de Averías</CardTitle>
          <CardDescription>No hay averías registradas</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (editingAveria) {
    return (
      <AveriaForm
        vanId={vanId}
        averia={editingAveria}
        onSuccess={() => {
          setEditingAveria(null);
          refetch();
          onRefresh?.();
        }}
        onCancel={() => setEditingAveria(null)}
      />
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Historial de Averías</CardTitle>
          <CardDescription>{averias.length} avería(s) registrada(s)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Causa</TableHead>
                  <TableHead>Taller</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {averias.map((averia: any) => (
                  <TableRow key={averia.ID_AVERIA} className={isActive(averia) ? "bg-orange-50" : ""}>
                    <TableCell className="font-medium">{String(averia.FECHA_AVERIA)}</TableCell>
                    <TableCell className="max-w-xs truncate">{averia.CAUSA_AVERIA}</TableCell>
                    <TableCell>{averia.TALLER || "N/A"}</TableCell>
                    <TableCell>
                      {isActive(averia) ? (
                        <Badge className="bg-orange-100 text-orange-800">En Taller</Badge>
                      ) : (
                        <Badge className="bg-green-100 text-green-800">Reparada</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingAveria(averia)}
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteId(averia.ID_AVERIA)}
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
            <AlertDialogTitle>Eliminar avería</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas eliminar esta avería? Esta acción no se puede deshacer.
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
