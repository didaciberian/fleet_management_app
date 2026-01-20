import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createAveriaSchema } from "@shared/schemas";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface AveriaFormProps {
  vanId: number;
  averia?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function AveriaForm({ vanId, averia, onSuccess, onCancel }: AveriaFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createMutation = trpc.averias.create.useMutation();
  const updateMutation = trpc.averias.update.useMutation();

  const form = useForm({
    resolver: zodResolver(createAveriaSchema),
    defaultValues: averia || {
      ID: vanId,
      CAUSA_AVERIA: "",
      FECHA_AVERIA: new Date().toISOString().split("T")[0],
    },
  });

  async function onSubmit(values: any) {
    try {
      setIsSubmitting(true);

      if (averia?.ID_AVERIA) {
        // Update existing averia
        await updateMutation.mutateAsync({
          id: averia.ID_AVERIA,
          data: values,
        });
        toast.success("Avería actualizada correctamente");
      } else {
        // Create new averia
        await createMutation.mutateAsync(values);
        toast.success("Avería creada correctamente");
      }

      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || "Error al guardar la avería");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{averia?.ID_AVERIA ? "Editar Avería" : "Nueva Avería"}</CardTitle>
        <CardDescription>
          {averia?.ID_AVERIA ? "Modifica los datos de la avería" : "Registra una nueva avería"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Causa Averia */}
            <FormField
              control={form.control}
              name="CAUSA_AVERIA"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Causa de la Avería *</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe la avería..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Fecha Averia */}
            <FormField
              control={form.control}
              name="FECHA_AVERIA"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de la Avería *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Taller */}
            <FormField
              control={form.control}
              name="TALLER"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Taller</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre del taller" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="FECHA_ENTRADA_TALLER"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha Entrada Taller</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ESTIMACION_SALIDA"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimación Salida</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="FECHA_SALIDA_TALLER"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha Salida Taller</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Observations */}
            <FormField
              control={form.control}
              name="OBSERVACIONES_AVERIA"
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
                {averia?.ID_AVERIA ? "Actualizar" : "Crear"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
