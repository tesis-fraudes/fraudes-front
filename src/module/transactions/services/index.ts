// Servicios
export {
  getSuspiciousTransactions,
  getTransactionById,
  approveTransaction,
  rejectTransaction,
  getTransactionStatistics,
  getCustomerLastMovements,
  getCustomerFraudHistory,
  getCustomerActivePaymentMethods,
} from "./transactions.service";

// Tipos
export type {
  SuspiciousTransaction,
  TransactionFilters,
  TransactionSearchParams,
  TransactionSearchResponse,
  CustomerLastMovements,
  CustomerFraudHistory,
} from "./transactions.service";
