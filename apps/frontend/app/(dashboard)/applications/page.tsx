"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { applicationsApi } from "../../../features/applications/applications-api";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import { StatusBadge } from "../../../components/cases/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Skeleton } from "../../../components/ui/skeleton";
import { formatCurrency, formatDate } from "../../../lib/utils";
import { t } from "../../../lib/i18n";
import { Plus, Search, Filter, Eye, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";

const statusOptions = [
  "DRAFT", "SUBMITTED", "UNDER_REVIEW", "PENDING_DOCUMENTS",
  "DOCUMENT_VERIFICATION", "APPROVED", "REJECTED", "DISBURSED", "CLOSED",
];

export default function ApplicationsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["applications", page, search, statusFilter],
    queryFn: () =>
      applicationsApi.list({
        page,
        limit: 20,
        search: search || undefined,
        status: statusFilter === "all" ? undefined : statusFilter,
      }),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Pratiche</h1>
        <Link href="/applications/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nuova pratica
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cerca per nome, codice fiscale o finalità..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-9"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(v) => {
                setStatusFilter(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[200px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Stato" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutti gli stati</SelectItem>
                {statusOptions.map((s) => (
                  <SelectItem key={s} value={s}>
                    {t(`status.${s}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Richiedente</TableHead>
                  <TableHead>Tipo prestito</TableHead>
                  <TableHead>Importo richiesto</TableHead>
                  <TableHead>Stato</TableHead>
                  <TableHead>Data creazione</TableHead>
                  <TableHead className="text-right">Azioni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.applications?.map((app: any) => (
                  <TableRow key={app.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {app.applicant?.firstName} {app.applicant?.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {app.applicant?.codiceFiscale}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{t(`loanType.${app.loanType}`)}</TableCell>
                    <TableCell>{formatCurrency(app.requestedAmount)}</TableCell>
                    <TableCell>
                      <StatusBadge status={app.status} />
                    </TableCell>
                    <TableCell>{formatDate(app.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/applications/${app.id}`}>
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/applications/${app.id}/edit`}>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {(!data?.applications || data.applications.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Nessuna pratica trovata
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}

          {data && data.totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Pagina {data.page} di {data.totalPages} — {data.total} risultati
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Precedente
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= data.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Successiva
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
