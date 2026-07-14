"use client";

import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { applicationsApi } from "../../../../features/applications/applications-api";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/badge";
import { StatusBadge } from "../../../../components/cases/status-badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs";
import { Skeleton } from "../../../../components/ui/skeleton";
import { Textarea } from "../../../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { formatCurrency, formatDate, formatDateTime } from "../../../../lib/utils";
import { t } from "../../../../lib/i18n";
import { toast } from "../../../../components/notifications/toaster";
import { useState } from "react";
import {
  User, Briefcase, Wallet, Shield, FileText, StickyNote, Activity,
  ExternalLink, Link2, RefreshCw, Bell, CheckCircle, AlertTriangle,
} from "lucide-react";

export default function ApplicationDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const queryClient = useQueryClient();
  const [noteContent, setNoteContent] = useState("");
  const [statusReason, setStatusReason] = useState("");

  const { data: app, isLoading } = useQuery({
    queryKey: ["application", id],
    queryFn: () => applicationsApi.get(id),
  });

  const { data: activity } = useQuery({
    queryKey: ["application-activity", id],
    queryFn: () => applicationsApi.getActivity(id),
  });

  const { data: notes } = useQuery({
    queryKey: ["application-notes", id],
    queryFn: () => applicationsApi.getNotes(id),
  });

  const addNoteMutation = useMutation({
    mutationFn: (content: string) => applicationsApi.addNote(id, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["application-notes", id] });
      setNoteContent("");
      toast("Nota aggiunta con successo", undefined, "success");
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ status, reason }: { status: string; reason?: string }) =>
      applicationsApi.updateStatus(id, status, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["application", id] });
      toast("Stato aggiornato con successo", undefined, "success");
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!app) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertTriangle className="h-12 w-12 text-muted-foreground" />
        <p className="mt-4 text-lg font-medium">Pratica non trovata</p>
      </div>
    );
  }

  const statusOptions = [
    "DRAFT", "SUBMITTED", "UNDER_REVIEW", "PENDING_DOCUMENTS",
    "DOCUMENT_VERIFICATION", "APPROVED", "REJECTED", "DISBURSED", "CLOSED",
  ];

  const actionOptions: Record<string, string[]> = {
    DRAFT: ["SUBMITTED"],
    SUBMITTED: ["UNDER_REVIEW", "PENDING_DOCUMENTS"],
    UNDER_REVIEW: ["APPROVED", "REJECTED", "PENDING_DOCUMENTS"],
    PENDING_DOCUMENTS: ["DOCUMENT_VERIFICATION", "UNDER_REVIEW"],
    DOCUMENT_VERIFICATION: ["APPROVED", "REJECTED"],
    APPROVED: ["DISBURSED"],
    DISBURSED: ["CLOSED"],
  };

  const nextStatuses = actionOptions[app.status] || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {app.applicant?.firstName} {app.applicant?.lastName}
          </h1>
          <p className="text-muted-foreground">{app.applicant?.codiceFiscale} — {t(`loanType.${app.loanType}`)}</p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={app.status} />
          {nextStatuses.length > 0 && (
            <Select
              onValueChange={(val) => statusMutation.mutate({ status: val, reason: statusReason || undefined })}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Aggiorna stato" />
              </SelectTrigger>
              <SelectContent>
                {nextStatuses.map((s) => (
                  <SelectItem key={s} value={s}>{t(`status.${s}`)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      <Tabs defaultValue="info">
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="info"><User className="mr-1 h-4 w-4" /> Richiedente</TabsTrigger>
          <TabsTrigger value="loan"><FileText className="mr-1 h-4 w-4" /> Prestito</TabsTrigger>
          <TabsTrigger value="employment"><Briefcase className="mr-1 h-4 w-4" /> Lavoro</TabsTrigger>
          <TabsTrigger value="financial"><Wallet className="mr-1 h-4 w-4" /> Finanziario</TabsTrigger>
          <TabsTrigger value="guarantors"><Shield className="mr-1 h-4 w-4" /> Garanti</TabsTrigger>
          <TabsTrigger value="documents"><FileText className="mr-1 h-4 w-4" /> Documenti</TabsTrigger>
          <TabsTrigger value="notes"><StickyNote className="mr-1 h-4 w-4" /> Note</TabsTrigger>
          <TabsTrigger value="activity"><Activity className="mr-1 h-4 w-4" /> Attività</TabsTrigger>
          <TabsTrigger value="google"><Link2 className="mr-1 h-4 w-4" /> Google Doc</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <Card>
            <CardHeader><CardTitle>Informazioni personali</CardTitle></CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <InfoField label="Nome" value={`${app.applicant?.firstName} ${app.applicant?.lastName}`} />
                <InfoField label="Codice fiscale" value={app.applicant?.codiceFiscale} />
                <InfoField label="Data di nascita" value={formatDate(app.applicant?.birthDate)} />
                <InfoField label="Luogo di nascita" value={app.applicant?.birthPlace} />
                <InfoField label="Nazionalità" value={app.applicant?.nationality} />
                <InfoField label="Stato civile" value={t(`maritalStatus.${app.applicant?.maritalStatus}`)} />
                <InfoField label="A carico" value={String(app.applicant?.dependents)} />
                <InfoField label="Telefono" value={app.applicant?.phone} />
                <InfoField label="Email" value={app.applicant?.email} />
              </div>
              <h3 className="mt-6 text-sm font-semibold text-muted-foreground uppercase">Residenza</h3>
              <div className="mt-2 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <InfoField label="Indirizzo" value={`${app.applicant?.address}, ${app.applicant?.city}`} />
                <InfoField label="Provincia" value={app.applicant?.province} />
                <InfoField label="CAP" value={app.applicant?.postalCode} />
                <InfoField label="Situazione abitativa" value={t(`housingStatus.${app.applicant?.housingStatus}`)} />
                <InfoField label="Anni all'indirizzo" value={String(app.applicant?.yearsAtAddress || "-")} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="loan">
          <Card>
            <CardHeader><CardTitle>Richiesta di prestito</CardTitle></CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <InfoField label="Tipo di prestito" value={t(`loanType.${app.loanType}`)} />
                <InfoField label="Importo richiesto" value={formatCurrency(app.requestedAmount)} />
                <InfoField label="Finalità" value={app.loanPurpose} />
                <InfoField label="Durata" value={`${app.durationMonths} mesi`} />
                <InfoField label="Rata mensile stimata" value={app.monthlyInstallment ? formatCurrency(app.monthlyInstallment) : "-"} />
                <InfoField label="Urgenza" value={t(`urgency.${app.urgency}`)} />
                <InfoField label="Data erogazione desiderata" value={app.disbursementDate ? formatDate(app.disbursementDate) : "-"} />
              </div>
              {app.notes && (
                <div className="mt-4">
                  <p className="text-sm font-semibold text-muted-foreground">Note</p>
                  <p className="mt-1 text-sm">{app.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="employment">
          <Card>
            <CardHeader><CardTitle>Informazioni lavorative</CardTitle></CardHeader>
            <CardContent>
              {app.employment ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <InfoField label="Stato" value={t(`employmentStatus.${app.employment.status}`)} />
                  <InfoField label="Datore di lavoro" value={app.employment.employer || "-"} />
                  <InfoField label="Posizione" value={app.employment.jobTitle || "-"} />
                  <InfoField label="Contratto" value={app.employment.contractType ? t(`contractType.${app.employment.contractType}`) : "-"} />
                  <InfoField label="Reddito netto mensile" value={app.employment.monthlyNetIncome ? formatCurrency(app.employment.monthlyNetIncome) : "-"} />
                  <InfoField label="Reddito lordo mensile" value={app.employment.monthlyGrossIncome ? formatCurrency(app.employment.monthlyGrossIncome) : "-"} />
                  <InfoField label="Autonomo" value={app.employment.isSelfEmployed ? "Sì" : "No"} />
                  <InfoField label="Partita IVA" value={app.employment.vatNumber || "-"} />
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Nessuna informazione lavorativa disponibile</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial">
          <Card>
            <CardHeader><CardTitle>Profilo finanziario</CardTitle></CardHeader>
            <CardContent>
              {app.financialProfile ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <InfoField label="Costi abitativi mensili" value={app.financialProfile.monthlyHousingCost ? formatCurrency(app.financialProfile.monthlyHousingCost) : "-"} />
                  <InfoField label="Spese mensili" value={app.financialProfile.monthlyExpenses ? formatCurrency(app.financialProfile.monthlyExpenses) : "-"} />
                  <InfoField label="Prestiti esistenti" value={app.financialProfile.existingLoans ? formatCurrency(app.financialProfile.existingLoans) : "-"} />
                  <InfoField label="Debiti mensili totali" value={app.financialProfile.totalMonthlyDebt ? formatCurrency(app.financialProfile.totalMonthlyDebt) : "-"} />
                  <InfoField label="Banca" value={app.financialProfile.bankName || "-"} />
                  <InfoField label="Risparmi" value={app.financialProfile.savings ? formatCurrency(app.financialProfile.savings) : "-"} />
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Nessun profilo finanziario disponibile</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guarantors">
          <Card>
            <CardHeader><CardTitle>Garanti</CardTitle></CardHeader>
            <CardContent>
              {app.guarantors?.length > 0 ? (
                <div className="space-y-4">
                  {app.guarantors.map((g: any) => (
                    <div key={g.id} className="rounded-md border p-4">
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <InfoField label="Nome" value={g.fullName} />
                        <InfoField label="Codice fiscale" value={g.codiceFiscale || "-"} />
                        <InfoField label="Telefono" value={g.phone || "-"} />
                        <InfoField label="Parentela" value={g.relationship || "-"} />
                        <InfoField label="Occupazione" value={g.employment || "-"} />
                        <InfoField label="Reddito" value={g.income ? formatCurrency(g.income) : "-"} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Nessun garante registrato</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader><CardTitle>Documenti</CardTitle></CardHeader>
            <CardContent>
              {app.missingDocumentTypes?.length > 0 && (
                <div className="mb-4 rounded-md border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-800 dark:bg-yellow-950">
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    Documenti mancanti: {app.missingDocumentTypes.map((d: string) => t(`documentType.${d}`)).join(", ")}
                  </p>
                </div>
              )}
              {app.documents?.length > 0 ? (
                <div className="space-y-2">
                  {app.documents.map((doc: any) => (
                    <div key={doc.id} className="flex items-center justify-between rounded-md border p-3">
                      <div>
                        <p className="text-sm font-medium">{t(`documentType.${doc.documentType}`)}</p>
                        <p className="text-xs text-muted-foreground">{doc.fileName}</p>
                      </div>
                      <StatusBadge status={doc.status} />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Nessun documento caricato</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes">
          <Card>
            <CardHeader><CardTitle>Note interne</CardTitle></CardHeader>
            <CardContent>
              <div className="mb-4 flex gap-2">
                <Textarea
                  placeholder="Inserisci una nota interna..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={() => noteContent.trim() && addNoteMutation.mutate(noteContent)}
                  disabled={!noteContent.trim() || addNoteMutation.isPending}
                >
                  Aggiungi
                </Button>
              </div>
              {notes?.length > 0 ? (
                <div className="space-y-3">
                  {notes.map((note: any) => (
                    <div key={note.id} className="rounded-md border p-3">
                      <p className="text-sm">{note.content}</p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {note.user?.firstName} {note.user?.lastName} — {formatDateTime(note.createdAt)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Nessuna nota interna. Aggiungi la prima nota.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader><CardTitle>Cronologia attività</CardTitle></CardHeader>
            <CardContent>
              {activity?.length > 0 ? (
                <div className="space-y-3">
                  {activity.map((a: any) => (
                    <div key={a.id} className="flex items-start gap-3 rounded-md border p-3">
                      <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{t(`activity.${a.action}`) || a.action}</p>
                        <p className="text-xs text-muted-foreground">
                          {a.user?.firstName} {a.user?.lastName} — {formatDateTime(a.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Nessuna attività registrata</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="google">
          <Card>
            <CardHeader><CardTitle>Documento Google collegato</CardTitle></CardHeader>
            <CardContent>
              {app.linkedGoogleDocs?.length > 0 ? (
                <div className="space-y-4">
                  <div className="rounded-md border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Documento collegato</p>
                        <p className="text-xs text-muted-foreground">ID: {app.linkedGoogleDocs[0].googleDocId}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <a href={`https://docs.google.com/document/d/${app.linkedGoogleDocs[0].googleDocId}`} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-1 h-4 w-4" /> Apri
                          </a>
                        </Button>
                        <Button variant="outline" size="sm">
                          <RefreshCw className="mr-1 h-4 w-4" /> Sincronizza
                        </Button>
                      </div>
                    </div>
                    {app.linkedGoogleDocs[0].watchChannels?.length > 0 && (
                      <div className="mt-2 flex items-center gap-2">
                        <Bell className="h-4 w-4 text-green-600" />
                        <span className="text-xs text-green-600">Monitoraggio attivo</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">Nessun documento Google collegato a questa pratica.</p>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={async () => {
                      try {
                        await applicationsApi.createGoogleDoc(id);
                        queryClient.invalidateQueries({ queryKey: ["application", id] });
                        toast("Documento Google creato con successo", undefined, "success");
                      } catch (err: any) {
                        toast("Errore", err.response?.data?.error || "Impossibile creare il documento", "error");
                      }
                    }}>
                      <FileText className="mr-1 h-4 w-4" /> Crea documento Google
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function InfoField({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="text-sm">{value || "-"}</p>
    </div>
  );
}
