"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationsApi } from "../../../features/notifications/notifications-api";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Skeleton } from "../../../components/ui/skeleton";
import { formatDateTime } from "../../../lib/utils";
import { Bell, CheckCheck, FileText, AlertCircle, UserCheck, StickyNote, Info } from "lucide-react";

const typeIcons: Record<string, React.ReactNode> = {
  STATUS_CHANGE: <FileText className="h-4 w-4" />,
  DOCUMENT_UPLOADED: <FileText className="h-4 w-4" />,
  DOCUMENT_MISSING: <AlertCircle className="h-4 w-4 text-yellow-600" />,
  GOOGLE_DOC_UPDATED: <FileText className="h-4 w-4 text-blue-600" />,
  CASE_ASSIGNED: <UserCheck className="h-4 w-4 text-green-600" />,
  NOTE_ADDED: <StickyNote className="h-4 w-4" />,
  GENERAL: <Info className="h-4 w-4" />,
};

export default function NotificationsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => notificationsApi.list(1, 50),
  });

  const markReadMutation = useMutation({
    mutationFn: (id: string) => notificationsApi.markRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => notificationsApi.markAllRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Notifiche</h1>
        {data?.unreadCount > 0 && (
          <Button variant="outline" onClick={() => markAllReadMutation.mutate()}>
            <CheckCheck className="mr-2 h-4 w-4" />
            Segna tutte come lette ({data.unreadCount})
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-2 p-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : data?.notifications?.length > 0 ? (
            <div className="divide-y">
              {data.notifications.map((notif: any) => (
                <div
                  key={notif.id}
                  className={`flex items-start gap-4 p-4 transition-colors hover:bg-muted/50 ${
                    !notif.read ? "bg-primary/5" : ""
                  }`}
                >
                  <div className="mt-0.5 flex-shrink-0">
                    {typeIcons[notif.type] || <Bell className="h-4 w-4" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{notif.title}</p>
                      {!notif.read && (
                        <Badge className="h-5 bg-primary/10 text-primary">Nuova</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{notif.message}</p>
                    {notif.application && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        Pratica: {notif.application.applicant?.firstName}{" "}
                        {notif.application.applicant?.lastName}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatDateTime(notif.createdAt)}
                    </p>
                  </div>
                  {!notif.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markReadMutation.mutate(notif.id)}
                    >
                      Segna come letta
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Bell className="mb-4 h-12 w-12" />
              <p className="text-lg font-medium">Nessuna notifica</p>
              <p className="text-sm">Non hai notifiche da visualizzare</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
