"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../../../lib/api-client";
import { Card, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Skeleton } from "../../../components/ui/skeleton";
import { formatDate } from "../../../lib/utils";
import { Search, Users } from "lucide-react";
import Link from "next/link";

export default function ApplicantsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["applicants", page, search],
    queryFn: async () => {
      const { data } = await api.get("/applicants", { params: { page, limit: 20, search: search || undefined } });
      return data;
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Richiedenti</h1>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cerca per nome, codice fiscale o email..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-9"
            />
          </div>

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
                  <TableHead>Nome</TableHead>
                  <TableHead>Cognome</TableHead>
                  <TableHead>Codice fiscale</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefono</TableHead>
                  <TableHead>Città</TableHead>
                  <TableHead>Registrate</TableHead>
                  <TableHead className="text-right">Pratiche</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.applicants?.map((a: any) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium">{a.firstName}</TableCell>
                    <TableCell>{a.lastName}</TableCell>
                    <TableCell className="font-mono text-xs">{a.codiceFiscale}</TableCell>
                    <TableCell>{a.email}</TableCell>
                    <TableCell>{a.phone}</TableCell>
                    <TableCell>{a.city}</TableCell>
                    <TableCell>{formatDate(a.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <Link href={`/applicants/${a.id}`}>
                        <Button variant="ghost" size="sm">
                          <Users className="mr-1 h-4 w-4" /> {a._count?.applications || 0}
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
                {(!data?.applicants || data.applicants.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      Nessun richiedente trovato
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
