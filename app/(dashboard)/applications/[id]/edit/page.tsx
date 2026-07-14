"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { applicationsApi } from "../../../../../features/applications/applications-api";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../components/ui/card";
import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import { Label } from "../../../../../components/ui/label";
import { Textarea } from "../../../../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../components/ui/select";
import { Skeleton } from "../../../../../components/ui/skeleton";
import { toast } from "../../../../../components/notifications/toaster";
import { useState, useEffect } from "react";
import { Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditApplicationPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const queryClient = useQueryClient();

  const { data: app, isLoading } = useQuery({
    queryKey: ["application", id],
    queryFn: () => applicationsApi.get(id),
  });

  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (app) {
      setFormData({
        loanType: app.loanType,
        requestedAmount: app.requestedAmount,
        loanPurpose: app.loanPurpose,
        durationMonths: app.durationMonths,
        monthlyInstallment: app.monthlyInstallment || "",
        urgency: app.urgency,
        notes: app.notes || "",
      });
    }
  }, [app]);

  const updateMutation = useMutation({
    mutationFn: (data: any) => applicationsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["application", id] });
      toast("Pratica aggiornata con successo", undefined, "success");
      router.push(`/applications/${id}`);
    },
    onError: (err: any) => {
      toast("Errore", err.response?.data?.error || "Impossibile aggiornare", "error");
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

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/applications/${id}`}>
          <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <h1 className="text-2xl font-bold">Modifica pratica</h1>
      </div>

      <Card>
        <CardHeader><CardTitle>Dati del prestito</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Tipo di prestito</Label>
              <Select value={formData.loanType} onValueChange={(v) => setFormData((p: any) => ({ ...p, loanType: v }))}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="PERSONAL">Prestito personale</SelectItem>
                  <SelectItem value="MORTGAGE">Mutuo</SelectItem>
                  <SelectItem value="AUTO">Prestito auto</SelectItem>
                  <SelectItem value="BUSINESS">Prestito aziendale</SelectItem>
                  <SelectItem value="DEBT_CONSOLIDATION">Consolidamento debiti</SelectItem>
                  <SelectItem value="OTHER">Altro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Importo richiesto (EUR)</Label>
              <Input type="number" className="mt-1" value={formData.requestedAmount || ""} onChange={(e) => setFormData((p: any) => ({ ...p, requestedAmount: parseFloat(e.target.value) || 0 }))} />
            </div>
            <div className="md:col-span-2">
              <Label>Finalità del prestito</Label>
              <Textarea className="mt-1" value={formData.loanPurpose || ""} onChange={(e) => setFormData((p: any) => ({ ...p, loanPurpose: e.target.value }))} />
            </div>
            <div>
              <Label>Durata (mesi)</Label>
              <Input type="number" className="mt-1" value={formData.durationMonths || ""} onChange={(e) => setFormData((p: any) => ({ ...p, durationMonths: parseInt(e.target.value) || 0 }))} />
            </div>
            <div>
              <Label>Rata mensile stimata (EUR)</Label>
              <Input type="number" className="mt-1" value={formData.monthlyInstallment || ""} onChange={(e) => setFormData((p: any) => ({ ...p, monthlyInstallment: parseFloat(e.target.value) || 0 }))} />
            </div>
            <div>
              <Label>Urgenza</Label>
              <Select value={formData.urgency} onValueChange={(v) => setFormData((p: any) => ({ ...p, urgency: v }))}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Bassa</SelectItem>
                  <SelectItem value="MEDIUM">Media</SelectItem>
                  <SelectItem value="HIGH">Alta</SelectItem>
                  <SelectItem value="CRITICAL">Critica</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label>Note</Label>
              <Textarea className="mt-1" value={formData.notes || ""} onChange={(e) => setFormData((p: any) => ({ ...p, notes: e.target.value }))} />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Link href={`/applications/${id}`}>
          <Button variant="outline">Annulla</Button>
        </Link>
        <Button onClick={() => updateMutation.mutate(formData)} disabled={updateMutation.isPending}>
          <Save className="mr-1 h-4 w-4" />
          {updateMutation.isPending ? "Salvataggio..." : "Salva modifiche"}
        </Button>
      </div>
    </div>
  );
}
