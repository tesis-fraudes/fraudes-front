// MÓDULO: TRANSACCIONES SOSPECHOSAS
import { ENV } from "@/shared/const/env";
import { apiService } from "@/shared/services";

// Función helper para mapear datos de la API real al formato esperado
function mapApiTransactionToSuspiciousTransaction(
  item: any
): SuspiciousTransaction {
  return {
    id: item.id.toString(),
    amount: item.amount,
    merchant: `Business ${item.businessId}`,
    cardNumber: `**** **** **** ${item.paymentId}`,
    location: `${item.countryIp}`,
    riskScore: item.fraudScore,
    status:
      item.status === 3
        ? "pendiente"
        : item.status === 1
        ? "aprobada"
        : "rechazada",
    timestamp: item.createdAt,
    fraudType:
      item.fraudScore >= 80
        ? "Alto Riesgo"
        : item.fraudScore >= 60
        ? "Riesgo Medio"
        : "Bajo Riesgo",
    customerId: item.customerId.toString(),
    businessId: item.businessId.toString(),
    deviceInfo: `${item.deviceType} - ${item.browser}`,
    ipAddress: item.ipAddress,
    fraud_event_id: item?.fraud_event_id || "",
  };
}

export interface SuspiciousTransaction {
  id: string;
  amount: number;
  merchant: string;
  cardNumber: string;
  location: string;
  riskScore: number;
  status: "pendiente" | "aprobada" | "rechazada";
  timestamp: string;
  fraudType: string;
  customerId: string;
  businessId: string;
  deviceInfo: string;
  ipAddress: string;
  fraud_event_id?: string;
  business: object & {
    tradeName?: string;
  };
}

export interface TransactionFilters {
  status?: string;
  riskScoreMin?: number;
  riskScoreMax?: number;
  dateFrom?: string;
  dateTo?: string;
  merchant?: string;
  fraudType?: string;
  riskLevel?: string; // low | medium | high
}

export interface TransactionSearchParams {
  query?: string;
  filters?: TransactionFilters;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface TransactionSearchResponse {
  transactions: SuspiciousTransaction[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function getSuspiciousTransactions(
  businessId: number = 1,
  params: TransactionSearchParams = {}
): Promise<TransactionSearchResponse> {
  try {
    const response = await apiService.get(
      `${ENV.API_URL_TRANSACTIONS}/transaction/${businessId}/suspicious`,
      {
        params,
        headers: {
          accept: "*/*",
        },
      }
    );

    // La API devuelve el array directamente en response, no en response.data
    const data = Array.isArray(response) ? response : (response.data as any) || {};

    // Si la respuesta es un array directo, adaptarlo
    if (Array.isArray(data)) {
      // Mapear los datos de la API real al formato esperado
      const mappedTransactions = data.map(
        mapApiTransactionToSuspiciousTransaction
      );

      return {
        transactions: mappedTransactions,
        total: data.length,
        page: params.page || 1,
        limit: params.limit || 10,
        totalPages: Math.ceil(data.length / (params.limit || 10)),
      };
    }

    // Si la respuesta tiene la estructura esperada
    return {
      transactions: data.transactions || [],
      total: data.total || 0,
      page: data.page || params.page || 1,
      limit: data.limit || params.limit || 10,
      totalPages:
        data.totalPages ||
        Math.ceil((data.total || 0) / (data.limit || params.limit || 10)),
    };
  } catch (error) {
    console.error("Error al obtener transacciones sospechosas:", error);

    // En caso de error, devolver estructura vacía en lugar de lanzar error
    return {
      transactions: [],
      total: 0,
      page: params.page || 1,
      limit: params.limit || 10,
      totalPages: 1,
    };
  }
}

export async function getTransactionById(
  id: string,
  businessId: number = 1
): Promise<SuspiciousTransaction> {
  try {
    // Por ahora, buscar la transacción en la lista de transacciones sospechosas
    // ya que no hay un endpoint específico para obtener una transacción por ID
    const response = await apiService.get(
      `${ENV.API_URL_TRANSACTIONS}/transaction/${businessId}/suspicious`,
      {
        headers: {
          accept: "*/*",
        },
      }
    );

    // La API devuelve el array directamente en response
    const data = Array.isArray(response) ? response : (response.data as any) || {};
    
    if (Array.isArray(data)) {
      // Buscar la transacción por ID
      const transaction = data.find((item: any) => item.id.toString() === id);
      if (transaction) {
        return mapApiTransactionToSuspiciousTransaction(transaction);
      }
    }

    throw new Error(`Transacción con ID ${id} no encontrada`);
  } catch (error) {
    console.error("Error al obtener transacción por ID:", error);
    throw error;
  }
}

export async function approveTransaction(
  id: string,
  data: { observation: string; result: string; consequences: string }
): Promise<void> {
  try {
    await apiService.put(
      `${ENV.API_URL_TRANSACTIONS}/transaction/fraud_event/${id}`,
      {
        action: "approve",
        observation: data.observation,
        result: data.result,
        consequences: data.consequences
      },
      {
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
      }
    );
  } catch (error) {
    console.error("Error al aprobar transacción:", error);
    throw error;
  }
}

export async function rejectTransaction(
  id: string,
  data: { observation: string; result: string; consequences: string }
): Promise<void> {
  try {
    await apiService.put(
      `${ENV.API_URL_TRANSACTIONS}/transaction/fraud_event/${id}`,
      {
        action: "reject",
        observation: data.observation,
        result: data.result,
        consequences: data.consequences
      },
      {
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
      }
    );
  } catch (error) {
    console.error("Error al rechazar transacción:", error);
    throw error;
  }
}

export async function getTransactionStatisticsSearch(businessId: number = 0, customerId = 0, transactionId = 0): Promise<{
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  highRisk: number;
  mediumRisk: number;
  lowRisk: number;
}> {
  try {
    // Por ahora, calcular estadísticas basadas en las transacciones existentes
    // En el futuro, esto podría ser un endpoint específico de estadísticas
    const response = await apiService.post(
      `${ENV.API_URL_TRANSACTIONS}/transaction/${businessId}/suspicious`,
      {
        business_id: businessId,
        customer_id: customerId,
        transaction_id: transactionId,
      },
      {
        headers: {
          accept: "*/*",
        },
      }
    );

    // La API devuelve el array directamente en response, no en response.data
    const data = Array.isArray(response) ? response : (response.data as any) || {};

    // Asegurar que transactions sea un array y mapear los datos
    let transactions = [];
    if (Array.isArray(data)) {
      // Mapear los datos de la API real al formato esperado
      transactions = data.map(mapApiTransactionToSuspiciousTransaction);
    } else if (Array.isArray(data.transactions)) {
      transactions = data.transactions;
    } else if (data && typeof data === "object") {
      // Si data es un objeto pero no tiene transactions, intentar usar data directamente
      transactions = [data];
    }

    // Calcular estadísticas basadas en las transacciones
    const stats = {
      total: transactions.length,
      pending: transactions.filter((t: any) => t.status === "pendiente").length,
      approved: transactions.filter((t: any) => t.status === "aprobada").length,
      rejected: transactions.filter((t: any) => t.status === "rechazada")
        .length,
      highRisk: transactions.filter((t: any) => t.riskScore >= 75).length,
      mediumRisk: transactions.filter(
        (t: any) => t.riskScore >= 51 && t.riskScore < 75
      ).length,
      lowRisk: transactions.filter((t: any) => t.riskScore < 51).length,
    };

    return stats;
  } catch (error) {
    console.error("Error al obtener estadísticas de transacciones:", error);

    // Devolver estadísticas vacías en caso de error
    return {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      highRisk: 0,
      mediumRisk: 0,
      lowRisk: 0,
    };
  }
}

export async function getTransactionStatistics(businessId: number = 1): Promise<{
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  highRisk: number;
  mediumRisk: number;
  lowRisk: number;
}> {
  try {
    // Por ahora, calcular estadísticas basadas en las transacciones existentes
    // En el futuro, esto podría ser un endpoint específico de estadísticas
    const response = await apiService.get(
      `${ENV.API_URL_TRANSACTIONS}/transaction/${businessId}/suspicious`,
      {
        headers: {
          accept: "*/*",
        },
      }
    );

    // La API devuelve el array directamente en response, no en response.data
    const data = Array.isArray(response) ? response : (response.data as any) || {};

    // Asegurar que transactions sea un array y mapear los datos
    let transactions = [];
    if (Array.isArray(data)) {
      // Mapear los datos de la API real al formato esperado
      transactions = data.map(mapApiTransactionToSuspiciousTransaction);
    } else if (Array.isArray(data.transactions)) {
      transactions = data.transactions;
    } else if (data && typeof data === "object") {
      // Si data es un objeto pero no tiene transactions, intentar usar data directamente
      transactions = [data];
    }

    // Calcular estadísticas basadas en las transacciones
    const stats = {
      total: transactions.length,
      pending: transactions.filter((t: any) => t.status === "pendiente").length,
      approved: transactions.filter((t: any) => t.status === "aprobada").length,
      rejected: transactions.filter((t: any) => t.status === "rechazada")
        .length,
      highRisk: transactions.filter((t: any) => t.riskScore >= 75).length,
      mediumRisk: transactions.filter(
        (t: any) => t.riskScore >= 51 && t.riskScore < 75
      ).length,
      lowRisk: transactions.filter((t: any) => t.riskScore < 51).length,
    };

    return stats;
  } catch (error) {
    console.error("Error al obtener estadísticas de transacciones:", error);

    // Devolver estadísticas vacías en caso de error
    return {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      highRisk: 0,
      mediumRisk: 0,
      lowRisk: 0,
    };
  }
}

// Nuevas funciones usando endpoints reales
export interface CustomerLastMovements {
  customer_id: number;
  last_transactions: Array<{
    id: string;
    amount: number;
    date: string;
    merchant: string;
  }>;
  average_spend: number;
  total_transactions: number;
  business?: object & {
    tradeName?: string;
  };
}

export interface CustomerFraudHistory {
  customer_id: number;
  fraud_count: number;
  fraud_transactions: Array<{
    id: string;
    amount: number;
    date: string;
    fraud_type: string;
    status: string;
  }>;
  last_fraud_date: string;
}

export async function getCustomerLastMovements(
  businessId: number,
  customerId: number
): Promise<CustomerLastMovements> {
  try {
    const response = await apiService.get(
      `${ENV.API_URL_TRANSACTIONS}/transaction/customer/${customerId}/last`,
      {
        headers: {
          accept: "*/*",
        },
      }
    );

    // La API devuelve { average_amount, items }
    const data = Array.isArray(response) ? { items: response } : (response.data as any) || response || {};

    // Mapear los items a nuestro formato esperado
    const items = data.items || [];
    const lastTransactions = items.map((item: any) => ({
      id: item.id?.toString() || item.paymentId?.toString() || "",
      amount: item.amount || 0,
      date: item.createdAt || item.timestamp || new Date().toISOString(),
      merchant: `Business ${item.businessId}`,
    }));

    return {
      customer_id: customerId,
      last_transactions: lastTransactions,
      average_spend: data.average_amount || 0,
      total_transactions: items.length,
    };
  } catch (error) {
    console.error("Error al obtener últimos movimientos del cliente:", error);

    // Devolver estructura vacía en caso de error
    return {
      customer_id: customerId,
      last_transactions: [],
      average_spend: 0,
      total_transactions: 0,
    };
  }
}

export async function getCustomerFraudHistory(
  businessId: number,
  customerId: number
): Promise<CustomerFraudHistory> {
  try {
    const response = await apiService.get(
      `${ENV.API_URL_TRANSACTIONS}/transaction/customer/${customerId}/frauds`,
      {
        headers: {
          accept: "*/*",
        },
      }
    );

    // La API devuelve un array directo de transacciones fraudulentas
    const data = Array.isArray(response) ? response : (response.data as any) || [];
    const fraudTransactions = Array.isArray(data) ? data : [];

    // Mapear las transacciones al formato esperado
    const mappedFraudTransactions = fraudTransactions.map((item: any) => ({
      id: item.id?.toString() || "",
      amount: item.amount || 0,
      date: item.createdAt || item.timestamp || new Date().toISOString(),
      fraud_type: item.fraudScore >= 75 
        ? "Alto Riesgo" 
        : item.fraudScore >= 50 
        ? "Riesgo Medio" 
        : "Bajo Riesgo",
      status: item.status === 5 
        ? "Fraude Confirmado" 
        : item.status === 3 
        ? "Pendiente" 
        : item.status === 1 
        ? "Aprobada" 
        : "Rechazada",
    }));

    // Encontrar la fecha del último fraude
    let lastFraudDate = "";
    if (fraudTransactions.length > 0) {
      // Ordenar por fecha descendente y tomar el primero
      const sortedFrauds = [...fraudTransactions].sort((a: any, b: any) => {
        const dateA = new Date(a.createdAt || a.timestamp).getTime();
        const dateB = new Date(b.createdAt || b.timestamp).getTime();
        return dateB - dateA;
      });
      lastFraudDate = sortedFrauds[0].createdAt || sortedFrauds[0].timestamp || "";
    }

    return {
      customer_id: customerId,
      fraud_count: fraudTransactions.length,
      fraud_transactions: mappedFraudTransactions,
      last_fraud_date: lastFraudDate,
    };
  } catch (error) {
    console.error("Error al obtener historial de fraudes del cliente:", error);

    // Devolver estructura vacía en caso de error
    return {
      customer_id: customerId,
      fraud_count: 0,
      fraud_transactions: [],
      last_fraud_date: "",
    };
  }
}

export async function getCustomerActivePaymentMethods(
  customerId: number
): Promise<
  Array<{
    id: number;
    type: string;
    last_four: string;
    status: string;
    expiry_date?: string;
  }>
> {
  try {
    const response = await apiService.get(
      `${ENV.API_URL_TRANSACTIONS}/customers/${customerId}/payment_methods/active`,
      {
        headers: {
          accept: "*/*",
        },
      }
    );

    // La API devuelve un array directo
    const data = Array.isArray(response) ? response : (response.data as any) || [];
    const paymentMethods = Array.isArray(data) ? data : [];

    // Mapear al formato esperado por el componente
    return paymentMethods.map((method: any) => {
      // Extraer los últimos 4 dígitos del número
      const numberStr = method.number || "";
      const lastFour = numberStr.replace(/\s/g, "").slice(-4);

      return {
        id: method.id,
        type: method.provider || method.typePayment || "Unknown",
        last_four: lastFour,
        status: method.status === 1 ? "active" : "inactive",
        expiry_date: method.expiryDate || undefined,
      };
    });
  } catch (error) {
    console.error(
      "Error al obtener métodos de pago activos del cliente:",
      error
    );
    return [];
  }
}
