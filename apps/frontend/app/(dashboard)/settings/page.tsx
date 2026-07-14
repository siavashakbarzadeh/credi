"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../features/auth/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Skeleton } from "../../../components/ui/skeleton";

const roleLabels: Record<string, string> = {
  ADMIN: "Amministratore",
  MANAGER: "Responsabile",
  LOAN_OFFICER: "Consulente",
  REVIEWER: "Revisore",
};

export default function SettingsPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Impostazioni</h1>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Profilo utente</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nome</p>
              <p className="text-sm">{user?.firstName || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Cognome</p>
              <p className="text-sm">{user?.lastName || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-sm">{user?.email || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Ruolo</p>
              <Badge variant="outline">{roleLabels[user?.role || ""] || user?.role}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Connessione Google</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Collega il tuo account Google per creare e gestire documenti Google Docs associati alle pratiche.
          </p>
          <a
            href={`http://localhost:3001/api/auth/google/start?userId=${user?.id}`}
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Collega account Google
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
