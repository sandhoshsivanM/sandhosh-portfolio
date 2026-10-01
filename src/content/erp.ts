export type ErpScreen = "calendar" | "flow" | "ledger" | "workorder" | "checklist" | "ocr";

export const erpModules: { title: string; line: string; hood: string; screen: ErpScreen; note?: string }[] = [
  { title: "Payday, on time", line: "Attendance, leave and salaries for 2,000+ people, worked out automatically.", hood: "HR & payroll module", screen: "calendar" },
  { title: "From request to invoice", line: "Buying goes from \"I need this\" to \"paid\" without a lost email.", hood: "RFQ → PO → GRN → invoice, budget checks", screen: "flow" },
  { title: "Books that always balance", line: "Every transaction posts to the ledger by itself, correctly.", hood: "Double-entry GL, 16 posting handlers", screen: "ledger", note: "Finance is also my hobby" },
  { title: "Buildings that don't break", line: "Maintenance happens before things fail.", hood: "Assets, planned maintenance, work orders", screen: "workorder" },
  { title: "Safe sites", line: "Permits, inspections and incidents in one place.", hood: "HSE module", screen: "checklist" },
  { title: "Paper in, data out", line: "Scanned documents fill themselves in: 20 hours saved a month.", hood: "Azure Document Intelligence, 9 document types", screen: "ocr" },
];
