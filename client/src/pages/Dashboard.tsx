import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertTriangle, Wrench, TrendingUp } from "lucide-react";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];

export default function Dashboard() {
  const { data: metrics, isLoading, error } = trpc.metrics.getDashboard.useQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-600">
        Error al cargar las métricas: {error.message}
      </div>
    );
  }

  if (!metrics) {
    return <div className="p-6">No hay datos disponibles</div>;
  }

  // Prepare data for company distribution chart
  const companyData = Object.entries(metrics.companyCounts).map(([name, value]) => ({
    name,
    value,
  }));

  // Prepare data for type distribution chart
  const typeData = Object.entries(metrics.typeCounts).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-gray-600 mt-2">Resumen de la flota de furgonetas</p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Vans */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Furgonetas</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalVans}</div>
            <p className="text-xs text-gray-600 mt-1">
              {metrics.activaVans} activas, {metrics.inactivaVans} inactivas
            </p>
          </CardContent>
        </Card>

        {/* ITV Status */}
        <Card className={metrics.itvExpiredVans > 0 ? "border-red-300 bg-red-50" : ""}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estado ITV</CardTitle>
            <AlertTriangle className={`h-4 w-4 ${metrics.itvExpiredVans > 0 ? "text-red-500" : "text-green-500"}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{metrics.itvExpiredVans}</div>
            <p className="text-xs text-gray-600 mt-1">
              Caducadas • {metrics.itvExpiringVans} próximas a caducar
            </p>
          </CardContent>
        </Card>

        {/* Breakdowns */}
        <Card className={metrics.vansWithAveria > 0 ? "border-orange-300 bg-orange-50" : ""}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Averías Activas</CardTitle>
            <Wrench className={`h-4 w-4 ${metrics.vansWithAveria > 0 ? "text-orange-500" : "text-gray-500"}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.vansWithAveria}</div>
            <p className="text-xs text-gray-600 mt-1">
              {metrics.vansInWorkshop} en taller
            </p>
          </CardContent>
        </Card>

        {/* Active Rate */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Actividad</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.totalVans > 0 ? Math.round((metrics.activaVans / metrics.totalVans) * 100) : 0}%
            </div>
            <p className="text-xs text-gray-600 mt-1">
              De la flota total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Company Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución por Empresa</CardTitle>
            <CardDescription>Número de furgonetas por empresa</CardDescription>
          </CardHeader>
          <CardContent>
            {companyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={companyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-600 text-center py-8">No hay datos disponibles</p>
            )}
          </CardContent>
        </Card>

        {/* Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución por Tipo</CardTitle>
            <CardDescription>Composición de la flota</CardDescription>
          </CardHeader>
          <CardContent>
            {typeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={typeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {typeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-600 text-center py-8">No hay datos disponibles</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Alerts Section */}
      {(metrics.itvExpiredVans > 0 || metrics.vansWithAveria > 0) && (
        <Card className="border-yellow-300 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-900">Alertas Importantes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {metrics.itvExpiredVans > 0 && (
              <div className="flex items-center gap-2 text-yellow-800">
                <AlertTriangle className="h-4 w-4" />
                <span>{metrics.itvExpiredVans} furgoneta(s) con ITV caducada</span>
              </div>
            )}
            {metrics.itvExpiringVans > 0 && (
              <div className="flex items-center gap-2 text-yellow-800">
                <AlertTriangle className="h-4 w-4" />
                <span>{metrics.itvExpiringVans} furgoneta(s) con ITV próxima a caducar (30 días)</span>
              </div>
            )}
            {metrics.vansWithAveria > 0 && (
              <div className="flex items-center gap-2 text-yellow-800">
                <Wrench className="h-4 w-4" />
                <span>{metrics.vansWithAveria} furgoneta(s) con averías activas</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
