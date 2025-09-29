// Servicios
export {
  generateFraudDistributionReport,
  generateTemporalEvolutionReport,
  generateFinancialAnalysisReport,
  generateGeographicReport,
  exportReport,
  getReportHistory,
  scheduleReport,
  getApprovedTransactions,
  getRejectedTransactions,
  getPredictedTransactions,
  exportApprovedTransactions,
  exportRejectedTransactions,
  exportPredictedTransactions,
} from "./reports.service";

// Tipos
export type {
  ReportFilters,
  ReportData,
  FraudDistributionData,
  TemporalEvolutionData,
  FinancialAnalysisData,
  GeographicData,
  ApprovedTransaction,
  RejectedTransaction,
  PredictedTransaction,
  ReportQueryParams,
} from "./reports.service";
