interface ExcelExportOptions {
    data: Array<Record<string, unknown>>;
    sheetName: string;
    headerMap?: Record<string, string>;
}

const EXCEL_MIME =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

/**
 * Convierte un arreglo de objetos en un Blob con formato XLSX.
 */
export async function buildExcelBlob({
    data,
    sheetName,
    headerMap,
}: ExcelExportOptions): Promise<Blob> {
    if (typeof window === "undefined") {
        throw new Error(
            "La exportación a Excel solo está disponible en el cliente.",
        );
    }

    const XLSX = await import("xlsx");

    const sanitizedData = (data || []).map((item) => {
        const normalized: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(item ?? {})) {
            const header = headerMap?.[key] ?? key;
            normalized[header] =
                value === null || value === undefined ? "" : value;
        }
        return normalized;
    });

    if (sanitizedData.length === 0) {
        sanitizedData.push({
            Mensaje: "No se encontraron registros para los filtros seleccionados",
        });
    }

    const worksheet = XLSX.utils.json_to_sheet(sanitizedData);

    const headerSet = new Set<string>();
    for (const row of sanitizedData) {
        for (const key of Object.keys(row)) {
            headerSet.add(key);
        }
    }
    const headers = Array.from(headerSet);

    if (headers.length > 0) {
        const columnWidths = headers.map((header) => {
            const headerLength = header?.length ?? 0;
            const cellsLength = sanitizedData.reduce((max, row) => {
                const cellValue = row[header];
                const length =
                    cellValue === null || cellValue === undefined
                        ? 0
                        : String(cellValue).length;
                return Math.max(max, length);
            }, 0);

            const preferredWidth = Math.max(headerLength, cellsLength) + 4;
            return { wch: Math.min(Math.max(preferredWidth, 16), 80) };
        });

        worksheet["!cols"] = columnWidths;
    }

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
    });

    return new Blob([excelBuffer], { type: EXCEL_MIME });
}

