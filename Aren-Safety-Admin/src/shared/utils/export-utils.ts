import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';

type DataIndex<T> = Extract<keyof T, string>;

export interface ExportColumn<T extends Record<string, unknown>> {
  header: string;
  dataIndex: DataIndex<T>;
  render?: (value: T[DataIndex<T>]) => string;
}

interface ExportOptions<T extends Record<string, unknown>> {
  filename: string;
  title: string;
  columns: ExportColumn<T>[];
  data: T[];
}

interface ExportChartImageOptions {
  element: HTMLElement | null;
  filename: string;
  format?: 'jpeg' | 'png';
  backgroundColor?: string;
  scale?: number;
}

const toDisplayValue = <T extends Record<string, unknown>>(
  row: T,
  column: ExportColumn<T>,
): string => {
  const value = row[column.dataIndex];

  if (column.render) {
    return column.render(value as T[DataIndex<T>]);
  }

  if (value === undefined || value === null) {
    return '';
  }

  return String(value);
};

// Export to Excel
export const exportToExcel = <T extends Record<string, unknown>>({
  filename,
  columns,
  data,
}: ExportOptions<T>) => {
  const excelData = data.map((row) => {
    const excelRow: Record<string, unknown> = {};
    columns.forEach((col) => {
      excelRow[col.header] = toDisplayValue(row, col);
    });
    return excelRow;
  });

  const worksheet = XLSX.utils.json_to_sheet(excelData);

  // Set column widths
  worksheet['!cols'] = columns.map(() => ({ wch: 20 }));

  // Get the range of the worksheet
  const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');

  // Style the header row (first row) - black background with white text
  for (let col = range.s.c; col <= range.e.c; col++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
    if (!worksheet[cellAddress]) continue;

    // Add style to header cells
    worksheet[cellAddress].s = {
      fill: {
        fgColor: { rgb: "000000" }
      },
      font: {
        color: { rgb: "FFFFFF" },
        bold: true
      },
      alignment: {
        horizontal: "center",
        vertical: "center"
      }
    };
  }

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
  XLSX.writeFile(workbook, `${filename}.xlsx`, { cellStyles: true });
};

// Export to PDF
export const exportToPDF = <T extends Record<string, unknown>>({
  title,
  columns,
  data,
}: ExportOptions<T>) => {
  const doc = new jsPDF('l', 'mm', 'a4');

  doc.setFontSize(16);
  doc.text(title, 14, 15);

  const headers = columns.map((col) => col.header);
  const rows = data.map((row) => columns.map((col) => toDisplayValue(row, col)));

  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: 25,
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [0, 0, 0], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    margin: { top: 25, left: 10, right: 10 },
  });

  const pdfBlob = doc.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob);
  window.open(pdfUrl, '_blank');
};

// Print
export const printTable = <T extends Record<string, unknown>>({
  title,
  columns,
  data,
}: ExportOptions<T>) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const headers = columns.map((col) => col.header);
  const rows = data.map((row) => columns.map((col) => toDisplayValue(row, col)));

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
          }
          h1 {
            color: #1e293b;
            font-size: 24px;
            margin-bottom: 20px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #e2e8f0;
            padding: 12px;
            text-align: left;
            font-size: 12px;
          }
          th {
            background-color: #000000 !important;
            color: white;
            font-weight: 600;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          tr:nth-child(even) {
            background-color: #f8fafc;
          }
          @media print {
            body { padding: 0; }
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <table>
          <thead>
            <tr>
              ${headers.map((header) => `<th>${header}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${rows
              .map(
                (row) =>
                  `<tr>${row.map((cell) => `<td>${cell}</td>`).join('')}</tr>`
              )
              .join('')}
          </tbody>
        </table>
      </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();

  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
  };
};

export const exportChartAsImage = async ({
  element,
  filename,
  format = 'jpeg',
  backgroundColor = '#ffffff',
  scale = 2,
}: ExportChartImageOptions) => {
  if (typeof window === 'undefined' || !element) return;

  const canvas = await html2canvas(element, {
    backgroundColor,
    scale,
    useCORS: true,
  });

  const mimeType = `image/${format}`;
  const dataUrl = canvas.toDataURL(mimeType);
  const link = document.createElement('a');
  const extension = format === 'jpeg' ? 'jpg' : format;
  link.href = dataUrl;
  link.download = `${filename}.${extension}`;
  link.click();
};
