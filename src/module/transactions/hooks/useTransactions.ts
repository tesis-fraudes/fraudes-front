"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  getSuspiciousTransactions,
  approveTransaction,
  rejectTransaction,
  getTransactionById,
  type SuspiciousTransaction,
  type TransactionFilters,
  type TransactionSearchParams,
} from "../services";

interface UseTransactionsReturn {
  // Datos
  transactions: SuspiciousTransaction[];
  
  // Estados de carga
  isLoading: boolean;
  isProcessing: boolean;
  
  // Filtros y búsqueda
  searchQuery: string;
  filters: TransactionFilters;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  
  // Estados del modal de detalles
  isDetailsModalOpen: boolean;
  selectedTransaction: SuspiciousTransaction | null;
  
  // Acciones
  setSearchQuery: (query: string) => void;
  setFilters: (filters: TransactionFilters) => void;
  setCurrentPage: (page: number) => void;
  loadTransactions: () => Promise<void>;
  handleApprove: (transactionId: string, data: { observation: string; result: string; consequences: string }) => Promise<void>;
  handleReject: (transactionId: string, data: { observation: string; result: string; consequences: string }) => Promise<void>;
  handleViewDetails: (transactionId: string) => Promise<void>;
  closeDetailsModal: () => void;
  refreshData: () => Promise<void>;
}

export function useTransactions(
  businessId: number = 0,
  customerId: number = 0,
  transactionId: number = 0
): UseTransactionsReturn {
  // Estados de datos
  const [transactions, setTransactions] = useState<SuspiciousTransaction[]>([]);

  // Estados de carga
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Estados de filtros y paginación
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<TransactionFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Estados del modal de detalles
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<SuspiciousTransaction | null>(null);

  // Cargar transacciones
  const loadTransactions = useCallback(async () => {
    setIsLoading(true);
    try {
      const searchParams: TransactionSearchParams = {
        query: searchQuery || undefined,
        filters,
        page: currentPage,
        limit: 10,
      };

      const response = await getSuspiciousTransactions(
        businessId || 0,
        searchParams,
        customerId || 0,
        transactionId || 0
      );
      
      console.log("response =======>", response);
      setTransactions(response.transactions);
      setTotalPages(response.totalPages);
      setTotalCount(response.total);
    } catch (error) {
      console.error("Error al cargar transacciones:", error);
      toast.error("Error al cargar las transacciones");
    } finally {
      setIsLoading(false);
    }
  }, [businessId, customerId, transactionId, searchQuery, filters, currentPage]);


  // Aprobar transacción
  const handleApprove = useCallback(async (
    transactionId: string,
    data: { observation: string; result: string; consequences: string }
  ) => {
    setIsProcessing(true);
    try {
      await approveTransaction(transactionId, data);
      toast.success("Transacción aprobada exitosamente");
      await refreshData();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Error desconocido al aprobar la transacción";
      toast.error(`Error al aprobar la transacción: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Rechazar transacción
  const handleReject = useCallback(async (
    transactionId: string,
    data: { observation: string; result: string; consequences: string }
  ) => {
    setIsProcessing(true);
    try {
      await rejectTransaction(transactionId, data);
      toast.success("Transacción rechazada exitosamente");
      await refreshData();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Error desconocido al rechazar la transacción";
      toast.error(`Error al rechazar la transacción: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Ver detalles de transacción
  const handleViewDetails = useCallback(async (transactionId: string) => {
    try {
      const transaction = await getTransactionById(transactionId, businessId);
      setSelectedTransaction(transaction);
      setIsDetailsModalOpen(true);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Error desconocido al cargar los detalles";
      toast.error(`Error al cargar los detalles: ${errorMessage}`);
    }
  }, [businessId]);

  // Cerrar modal de detalles
  const closeDetailsModal = useCallback(() => {
    setIsDetailsModalOpen(false);
    setSelectedTransaction(null);
  }, []);

  // Refrescar datos
  const refreshData = useCallback(async () => {
    await Promise.all([loadTransactions()]);
  }, [loadTransactions]);

  // Efectos
  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  // Resetear página cuando cambien los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters]);

  return {
    // Datos
    transactions,
    
    // Estados de carga
    isLoading,
    isProcessing,
    
    // Filtros y búsqueda
    searchQuery,
    filters,
    currentPage,
    totalPages,
    totalCount,
    
    // Estados del modal de detalles
    isDetailsModalOpen,
    selectedTransaction,
    
    // Acciones
    setSearchQuery,
    setFilters,
    setCurrentPage,
    loadTransactions,
    handleApprove,
    handleReject,
    handleViewDetails,
    closeDetailsModal,
    refreshData,
  };
}
