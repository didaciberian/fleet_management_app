import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { VansList } from "@/components/VansList";
import { VanForm } from "@/components/VanForm";
import { VanDetail } from "@/components/VanDetail";
import { SearchBar } from "@/components/SearchBar";
import { FilterPanel } from "@/components/FilterPanel";
import { trpc } from "@/lib/trpc";

type ViewMode = "list" | "create" | "edit" | "detail";

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedVan, setSelectedVan] = useState<any>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const { data: allVans, refetch: refetchVans } = trpc.vans.list.useQuery();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Acceso Requerido</h1>
          <p className="text-gray-600 mb-4">Debes iniciar sesión para acceder a la aplicación</p>
        </div>
      </div>
    );
  }

  const handleSearch = (query: string) => {
    if (!allVans) return;
    const results = allVans.filter(
      (van: any) =>
        van.MATRICULA.toLowerCase().includes(query.toLowerCase()) ||
        van.VIN.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(results);
    setIsSearching(true);
  };

  const handleFilter = (filters: any) => {
    if (!allVans) return;
    let results = allVans;

    if (filters.empresa) {
      results = results.filter((van: any) => van.EMPRESA === filters.empresa);
    }
    if (filters.estado) {
      results = results.filter((van: any) => van.ESTADO === filters.estado);
    }
    if (filters.activa !== undefined) {
      results = results.filter((van: any) => van.ACTIVA === filters.activa);
    }
    if (filters.averia !== undefined) {
      results = results.filter((van: any) => van.AVERIA === filters.averia);
    }
    if (filters.estadoITV !== undefined) {
      results = results.filter((van: any) => van.ESTADO_ITV === filters.estadoITV);
    }

    setSearchResults(results);
    setIsSearching(true);
  };

  const handleClearSearch = () => {
    setSearchResults([]);
    setIsSearching(false);
  };

  const displayVans = isSearching ? searchResults : allVans || [];
  const companies = Array.from(new Set(allVans?.map((v: any) => v.EMPRESA) || []));
  const states = Array.from(new Set(allVans?.map((v: any) => v.ESTADO) || []));

  // View: List
  if (viewMode === "list") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestión de Furgonetas</h1>
            <p className="text-gray-600 mt-2">Bienvenido, {user?.name}</p>
          </div>
          <Button onClick={() => setViewMode("create")} className="gap-2">
            <Plus className="w-4 h-4" />
            Nueva Furgoneta
          </Button>
        </div>

        <SearchBar
          onSearch={handleSearch}
          onClear={handleClearSearch}
          placeholder="Buscar por matrícula o VIN..."
        />

        <FilterPanel
          onFilter={handleFilter}
          onClear={handleClearSearch}
          companies={companies as string[]}
          states={states as string[]}
        />

        <VansList
          onEdit={(van) => {
            setSelectedVan(van);
            setViewMode("edit");
          }}
          onView={(van) => {
            setSelectedVan(van);
            setViewMode("detail");
          }}
          onRefresh={refetchVans}
        />
      </div>
    );
  }

  // View: Create
  if (viewMode === "create") {
    return (
      <div className="space-y-6">
        <Button variant="outline" onClick={() => setViewMode("list")}>
          ← Volver al Listado
        </Button>
        <VanForm
          onSuccess={() => {
            setViewMode("list");
            refetchVans();
          }}
          onCancel={() => setViewMode("list")}
        />
      </div>
    );
  }

  // View: Edit
  if (viewMode === "edit" && selectedVan) {
    return (
      <div className="space-y-6">
        <Button variant="outline" onClick={() => setViewMode("list")}>
          ← Volver al Listado
        </Button>
        <VanForm
          van={selectedVan}
          onSuccess={() => {
            setViewMode("list");
            refetchVans();
          }}
          onCancel={() => setViewMode("list")}
        />
      </div>
    );
  }

  // View: Detail
  if (viewMode === "detail" && selectedVan) {
    return (
      <VanDetail
        vanId={selectedVan.ID}
        onBack={() => setViewMode("list")}
        onEdit={(van) => {
          setSelectedVan(van);
          setViewMode("edit");
        }}
      />
    );
  }

  return null;
}
