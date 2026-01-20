import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FilterPanelProps {
  onFilter: (filters: any) => void;
  onClear: () => void;
  companies?: string[];
  states?: string[];
}

export function FilterPanel({ onFilter, onClear, companies = [], states = [] }: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    empresa: "",
    estado: "",
    activa: undefined as boolean | undefined,
    averia: undefined as boolean | undefined,
    estadoITV: undefined as boolean | undefined,
  });

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const handleApplyFilters = () => {
    const activeFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== "" && v !== undefined)
    );
    onFilter(activeFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      empresa: "",
      estado: "",
      activa: undefined,
      averia: undefined,
      estadoITV: undefined,
    });
    onClear();
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== "" && v !== undefined);

  return (
    <Card>
      <CardHeader
        className="cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Filtros</CardTitle>
            <CardDescription>Filtra las furgonetas por criterios</CardDescription>
          </div>
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </CardHeader>

      {isOpen && (
        <CardContent className="space-y-4">
          {/* Empresa Filter */}
          {companies.length > 0 && (
            <div>
              <label className="text-sm font-medium">Empresa</label>
              <Select value={filters.empresa} onValueChange={(v) => handleFilterChange("empresa", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una empresa" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company} value={company}>
                      {company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Estado Filter */}
          {states.length > 0 && (
            <div>
              <label className="text-sm font-medium">Estado</label>
              <Select value={filters.estado} onValueChange={(v) => handleFilterChange("estado", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un estado" />
                </SelectTrigger>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Activa Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Estado de Actividad</label>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="activa-true"
                  checked={filters.activa === true}
                  onCheckedChange={(checked) =>
                    handleFilterChange("activa", checked ? true : undefined)
                  }
                />
                <label htmlFor="activa-true" className="text-sm cursor-pointer">
                  Activas
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="activa-false"
                  checked={filters.activa === false}
                  onCheckedChange={(checked) =>
                    handleFilterChange("activa", checked ? false : undefined)
                  }
                />
                <label htmlFor="activa-false" className="text-sm cursor-pointer">
                  Inactivas
                </label>
              </div>
            </div>
          </div>

          {/* Averia Filter */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="averia"
              checked={filters.averia === true}
              onCheckedChange={(checked) =>
                handleFilterChange("averia", checked ? true : undefined)
              }
            />
            <label htmlFor="averia" className="text-sm cursor-pointer">
              Solo con averías
            </label>
          </div>

          {/* ITV Filter */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="itv"
              checked={filters.estadoITV === false}
              onCheckedChange={(checked) =>
                handleFilterChange("estadoITV", checked ? false : undefined)
              }
            />
            <label htmlFor="itv" className="text-sm cursor-pointer">
              ITV caducada o próxima a caducar
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-4">
            <Button onClick={handleApplyFilters} className="flex-1">
              Aplicar Filtros
            </Button>
            {hasActiveFilters && (
              <Button onClick={handleClearFilters} variant="outline" className="flex-1">
                Limpiar
              </Button>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
