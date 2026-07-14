import { PrismaClient, UserRole, ApplicationStatus, LoanType, EmploymentStatus, ContractType, MaritalStatus, HousingStatus, DocumentCategory, DocumentStatus, CollateralType, UrgencyLevel } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

async function main() {
  console.log("Seeding database...");

  const adminPassword = await hashPassword("admin123");
  const userPassword = await hashPassword("password123");

  const admin = await prisma.user.upsert({
    where: { email: "admin@credi.it" },
    update: {},
    create: {
      email: "admin@credi.it",
      passwordHash: adminPassword,
      firstName: "Marco",
      lastName: "Rossi",
      role: UserRole.ADMIN,
    },
  });

  const manager = await prisma.user.upsert({
    where: { email: "responsabile@credi.it" },
    update: {},
    create: {
      email: "responsabile@credi.it",
      passwordHash: userPassword,
      firstName: "Laura",
      lastName: "Bianchi",
      role: UserRole.MANAGER,
    },
  });

  const loanOfficer1 = await prisma.user.upsert({
    where: { email: "consulente1@credi.it" },
    update: {},
    create: {
      email: "consulente1@credi.it",
      passwordHash: userPassword,
      firstName: "Giovanni",
      lastName: "Verdi",
      role: UserRole.LOAN_OFFICER,
    },
  });

  const loanOfficer2 = await prisma.user.upsert({
    where: { email: "consulente2@credi.it" },
    update: {},
    create: {
      email: "consulente2@credi.it",
      passwordHash: userPassword,
      firstName: "Francesca",
      lastName: "Neri",
      role: UserRole.LOAN_OFFICER,
    },
  });

  const reviewer = await prisma.user.upsert({
    where: { email: "revisore@credi.it" },
    update: {},
    create: {
      email: "revisore@credi.it",
      passwordHash: userPassword,
      firstName: "Alessandro",
      lastName: "Colombo",
      role: UserRole.REVIEWER,
    },
  });

  console.log("Users created:", { admin, manager, loanOfficer1, loanOfficer2, reviewer });

  // Applicants
  const applicant1 = await prisma.applicant.create({
    data: {
      firstName: "Giuseppe",
      lastName: "Ferrari",
      codiceFiscale: "FRRGPP80A01H501Z",
      birthDate: new Date("1980-01-15"),
      birthPlace: "Milano",
      nationality: "Italiana",
      maritalStatus: MaritalStatus.MARRIED,
      dependents: 2,
      phone: "+39 333 1234567",
      email: "giuseppe.ferrari@email.it",
      idDocType: "Carta d'identità",
      idDocNumber: "CI1234567",
      idDocExpiry: new Date("2028-06-15"),
      address: "Via Roma 42",
      city: "Milano",
      province: "MI",
      postalCode: "20121",
      country: "Italia",
      housingStatus: HousingStatus.OWNER,
      yearsAtAddress: 8,
    },
  });

  const applicant2 = await prisma.applicant.create({
    data: {
      firstName: "Maria",
      lastName: "Romano",
      codiceFiscale: "RMNMRA85M41H501Y",
      birthDate: new Date("1985-08-21"),
      birthPlace: "Roma",
      nationality: "Italiana",
      maritalStatus: MaritalStatus.SINGLE,
      dependents: 0,
      phone: "+39 347 9876543",
      email: "maria.romano@email.it",
      idDocType: "Passaporto",
      idDocNumber: "PA9876543",
      idDocExpiry: new Date("2029-12-01"),
      address: "Via Napoli 15",
      city: "Roma",
      province: "RM",
      postalCode: "00100",
      country: "Italia",
      housingStatus: HousingStatus.RENTER,
      yearsAtAddress: 3,
    },
  });

  const applicant3 = await prisma.applicant.create({
    data: {
      firstName: "Luca",
      lastName: "Moretti",
      codiceFiscale: "MRRLCU75T10F205X",
      birthDate: new Date("1975-12-10"),
      birthPlace: "Firenze",
      nationality: "Italiana",
      maritalStatus: MaritalStatus.DIVORCED,
      dependents: 1,
      phone: "+39 320 5551234",
      email: "luca.moretti@email.it",
      idDocType: "Carta d'identità",
      idDocNumber: "CI7890123",
      idDocExpiry: new Date("2027-03-20"),
      address: "Borgo degli Albizzi 8",
      city: "Firenze",
      province: "FI",
      postalCode: "50122",
      country: "Italia",
      housingStatus: HousingStatus.OWNER,
      yearsAtAddress: 15,
    },
  });

  console.log("Applicants created:", { applicant1, applicant2, applicant3 });

  // Loan Applications
  const app1 = await prisma.loanApplication.create({
    data: {
      status: ApplicationStatus.UNDER_REVIEW,
      loanType: LoanType.PERSONAL,
      requestedAmount: 25000,
      loanPurpose: "Ristrutturazione appartamento",
      durationMonths: 60,
      monthlyInstallment: 480,
      urgency: UrgencyLevel.MEDIUM,
      notes: "Richiedente con buona historica creditizia. Reddito stabile.",
      applicantId: applicant1.id,
      employment: {
        create: {
          status: EmploymentStatus.EMPLOYED,
          employer: "TechSolutions S.r.l.",
          jobTitle: "Responsabile IT",
          contractType: ContractType.PERMANENT,
          startDate: new Date("2015-03-01"),
          monthsEmployed: 118,
          monthlyNetIncome: 3200,
          monthlyGrossIncome: 4500,
          otherIncome: 200,
          isSelfEmployed: false,
        },
      },
      financialProfile: {
        create: {
          monthlyHousingCost: 1200,
          monthlyExpenses: 800,
          existingLoans: 5000,
          totalMonthlyDebt: 300,
          totalExistingDebt: 5000,
          bankName: "Banca Intesa Sanpaolo",
          iban: "IT60X0542811101000000123456",
          savings: 15000,
          notes: "Nessuna posizione debitoria in corso.",
        },
      },
      guarantors: {
        create: {
          fullName: "Anna Ferrari",
          codiceFiscale: "FRRANN82M41H501W",
          phone: "+39 333 7654321",
          email: "anna.ferrari@email.it",
          address: "Via Roma 42, Milano",
          relationship: "Coniuge",
          employment: "Impiegata presso Banca Mediolanum",
          income: 2800,
        },
      },
      collaterals: {
        create: {
          type: CollateralType.REAL_ESTATE,
          description: "Appartamento三locali in Via Torino, Milano",
          estimatedValue: 350000,
          ownershipStatus: "Proprietà piena",
          registrationNumber: "REA MI-123456",
          insuranceInfo: "Assicurazione polizze vita attiva",
        },
      },
      assignments: {
        create: {
          userId: loanOfficer1.id,
        },
      },
    },
  });

  const app2 = await prisma.loanApplication.create({
    data: {
      status: ApplicationStatus.PENDING_DOCUMENTS,
      loanType: LoanType.MORTGAGE,
      requestedAmount: 180000,
      loanPurpose: "Acquisto prima casa",
      durationMonths: 240,
      monthlyInstallment: 950,
      urgency: UrgencyLevel.HIGH,
      notes: "Richiesta mutuo per acquisto immobile. Manca certificato di stipendio.",
      applicantId: applicant2.id,
      employment: {
        create: {
          status: EmploymentStatus.EMPLOYED,
          employer: "Studio Legale Associati",
          jobTitle: "Avvocato",
          contractType: ContractType.PERMANENT,
          startDate: new Date("2018-09-01"),
          monthsEmployed: 75,
          monthlyNetIncome: 4200,
          monthlyGrossIncome: 6000,
          otherIncome: 500,
          isSelfEmployed: false,
        },
      },
      financialProfile: {
        create: {
          monthlyHousingCost: 900,
          monthlyExpenses: 600,
          existingLoans: 0,
          totalMonthlyDebt: 0,
          totalExistingDebt: 0,
          bankName: "UniCredit",
          savings: 35000,
        },
      },
      assignments: {
        create: {
          userId: loanOfficer2.id,
        },
      },
    },
  });

  const app3 = await prisma.loanApplication.create({
    data: {
      status: ApplicationStatus.DRAFT,
      loanType: LoanType.BUSINESS,
      requestedAmount: 75000,
      loanPurpose: "Espansione attività commerciale",
      durationMonths: 84,
      urgency: UrgencyLevel.LOW,
      notes: "Imprenditore con attività avviata da 10 anni.",
      applicantId: applicant3.id,
      employment: {
        create: {
          status: EmploymentStatus.SELF_EMPLOYED,
          employer: "Moretti Artigianato S.s.",
          jobTitle: "Titolare",
          contractType: ContractType.FREELANCE,
          startDate: new Date("2014-06-01"),
          monthsEmployed: 138,
          monthlyNetIncome: 3800,
          monthlyGrossIncome: 5200,
          otherIncome: 0,
          isSelfEmployed: true,
          vatNumber: "IT12345678901",
        },
      },
      financialProfile: {
        create: {
          monthlyHousingCost: 600,
          monthlyExpenses: 1200,
          existingLoans: 20000,
          totalMonthlyDebt: 400,
          totalExistingDebt: 20000,
          bankName: "Banco BPM",
          iban: "IT30A0600012345678901234567",
          savings: 25000,
          notes: "Fatturato annuo circa 120.000 EUR.",
        },
      },
      guarantors: {
        create: {
          fullName: "Paolo Moretti",
          codiceFiscale: "MRPPLA70A01F205Z",
          phone: "+39 339 1112233",
          relationship: "Fratello",
          employment: "Dipendente pubblico",
          income: 2500,
        },
      },
    },
  });

  console.log("Applications created:", { app1, app2, app3 });

  // Documents
  await prisma.uploadedDocument.createMany({
    data: [
      {
        documentType: DocumentCategory.ID_CARD,
        fileName: "carta_identita_ferrari.pdf",
        filePath: "/uploads/carta_identita_ferrari.pdf",
        fileSize: 245000,
        mimeType: "application/pdf",
        status: DocumentStatus.VERIFIED,
        applicationId: app1.id,
        uploadedById: loanOfficer1.id,
      },
      {
        documentType: DocumentCategory.INCOME_PROOF,
        fileName: "certificato_stipendio_ferrari.pdf",
        filePath: "/uploads/certificato_stipendio_ferrari.pdf",
        fileSize: 180000,
        mimeType: "application/pdf",
        status: DocumentStatus.RECEIVED,
        applicationId: app1.id,
        uploadedById: loanOfficer1.id,
      },
      {
        documentType: DocumentCategory.BANK_STATEMENT,
        fileName: "estratto_conto_ferrari.pdf",
        filePath: "/uploads/estratto_conto_ferrari.pdf",
        fileSize: 520000,
        mimeType: "application/pdf",
        status: DocumentStatus.VERIFIED,
        applicationId: app1.id,
        uploadedById: loanOfficer1.id,
      },
      {
        documentType: DocumentCategory.TAX_DOCUMENT,
        fileName: "dichiarazione_redditi_ferrari.pdf",
        filePath: "/uploads/dichiarazione_redditi_ferrari.pdf",
        fileSize: 340000,
        mimeType: "application/pdf",
        status: DocumentStatus.PENDING,
        applicationId: app1.id,
        uploadedById: loanOfficer1.id,
      },
      {
        documentType: DocumentCategory.PASSPORT,
        fileName: "passaporto_romano.pdf",
        filePath: "/uploads/passaporto_romano.pdf",
        fileSize: 290000,
        mimeType: "application/pdf",
        status: DocumentStatus.RECEIVED,
        applicationId: app2.id,
        uploadedById: loanOfficer2.id,
      },
      {
        documentType: DocumentCategory.PAYSLIP,
        fileName: "busta_paga_romano.pdf",
        filePath: "/uploads/busta_paga_romano.pdf",
        fileSize: 150000,
        mimeType: "application/pdf",
        status: DocumentStatus.PENDING,
        applicationId: app2.id,
        uploadedById: loanOfficer2.id,
      },
    ],
  });

  // Internal Notes
  await prisma.internalNote.createMany({
    data: [
      {
        content: "Richiedente ha fornito tutta la documentazione iniziale. Reddito verificato tramite buste paga degli ultimi 3 mesi.",
        applicationId: app1.id,
        userId: loanOfficer1.id,
      },
      {
        content: "Valutazione positiva del garante. Reddito del coniuge sufficiente a coprire eventuali difficoltà.",
        applicationId: app1.id,
        userId: reviewer.id,
      },
      {
        content: "In attesa della certificazione dello stipendio dal datore di lavoro. Richiesta inviata il 10/01/2026.",
        applicationId: app2.id,
        userId: loanOfficer2.id,
      },
    ],
  });

  // Status History
  await prisma.statusHistory.createMany({
    data: [
      {
        fromStatus: null,
        toStatus: ApplicationStatus.DRAFT,
        reason: "Pratica creata",
        applicationId: app1.id,
        userId: loanOfficer1.id,
      },
      {
        fromStatus: ApplicationStatus.DRAFT,
        toStatus: ApplicationStatus.SUBMITTED,
        reason: "Documentazione completa, pratica sottoposta a revisione",
        applicationId: app1.id,
        userId: loanOfficer1.id,
      },
      {
        fromStatus: ApplicationStatus.SUBMITTED,
        toStatus: ApplicationStatus.UNDER_REVIEW,
        reason: "Assegnata al revisore per verifica",
        applicationId: app1.id,
        userId: manager.id,
      },
      {
        fromStatus: null,
        toStatus: ApplicationStatus.DRAFT,
        reason: "Pratica creata",
        applicationId: app2.id,
        userId: loanOfficer2.id,
      },
      {
        fromStatus: ApplicationStatus.DRAFT,
        toStatus: ApplicationStatus.SUBMITTED,
        reason: "Documentazione iniziale sottoposta",
        applicationId: app2.id,
        userId: loanOfficer2.id,
      },
      {
        fromStatus: ApplicationStatus.SUBMITTED,
        toStatus: ApplicationStatus.PENDING_DOCUMENTS,
        reason: "Manca certificato di stipendio aggiornato",
        applicationId: app2.id,
        userId: manager.id,
      },
      {
        fromStatus: null,
        toStatus: ApplicationStatus.DRAFT,
        reason: "Pratica creata",
        applicationId: app3.id,
        userId: loanOfficer1.id,
      },
    ],
  });

  // Activity Logs
  await prisma.activityLog.createMany({
    data: [
      {
        action: "CREATED",
        details: { description: "Pratica creata da Giovanni Verdi" },
        applicationId: app1.id,
        userId: loanOfficer1.id,
      },
      {
        action: "STATUS_CHANGED",
        details: { from: "DRAFT", to: "SUBMITTED" },
        applicationId: app1.id,
        userId: loanOfficer1.id,
      },
      {
        action: "ASSIGNED",
        details: { assignedTo: "Giovanni Verdi" },
        applicationId: app1.id,
        userId: manager.id,
      },
      {
        action: "DOCUMENT_UPLOADED",
        details: { fileName: "carta_identita_ferrari.pdf", type: "Carta d'identità" },
        applicationId: app1.id,
        userId: loanOfficer1.id,
      },
      {
        action: "NOTE_ADDED",
        details: { preview: "Richiedente ha fornito tutta la documentazione..." },
        applicationId: app1.id,
        userId: loanOfficer1.id,
      },
      {
        action: "CREATED",
        details: { description: "Pratica creata da Francesca Neri" },
        applicationId: app2.id,
        userId: loanOfficer2.id,
      },
      {
        action: "STATUS_CHANGED",
        details: { from: "SUBMITTED", to: "PENDING_DOCUMENTS" },
        applicationId: app2.id,
        userId: manager.id,
      },
    ],
  });

  // Notifications
  await prisma.notification.createMany({
    data: [
      {
        type: "STATUS_CHANGE",
        title: "Stato pratica aggiornato",
        message: "La pratica di Giuseppe Ferrari è stata aggiornata a 'In revisione'.",
        applicationId: app1.id,
        userId: loanOfficer1.id,
      },
      {
        type: "DOCUMENT_MISSING",
        title: "Documenti mancanti",
        message: "Manca la dichiarazione dei redditi per la pratica di Giuseppe Ferrari.",
        applicationId: app1.id,
        userId: loanOfficer1.id,
      },
      {
        type: "CASE_ASSIGNED",
        title: "Pratica assegnata",
        message: "Ti è stata assegnata la pratica di Maria Romano.",
        applicationId: app2.id,
        userId: loanOfficer2.id,
      },
      {
        type: "DOCUMENT_UPLOADED",
        title: "Nuovo documento caricato",
        message: "È stato caricato il passaporto per la pratica di Maria Romano.",
        applicationId: app2.id,
        userId: loanOfficer2.id,
        read: true,
      },
    ],
  });

  // Consent Records
  await prisma.consentRecord.createMany({
    data: [
      {
        consentType: "data_processing",
        granted: true,
        applicationId: app1.id,
        recordedById: loanOfficer1.id,
      },
      {
        consentType: "credit_check",
        granted: true,
        applicationId: app1.id,
        recordedById: loanOfficer1.id,
      },
      {
        consentType: "data_processing",
        granted: true,
        applicationId: app2.id,
        recordedById: loanOfficer2.id,
      },
      {
        consentType: "data_processing",
        granted: true,
        applicationId: app3.id,
        recordedById: loanOfficer1.id,
      },
    ],
  });

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
