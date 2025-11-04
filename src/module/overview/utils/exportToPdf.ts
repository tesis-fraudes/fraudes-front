import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/**
 * Exporta los gráficos del overview a PDF
 */
export async function exportOverviewToPdf(
  elementId: string = "overview-charts",
  filename: string = "overview-reporte-fraudes.pdf"
) {
  try {
    const element = document.getElementById(elementId);

    if (!element) {
      throw new Error("No se encontró el elemento con los gráficos");
    }

    // Mostrar loading
    const loadingToast = document.createElement("div");
    loadingToast.textContent = "Generando PDF...";
    loadingToast.style.cssText =
      "position: fixed; top: 20px; right: 20px; background: #333; color: white; padding: 15px 20px; border-radius: 8px; z-index: 9999;";
    document.body.appendChild(loadingToast);

    // Pre-procesar: convertir colores modernos a RGB antes de capturar
    const originalStyles = new Map<
      HTMLElement,
      { color?: string; backgroundColor?: string }
    >();

    // Convertir colores problemáticos usando canvas
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = 1;
    tempCanvas.height = 1;
    const ctx = tempCanvas.getContext("2d");

    if (ctx) {
      const allElements = element.querySelectorAll("*");
      for (const el of allElements) {
        const htmlEl = el as HTMLElement;
        const computedStyle = window.getComputedStyle(htmlEl);

        // Guardar estilos originales
        const original: { color?: string; backgroundColor?: string } = {};

        // Convertir color de texto si es necesario
        const color = computedStyle.color;
        if (color && (color.includes("oklab") || color.includes("oklch"))) {
          try {
            ctx.fillStyle = color;
            ctx.fillRect(0, 0, 1, 1);
            const rgb = ctx.getImageData(0, 0, 1, 1).data;
            original.color = htmlEl.style.color;
            htmlEl.style.color = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
          } catch {
            // Ignorar errores de conversión
          }
        }

        // Convertir background-color si es necesario
        const bgColor = computedStyle.backgroundColor;
        if (
          bgColor &&
          (bgColor.includes("oklab") || bgColor.includes("oklch"))
        ) {
          try {
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, 1, 1);
            const rgb = ctx.getImageData(0, 0, 1, 1).data;
            original.backgroundColor = htmlEl.style.backgroundColor;
            htmlEl.style.backgroundColor = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
          } catch {
            // Ignorar errores de conversión
          }
        }

        if (Object.keys(original).length > 0) {
          originalStyles.set(htmlEl, original);
        }
      }
    }

    // Capturar el elemento como canvas
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    });

    // Restaurar estilos originales
    for (const [el, styles] of originalStyles.entries()) {
      if (styles.color !== undefined) {
        el.style.color = styles.color;
      }
      if (styles.backgroundColor !== undefined) {
        el.style.backgroundColor = styles.backgroundColor;
      }
    }

    // Crear PDF
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgScaledWidth = imgWidth * ratio;
    const imgScaledHeight = imgHeight * ratio;

    // Calcular centrado
    const xOffset = (pdfWidth - imgScaledWidth) / 2;
    const yOffset = (pdfHeight - imgScaledHeight) / 2;

    // Si la imagen es más grande que una página, dividir en múltiples páginas
    const pageHeight = pdfHeight;
    let heightLeft = imgScaledHeight;
    let position = 0;

    pdf.addImage(
      imgData,
      "PNG",
      xOffset,
      yOffset + position,
      imgScaledWidth,
      imgScaledHeight
    );
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgScaledHeight;
      pdf.addPage();
      pdf.addImage(
        imgData,
        "PNG",
        xOffset,
        position,
        imgScaledWidth,
        imgScaledHeight
      );
      heightLeft -= pageHeight;
    }

    // Guardar PDF
    pdf.save(filename);

    // Remover loading
    document.body.removeChild(loadingToast);
  } catch (error) {
    console.error("Error al exportar PDF:", error);
    throw error;
  }
}
