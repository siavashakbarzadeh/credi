"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import api from "../../../lib/api-client";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Skeleton } from "../../../components/ui/skeleton";
import { formatDate, formatCurrency } from "../../../lib/utils";
import Link from "next/link";
import { Button } from "../../../components/ui/button";

export default function ApplicantDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: applicant, isLoading } = useQuery({
    queryKey: ["applicant", id],
    queryFn: async () => {
      const { data } = await api.get(`/applicants/${id}`);
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!applicant) {
    return <p className="text-center py-20 text-muted-foreground">Richiedente non trovato</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{applicant.firstName} {applicant.lastName}</h1>

      <Card>
        <CardHeader><CardTitle>Informazioni personali</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Field label="Codice fiscale" value={applicant.codiceFiscale} />
            <Field label="Data di nascita" value={formatDate(applicant.birthDate)} />
            <Field label="Luogo di nascita" value={applicant.birthPlace || "-"} />
            <Field label="Nazionalità" value={applicant.nationality} />
            <Field label="Telefono" value={applicant.phone} />
            <Field label="Email" value={applicant.email} />
            <Field label="Indirizzo" value={`${applicant.address}, ${applicant.postalCode} ${applicant.city} (${applicant.province})`} />
          </div>
        </CardContent>
      </Card>

      {applicant.applications?.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Pratiche associate</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {applicant.applications.map((app: any) => (
                <Link
                  key={app.id}
                  href={`/applications/${app.id}`}
                  className="flex items-center justify-between rounded-md border p-3 hover:bg-muted"
                >
                  <div>
                    <p className="text-sm font-medium">{app.loanPurpose}</p>
                    <p className="text-xs text-muted-foreground">{formatCurrency(app.requestedAmount)} — {formatDate(app.createdAt)}</p>
                  </div>
                  <Button variant="ghost" size="sm">Visualizza</Button>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="text-sm">{value || "-"}</p>
    </div>
  );
}
