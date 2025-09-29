"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { useTransactions } from "../hooks/useTransactions";
import { useAuth } from "../../guard/hooks/useAuth";
import TransactionFilters from "./TransactionFilters";
import TransactionCard from "./TransactionCard";
import ApprovalModal from "./ApprovalModal";
import { TransactionDetailsModal } from "./TransactionDetailsModal";
import type { SuspiciousTransaction } from "../services";

export default function ContentTransactionsPage() {
  const { user } = useAuth();
  const businessId = user?.businessId || 1; // Usar businessId del usuario o 1 por defecto
  
  const {
    transactions,
    isLoading,
    isProcessing,
    searchQuery,
    filters,
    currentPage,
    totalPages,
    totalCount,
    isDetailsModalOpen,
    selectedTransaction,
    setSearchQuery,
    setFilters,
    setCurrentPage,
    handleApprove,
    handleReject,
    handleViewDetails,
    closeDetailsModal,
    refreshData,
  } = useTransactions(businessId);

  // Estados para el modal de aprobación/rechazo
  const [approvalTransaction, setApprovalTransaction] = useState<SuspiciousTransaction | null>(null);
  const [approvalAction, setApprovalAction] = useState<"approve" | "reject" | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleApproveClick = (transactionId: string) => {
    const transaction = transactions.find(t => t.id === transactionId);
    if (transaction) {
      setApprovalTransaction(transaction);
      setApprovalAction("approve");
      setIsModalOpen(true);
    }
  };

  const handleRejectClick = (transactionId: string) => {
    const transaction = transactions.find(t => t.id === transactionId);
    if (transaction) {
      setApprovalTransaction(transaction);
      setApprovalAction("reject");
      setIsModalOpen(true);
    }
  };

  const handleModalConfirm = async (
    transactionId: string,
    action: "approve" | "reject",
    data: { observation: string; result: string; consequences: string }
  ) => {
    if (action === "approve") {
      await handleApprove(transactionId, data);
    } else {
      await handleReject(transactionId, data);
    }
    setIsModalOpen(false);
    setApprovalTransaction(null);
    setApprovalAction(null);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setApprovalTransaction(null);
    setApprovalAction(null);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Revisión Manual</h1>
            <div className="text-sm text-blue-600 mt-1">
              Business ID: {businessId} {user?.businessId ? `(Usuario: ${user.name})` : '(Por defecto)'}
            </div>
          </div>
          <Button
            variant="outline"
            onClick={refreshData}
            disabled={isLoading}
            className="bg-transparent"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${(isLoading) ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <TransactionFilters
        onFiltersChange={setFilters}
        onSearchChange={setSearchQuery}
        searchQuery={searchQuery}
        filters={filters}
      />

      {/* Lista de transacciones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Transacciones Sospechosas ({totalCount})
          </CardTitle>
          <CardDescription>
            Transacciones que requieren revisión manual
            {totalPages > 1 && ` • Página ${currentPage} de ${totalPages}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="border rounded-lg p-4 animate-pulse">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                    <div className="flex gap-2">
                      <div className="h-8 bg-gray-200 rounded w-20"></div>
                      <div className="h-8 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay transacciones sospechosas
              </h3>
              <p className="text-gray-500">
                {searchQuery || Object.keys(filters).length > 0
                  ? "No se encontraron transacciones con los filtros aplicados."
                  : "No hay transacciones pendientes de revisión en este momento."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <TransactionCard
                  key={transaction.id}
                  transaction={transaction}
                  onViewDetails={handleViewDetails}
                  onApprove={handleApproveClick}
                  onReject={handleRejectClick}
                  isLoading={isProcessing}
                />
              ))}
            </div>
          )}

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                Mostrando {transactions.length} de {totalCount} transacciones
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1 || isLoading}
                >
                  Anterior
                </Button>
                <span className="flex items-center px-3 py-1 text-sm">
                  Página {currentPage} de {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages || isLoading}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de aprobación/rechazo */}
      <ApprovalModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        transaction={approvalTransaction}
        action={approvalAction}
        onConfirm={handleModalConfirm}
        isLoading={isProcessing}
      />

      {/* Modal de detalles de transacción */}
      <TransactionDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={closeDetailsModal}
        transaction={selectedTransaction}
      />
    </div>
  );
}
