"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { AlertTriangle, RefreshCw, Building2, User, Hash } from "lucide-react";
import { useTransactions } from "../hooks/useTransactions";
import { useAuth } from "../../guard/hooks/useAuth";
import TransactionCard from "./TransactionCard";
import ApprovalModal from "./ApprovalModal";
import { TransactionDetailsModal } from "./TransactionDetailsModal";
import type { SuspiciousTransaction } from "../services";
import { getBusinessList, type Business, getCustomerList, type Customer } from "@/shared/services";

export default function ContentTransactionsPage() {
  const { user } = useAuth();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState<number>(0);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number>(0);
  const [transactionIdFilter, setTransactionIdFilter] = useState<string>("");
  const [isLoadingBusinesses, setIsLoadingBusinesses] = useState(true);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(true);

  // Cargar lista de negocios al montar el componente
  useEffect(() => {
    const loadBusinesses = async () => {
      try {
        setIsLoadingBusinesses(true);
        const businessList = await getBusinessList();
        setBusinesses(businessList);

        // Si el usuario tiene un businessId, usarlo por defecto
        if (user?.businessId && businessList.some(b => b.id === user.businessId)) {
          setSelectedBusinessId(user.businessId);
        }
      } catch (error) {
        console.error("Error al cargar negocios:", error);
      } finally {
        setIsLoadingBusinesses(false);
      }
    };

    loadBusinesses();
  }, [user?.businessId]);

  // Cargar lista de clientes al montar el componente
  useEffect(() => {
    const loadCustomers = async () => {
      try {
        setIsLoadingCustomers(true);
        const customerList = await getCustomerList();
        setCustomers(customerList);
      } catch (error) {
        console.error("Error al cargar clientes:", error);
      } finally {
        setIsLoadingCustomers(false);
      }
    };

    loadCustomers();
  }, []);

  const businessId = selectedBusinessId;
  const customerId = selectedCustomerId;
  const transactionId = transactionIdFilter ? Number(transactionIdFilter) : 0;

  const {
    transactions,
    isLoading,
    isProcessing,
    currentPage,
    totalPages,
    totalCount,
    isDetailsModalOpen,
    selectedTransaction,
    setCurrentPage,
    handleApprove,
    handleReject,
    handleViewDetails,
    closeDetailsModal,
    refreshData,
  } = useTransactions(businessId, customerId, transactionId);

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
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">Revisión Manual de transacciones sospechosas</h1>

            {/* Filtros */}
            <div className="flex flex-wrap items-center gap-4 mt-4">
              {/* Selector de Negocio */}
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Comercio:</span>
                <Select
                  value={selectedBusinessId.toString()}
                  onValueChange={(value) => setSelectedBusinessId(Number(value))}
                  disabled={isLoadingBusinesses}
                >
                  <SelectTrigger className="w-[280px]">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Todos</SelectItem>
                    {businesses.map((business, idx) => (
                      <SelectItem key={`business_selector_${business.id}_${idx}`} value={business.id.toString()}>
                        {business.tradeName}
                        {user?.businessId === business.id && " (Tu negocio)"}
                      </SelectItem>
                    ))}
                    {businesses.length === 0 && !isLoadingBusinesses && (
                      <SelectItem key="no-business" value="999" disabled>
                        No hay negocios disponibles
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Selector de Cliente */}
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Cliente:</span>
                <Select
                  value={selectedCustomerId.toString()}
                  onValueChange={(value) => setSelectedCustomerId(Number(value))}
                  disabled={isLoadingCustomers}
                >
                  <SelectTrigger className="w-[280px]">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Todos</SelectItem>
                    {customers.map((customer, idx) => (
                      <SelectItem key={`customer_selector_${customer.id}_${idx}`} value={customer.id.toString()}>
                        {customer.name}
                      </SelectItem>
                    ))}
                    {customers.length === 0 && !isLoadingCustomers && (
                      <SelectItem key="no-customer" value="999" disabled>
                        No hay clientes disponibles
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Input de Transaction ID */}
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">ID Transacción:</span>
                <Input
                  type="number"
                  placeholder="Ingrese ID"
                  value={transactionIdFilter}
                  onChange={(e) => setTransactionIdFilter(e.target.value)}
                  className="w-[180px]"
                />
              </div>
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
      {/* <TransactionFilters
        onFiltersChange={setFilters}
        onSearchChange={setSearchQuery}
        searchQuery={searchQuery}
        filters={filters}
      /> */}

      {/* Lista de transacciones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Transacciones Sospechosas ({totalCount})
          </CardTitle>
          <CardDescription>
            {""}
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
                No hay transacciones pendientes de revisión en este momento.
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
