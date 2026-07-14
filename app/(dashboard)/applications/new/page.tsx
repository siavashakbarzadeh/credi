"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { applicationsApi } from "../../../features/applications/applications-api";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { toast } from "../../../components/notifications/toaster";
import { ChevronLeft, ChevronRight, Save } from "lucide-react";

const steps = [
  "Informazioni personali",
  "Residenza",
  "Richiesta di prestito",
  "Informazioni lavorative",
  "Informazioni finanziarie",
  "Garante",
  "Garanzia",
  "Consenso",
];

export default function NewApplicationPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<any>({
    loanType: "PERSONAL",
    urgency: "MEDIUM",
    nationality: "Italiana",
    country: "Italia",
    housingStatus: "OTHER",
    maritalStatus: "SINGLE",
    dependents: 0,
    employment: { status: "EMPLOYED", isSelfEmployed: false },
    financial: {},
    guarantors: [{}],
    collaterals: [{}],
    consents: [
      { consentType: "data_accuracy", granted: true },
      { consentType: "data_processing", granted: true },
      { consentType: "privacy_notice", granted: true },
      { consentType: "credit_check", granted: true },
    ],
  });

  const updateField = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const updateNested = (section: string, field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const createMutation = useMutation({
    mutationFn: (data: any) => applicationsApi.create(data),
    onSuccess: () => {
      toast("Pratica creata con successo", undefined, "success");
      router.push("/applications");
    },
    onError: (err: any) => {
      toast("Errore", err.response?.data?.error || "Impossibile creare la pratica", "error");
    },
  });

  const handleSubmit = () => {
    createMutation.mutate(formData);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold">Nuova pratica</h1>

      <div className="flex items-center justify-between">
        {steps.map((s, i) => (
          <div
            key={i}
            className={`flex items-center ${i < steps.length - 1 ? "flex-1" : ""}`}
          >
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                i <= step
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {i + 1}
            </div>
            <span className="ml-2 hidden text-xs sm:inline">{s}</span>
            {i < steps.length - 1 && (
              <div className={`mx-2 h-0.5 flex-1 ${i < step ? "bg-primary" : "bg-muted"}`} />
            )}
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{steps[step]}</CardTitle>
        </CardHeader>
        <CardContent>
          {step === 0 && (
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Nome *">
                <Input value={formData.firstName || ""} onChange={(e) => updateField("firstName", e.target.value)} />
              </FormField>
              <FormField label="Cognome *">
                <Input value={formData.lastName || ""} onChange={(e) => updateField("lastName", e.target.value)} />
              </FormField>
              <FormField label="Codice fiscale *">
                <Input value={formData.codiceFiscale || ""} onChange={(e) => updateField("codiceFiscale", e.target.value.toUpperCase())} maxLength={16} />
              </FormField>
              <FormField label="Data di nascita *">
                <Input type="date" value={formData.birthDate || ""} onChange={(e) => updateField("birthDate", e.target.value)} />
              </FormField>
              <FormField label="Luogo di nascita">
                <Input value={formData.birthPlace || ""} onChange={(e) => updateField("birthPlace", e.target.value)} />
              </FormField>
              <FormField label="Nazionalità">
                <Input value={formData.nationality || ""} onChange={(e) => updateField("nationality", e.target.value)} />
              </FormField>
              <FormField label="Stato civile">
                <Select value={formData.maritalStatus} onValueChange={(v) => updateField("maritalStatus", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SINGLE">Celibe/Nubile</SelectItem>
                    <SelectItem value="MARRIED">Coniugato</SelectItem>
                    <SelectItem value="DIVORCED">Divorziato</SelectItem>
                    <SelectItem value="WIDOWED">Vedovo</SelectItem>
                    <SelectItem value="SEPARATED">Separato</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="A carico">
                <Input type="number" min={0} value={formData.dependents || 0} onChange={(e) => updateField("dependents", parseInt(e.target.value) || 0)} />
              </FormField>
              <FormField label="Telefono *">
                <Input value={formData.phone || ""} onChange={(e) => updateField("phone", e.target.value)} />
              </FormField>
              <FormField label="Email *">
                <Input type="email" value={formData.email || ""} onChange={(e) => updateField("email", e.target.value)} />
              </FormField>
              <FormField label="Tipo documento">
                <Input value={formData.idDocType || ""} onChange={(e) => updateField("idDocType", e.target.value)} />
              </FormField>
              <FormField label="Numero documento">
                <Input value={formData.idDocNumber || ""} onChange={(e) => updateField("idDocNumber", e.target.value)} />
              </FormField>
            </div>
          )}

          {step === 1 && (
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Indirizzo *" className="md:col-span-2">
                <Input value={formData.address || ""} onChange={(e) => updateField("address", e.target.value)} />
              </FormField>
              <FormField label="Città *">
                <Input value={formData.city || ""} onChange={(e) => updateField("city", e.target.value)} />
              </FormField>
              <FormField label="Provincia *">
                <Input value={formData.province || ""} onChange={(e) => updateField("province", e.target.value)} />
              </FormField>
              <FormField label="CAP *">
                <Input value={formData.postalCode || ""} onChange={(e) => updateField("postalCode", e.target.value)} maxLength={5} />
              </FormField>
              <FormField label="Paese">
                <Input value={formData.country || ""} onChange={(e) => updateField("country", e.target.value)} />
              </FormField>
              <FormField label="Situazione abitativa">
                <Select value={formData.housingStatus} onValueChange={(v) => updateField("housingStatus", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OWNER">Proprietario</SelectItem>
                    <SelectItem value="RENTER">Inquilino</SelectItem>
                    <SelectItem value="FAMILY">Convivente con familiari</SelectItem>
                    <SelectItem value="OTHER">Altro</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Anni all'indirizzo">
                <Input type="number" min={0} value={formData.yearsAtAddress || ""} onChange={(e) => updateField("yearsAtAddress", parseInt(e.target.value) || 0)} />
              </FormField>
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Tipo di prestito *">
                <Select value={formData.loanType} onValueChange={(v) => updateField("loanType", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PERSONAL">Prestito personale</SelectItem>
                    <SelectItem value="MORTGAGE">Mutuo</SelectItem>
                    <SelectItem value="AUTO">Prestito auto</SelectItem>
                    <SelectItem value="BUSINESS">Prestito aziendale</SelectItem>
                    <SelectItem value="DEBT_CONSOLIDATION">Consolidamento debiti</SelectItem>
                    <SelectItem value="OTHER">Altro</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Importo richiesto (EUR) *">
                <Input type="number" min={0} value={formData.requestedAmount || ""} onChange={(e) => updateField("requestedAmount", parseFloat(e.target.value) || 0)} />
              </FormField>
              <FormField label="Finalità del prestito *" className="md:col-span-2">
                <Textarea value={formData.loanPurpose || ""} onChange={(e) => updateField("loanPurpose", e.target.value)} />
              </FormField>
              <FormField label="Durata (mesi) *">
                <Input type="number" min={1} value={formData.durationMonths || ""} onChange={(e) => updateField("durationMonths", parseInt(e.target.value) || 0)} />
              </FormField>
              <FormField label="Rata mensile stimata (EUR)">
                <Input type="number" min={0} value={formData.monthlyInstallment || ""} onChange={(e) => updateField("monthlyInstallment", parseFloat(e.target.value) || 0)} />
              </FormField>
              <FormField label="Urgenza">
                <Select value={formData.urgency} onValueChange={(v) => updateField("urgency", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Bassa</SelectItem>
                    <SelectItem value="MEDIUM">Media</SelectItem>
                    <SelectItem value="HIGH">Alta</SelectItem>
                    <SelectItem value="CRITICAL">Critica</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Note">
                <Textarea value={formData.notes || ""} onChange={(e) => updateField("notes", e.target.value)} />
              </FormField>
            </div>
          )}

          {step === 3 && (
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Stato occupazionale *">
                <Select value={formData.employment.status} onValueChange={(v) => updateNested("employment", "status", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EMPLOYED">Impiegato</SelectItem>
                    <SelectItem value="SELF_EMPLOYED">Autonomo</SelectItem>
                    <SelectItem value="UNEMPLOYED">Disoccupato</SelectItem>
                    <SelectItem value="RETIRED">Pensionato</SelectItem>
                    <SelectItem value="STUDENT">Studente</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Datore di lavoro">
                <Input value={formData.employment.employer || ""} onChange={(e) => updateNested("employment", "employer", e.target.value)} />
              </FormField>
              <FormField label="Posizione lavorativa">
                <Input value={formData.employment.jobTitle || ""} onChange={(e) => updateNested("employment", "jobTitle", e.target.value)} />
              </FormField>
              <FormField label="Tipo di contratto">
                <Select value={formData.employment.contractType || ""} onValueChange={(v) => updateNested("employment", "contractType", v)}>
                  <SelectTrigger><SelectValue placeholder="Seleziona..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PERMANENT">Indeterminato</SelectItem>
                    <SelectItem value="FIXED_TERM">Determinato</SelectItem>
                    <SelectItem value="PART_TIME">Part-time</SelectItem>
                    <SelectItem value="FREELANCE">Freelance</SelectItem>
                    <SelectItem value="OTHER">Altro</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Reddito netto mensile (EUR)">
                <Input type="number" min={0} value={formData.employment.monthlyNetIncome || ""} onChange={(e) => updateNested("employment", "monthlyNetIncome", parseFloat(e.target.value) || 0)} />
              </FormField>
              <FormField label="Reddito lordo mensile (EUR)">
                <Input type="number" min={0} value={formData.employment.monthlyGrossIncome || ""} onChange={(e) => updateNested("employment", "monthlyGrossIncome", parseFloat(e.target.value) || 0)} />
              </FormField>
              <FormField label="Partita IVA">
                <Input value={formData.employment.vatNumber || ""} onChange={(e) => updateNested("employment", "vatNumber", e.target.value)} />
              </FormField>
            </div>
          )}

          {step === 4 && (
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Costi abitativi mensili (EUR)">
                <Input type="number" min={0} value={formData.financial.monthlyHousingCost || ""} onChange={(e) => updateNested("financial", "monthlyHousingCost", parseFloat(e.target.value) || 0)} />
              </FormField>
              <FormField label="Spese mensili (EUR)">
                <Input type="number" min={0} value={formData.financial.monthlyExpenses || ""} onChange={(e) => updateNested("financial", "monthlyExpenses", parseFloat(e.target.value) || 0)} />
              </FormField>
              <FormField label="Prestiti esistenti (EUR)">
                <Input type="number" min={0} value={formData.financial.existingLoans || ""} onChange={(e) => updateNested("financial", "existingLoans", parseFloat(e.target.value) || 0)} />
              </FormField>
              <FormField label="Debiti mensili totali (EUR)">
                <Input type="number" min={0} value={formData.financial.totalMonthlyDebt || ""} onChange={(e) => updateNested("financial", "totalMonthlyDebt", parseFloat(e.target.value) || 0)} />
              </FormField>
              <FormField label="Banca">
                <Input value={formData.financial.bankName || ""} onChange={(e) => updateNested("financial", "bankName", e.target.value)} />
              </FormField>
              <FormField label="Risparmi (EUR)">
                <Input type="number" min={0} value={formData.financial.savings || ""} onChange={(e) => updateNested("financial", "savings", parseFloat(e.target.value) || 0)} />
              </FormField>
            </div>
          )}

          {step === 5 && (
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Nome completo">
                <Input value={formData.guarantors[0]?.fullName || ""} onChange={(e) => {
                  const g = [...(formData.guarantors || [{}])];
                  g[0] = { ...g[0], fullName: e.target.value };
                  updateField("guarantors", g);
                }} />
              </FormField>
              <FormField label="Codice fiscale">
                <Input value={formData.guarantors[0]?.codiceFiscale || ""} onChange={(e) => {
                  const g = [...(formData.guarantors || [{}])];
                  g[0] = { ...g[0], codiceFiscale: e.target.value };
                  updateField("guarantors", g);
                }} />
              </FormField>
              <FormField label="Telefono">
                <Input value={formData.guarantors[0]?.phone || ""} onChange={(e) => {
                  const g = [...(formData.guarantors || [{}])];
                  g[0] = { ...g[0], phone: e.target.value };
                  updateField("guarantors", g);
                }} />
              </FormField>
              <FormField label="Parentela">
                <Input value={formData.guarantors[0]?.relationship || ""} onChange={(e) => {
                  const g = [...(formData.guarantors || [{}])];
                  g[0] = { ...g[0], relationship: e.target.value };
                  updateField("guarantors", g);
                }} />
              </FormField>
              <FormField label="Occupazione">
                <Input value={formData.guarantors[0]?.employment || ""} onChange={(e) => {
                  const g = [...(formData.guarantors || [{}])];
                  g[0] = { ...g[0], employment: e.target.value };
                  updateField("guarantors", g);
                }} />
              </FormField>
              <FormField label="Reddito (EUR)">
                <Input type="number" min={0} value={formData.guarantors[0]?.income || ""} onChange={(e) => {
                  const g = [...(formData.guarantors || [{}])];
                  g[0] = { ...g[0], income: parseFloat(e.target.value) || 0 };
                  updateField("guarantors", g);
                }} />
              </FormField>
            </div>
          )}

          {step === 6 && (
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Tipo di garanzia">
                <Select
                  value={formData.collaterals[0]?.type || ""}
                  onValueChange={(v) => {
                    const c = [...(formData.collaterals || [{}])];
                    c[0] = { ...c[0], type: v };
                    updateField("collaterals", c);
                  }}
                >
                  <SelectTrigger><SelectValue placeholder="Seleziona..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="REAL_ESTATE">Immobile</SelectItem>
                    <SelectItem value="VEHICLE">Veicolo</SelectItem>
                    <SelectItem value="JEWELRY">Gioielli</SelectItem>
                    <SelectItem value="SAVINGS">Risparmi</SelectItem>
                    <SelectItem value="OTHER">Altro</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Descrizione">
                <Input value={formData.collaterals[0]?.description || ""} onChange={(e) => {
                  const c = [...(formData.collaterals || [{}])];
                  c[0] = { ...c[0], description: e.target.value };
                  updateField("collaterals", c);
                }} />
              </FormField>
              <FormField label="Valore stimato (EUR)">
                <Input type="number" min={0} value={formData.collaterals[0]?.estimatedValue || ""} onChange={(e) => {
                  const c = [...(formData.collaterals || [{}])];
                  c[0] = { ...c[0], estimatedValue: parseFloat(e.target.value) || 0 };
                  updateField("collaterals", c);
                }} />
              </FormField>
              <FormField label="Stato di proprietà">
                <Input value={formData.collaterals[0]?.ownershipStatus || ""} onChange={(e) => {
                  const c = [...(formData.collaterals || [{}])];
                  c[0] = { ...c[0], ownershipStatus: e.target.value };
                  updateField("collaterals", c);
                }} />
              </FormField>
            </div>
          )}

          {step === 7 && (
            <div className="space-y-4">
              <div className="rounded-md border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950">
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Consensi e dichiarazioni
                </p>
              </div>
              <ConsentCheck
                label="Dichiaro che le informazioni fornite sono corrette."
                checked={formData.consents[0]?.granted || false}
                onChange={(v) => {
                  const c = [...formData.consents];
                  c[0] = { ...c[0], granted: v };
                  updateField("consents", c);
                }}
              />
              <ConsentCheck
                label="Acconsento al trattamento dei dati personali ai sensi del GDPR."
                checked={formData.consents[1]?.granted || false}
                onChange={(v) => {
                  const c = [...formData.consents];
                  c[1] = { ...c[1], granted: v };
                  updateField("consents", c);
                }}
              />
              <ConsentCheck
                label="Ho preso visione dell'informativa privacy."
                checked={formData.consents[2]?.granted || false}
                onChange={(v) => {
                  const c = [...formData.consents];
                  c[2] = { ...c[2], granted: v };
                  updateField("consents", c);
                }}
              />
              <ConsentCheck
                label="Acconsento alle verifiche necessarie ai fini della valutazione della pratica."
                checked={formData.consents[3]?.granted || false}
                onChange={(v) => {
                  const c = [...formData.consents];
                  c[3] = { ...c[3], granted: v };
                  updateField("consents", c);
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <Button variant="outline" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
          <ChevronLeft className="mr-1 h-4 w-4" /> Indietro
        </Button>
        <div className="flex gap-2">
          {step < steps.length - 1 ? (
            <Button onClick={() => setStep((s) => s + 1)}>
              Avanti <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={createMutation.isPending}>
              <Save className="mr-1 h-4 w-4" />
              {createMutation.isPending ? "Salvataggio..." : "Crea pratica"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function FormField({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label className="mb-1 block text-sm">{label}</Label>
      {children}
    </div>
  );
}

function ConsentCheck({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-start gap-3 rounded-md border p-3 cursor-pointer hover:bg-muted/50">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 rounded"
      />
      <span className="text-sm">{label}</span>
    </label>
  );
}
