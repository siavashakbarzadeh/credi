"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../../features/auth/use-auth";
import { api } from "../../../lib/api-client";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Skeleton } from "../../../components/ui/skeleton";
import { CheckCircle, XCircle, Unlink } from "lucide-react";

const roleLabels: Record<string, string> = {
  ADMIN: "Amministratore",
  MANAGER: "Responsabile",
  LOAN_OFFICER: "Consulente",
  REVIEWER: "Revisore",
};

interface GoogleStatus {
  connected: boolean;
  googleEmail: string | null;
  tokenExpiry: string | null;
  createdAt: string | null;
}

export default function SettingsPage() {
  const { user, loading } = useAuth();
  const queryClient = useQueryClient();
  const [connectError, setConnectError] = useState<string | null>(null);

  const { data: googleStatus, isLoading: googleLoading } = useQuery<GoogleStatus>({
    queryKey: ["google-status"],
    queryFn: async () => {
      const { data } = await api.get("/auth/google/status");
      return data;
    },
  });

  const disconnectMutation = useMutation({
    mutationFn: async () => {
      await api.delete("/auth/google/disconnect");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["google-status"] });
    },
  });

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
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Collega il tuo account Google per creare e gestire documenti Google Docs associati alle pratiche.
          </p>

          {googleLoading ? (
            <Skeleton className="h-10 w-48" />
          ) : googleStatus?.connected ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium">Connesso</span>
              </div>
              {googleStatus.googleEmail && (
                <p className="text-sm text-muted-foreground">
                  Account: <span className="font-medium text-foreground">{googleStatus.googleEmail}</span>
                </p>
              )}
              {googleStatus.tokenExpiry && (
                <p className="text-sm text-muted-foreground">
                  Scade il: {new Date(googleStatus.tokenExpiry).toLocaleDateString("it-IT")}
                </p>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => disconnectMutation.mutate()}
                disabled={disconnectMutation.isPending}
              >
                <Unlink className="mr-2 h-4 w-4" />
                {disconnectMutation.isPending ? "Disconnessione..." : "Disconnetti"}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Non connesso</span>
              </div>
              <a
                href={`/api/auth/google/start?userId=${user?.id}`}
                className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Collega account Google
              </a>
            </div>
          )}

          {connectError && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{connectError}</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
