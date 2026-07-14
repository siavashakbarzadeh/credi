"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../../features/dashboard/dashboard-api";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { StatusBadge } from "../../components/cases/status-badge";
import { Skeleton } from "../../components/ui/skeleton";
import { formatCurrency, formatDate } from "../../lib/utils";
import { FileText, Users, Clock, AlertCircle, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: dashboardApi.getStats,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Pannello di controllo</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-8 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Pannello di controllo</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-lg bg-primary/10 p-3">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Totale pratiche</p>
              <p className="text-2xl font-bold">{stats?.totalApplications || 0}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-lg bg-green-500/10 p-3">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Valore totale richiesto</p>
              <p className="text-2xl font-bold">{formatCurrency(stats?.totalValue || 0)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-lg bg-yellow-500/10 p-3">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Documenti in attesa</p>
              <p className="text-2xl font-bold">{stats?.pendingDocuments || 0}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-lg bg-blue-500/10 p-3">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Totale richiedenti</p>
              <p className="text-2xl font-bold">{stats?.totalApplicants || 0}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pratiche per stato</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(stats?.applicationsByStatus || {}).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <StatusBadge status={status} />
                  <span className="text-sm font-medium">{count as number}</span>
                </div>
              ))}
              {Object.keys(stats?.applicationsByStatus || {}).length === 0 && (
                <p className="text-sm text-muted-foreground">Nessuna pratica trovata</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pratiche recenti</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats?.recentApplications?.slice(0, 5).map((app: any) => (
                <Link
                  key={app.id}
                  href={`/applications/${app.id}`}
                  className="flex items-center justify-between rounded-md border p-3 transition-colors hover:bg-muted"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {app.applicant?.firstName} {app.applicant?.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(app.requestedAmount)} — {formatDate(app.createdAt)}
                    </p>
                  </div>
                  <StatusBadge status={app.status} />
                </Link>
              ))}
              {(!stats?.recentApplications || stats.recentApplications.length === 0) && (
                <p className="text-sm text-muted-foreground">Nessuna pratica recente</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {stats?.recentNotifications?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Notifiche recenti</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentNotifications.map((notif: any) => (
                <div key={notif.id} className="flex items-start gap-3 rounded-md border p-3">
                  <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{notif.title}</p>
                    <p className="text-xs text-muted-foreground">{notif.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
