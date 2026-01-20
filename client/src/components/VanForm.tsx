import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createVanSchema, CreateVan } from "@shared/schemas";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface VanFormProps {
  van?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function VanForm({ van, onSuccess, onCancel }: VanFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createMutation = trpc.vans.create.useMutation();
  const updateMutation = trpc.vans.update.useMutation();

  const form = useForm({
    resolver: zodResolver(createVanSchema),
    defaultValues: van || {
      ACTIVA: true,
      ESTADO_ITV: true,
      AVERIA: false,
    },
  });

  async function onSubmit(values: CreateVan) {
    try {
      setIsSubmitting(true);

      if (van?.ID) {
        // Update existing van
        await updateMutation.mutateAsync({
          id: van.ID,
          data: values,
        });
        toast.success("Furgoneta actualizada correctamente");
      } else {
        // Create new van
        await createMutation.mutateAsync(values);
        toast.success("Furgoneta creada correctamente");
      }

      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || "Error al guardar la furgoneta");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{van?.ID ? "Editar Furgoneta" : "Nueva Furgoneta"}</CardTitle>
        <CardDescription>
          {van?.ID ? "Modifica los datos de la furgoneta" : "Completa los datos de la nueva furgoneta"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Row 1: VIN and MATRICULA */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="VIN"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>VIN *</FormLabel>
                    <FormControl>
                      <Input placeholder="17 caracteres" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="MATRICULA"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Matrícula *</FormLabel>
                    <FormControl>
                      <Input placeholder="ABC-1234" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Row 2: MODELO and TIPO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="MODELO"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modelo *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Ford Transit" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="TIPO"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Furgón" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Row 3: EMPRESA and NUM_POLIZA */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="EMPRESA"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Empresa *</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre de la empresa" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="NUM_POLIZA"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de Póliza</FormLabel>
                    <FormControl>
                      <Input placeholder="Opcional" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Row 4: ESTADO and NUM_LLAVE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="ESTADO"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Operativo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="NUM_LLAVE"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de Llave</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Opcional" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Row 5: Dates */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="FECHA_ITV"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha ITV</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="FECHA_ACTIVACION"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha Activación</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="FECHA_FIN_CONTRATO"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha Fin Contrato</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Row 6: More Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="FECHA_DEFLEETING"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha Defleeting</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Row 7: Checkboxes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="ACTIVA"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="font-normal">Activa</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ESTADO_ITV"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="font-normal">ITV Válida</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="AVERIA"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="font-normal">Con Avería</FormLabel>
                  </FormItem>
                )}
              />
            </div>

            {/* Observations */}
            <FormField
              control={form.control}
              name="OBSERVACIONES"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observaciones</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Notas adicionales..." {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Buttons */}
            <div className="flex gap-2 justify-end">
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancelar
                </Button>
              )}
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {van?.ID ? "Actualizar" : "Crear"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
