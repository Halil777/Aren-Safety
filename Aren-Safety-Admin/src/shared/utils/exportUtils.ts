import { message } from 'antd';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Export data to Excel file with styled header
 */
export const exportToExcel = <T extends Record<string, any>>(
  data: T[],
  filename: string,
  sheetName: string = 'Sheet1'
): void => {
  try {
    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Convert data to worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);

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

    // Set column widths
    const colWidths = [];
    for (let col = range.s.c; col <= range.e.c; col++) {
      colWidths.push({ wch: 20 });
    }
    worksheet['!cols'] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, `${filename}.xlsx`, { cellStyles: true });

    message.success('Excel file downloaded successfully');
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    message.error('Failed to export to Excel');
  }
};

/**
 * Export data to PDF file using jsPDF
 */
export const exportToPDF = (elementId: string, filename: string): void => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      message.error('Export element not found');
      return;
    }

    // Extract table data from the element
    const table = element.querySelector('table');
    if (!table) {
      message.error('No table found to export');
      return;
    }

    // Create PDF document
    const doc = new jsPDF('l', 'mm', 'a4');

    // Add title
    doc.setFontSize(16);
    doc.text(filename, 14, 15);

    // Extract headers
    const headers: string[] = [];
    const headerCells = table.querySelectorAll('thead th');
    headerCells.forEach((cell) => {
      const text = cell.textContent?.trim() || '';
      if (text && !text.includes('Actions')) {
        headers.push(text);
      }
    });

    // Extract rows
    const rows: string[][] = [];
    const bodyRows = table.querySelectorAll('tbody tr');
    bodyRows.forEach((row) => {
      const rowData: string[] = [];
      const cells = row.querySelectorAll('td');
      cells.forEach((cell, index) => {
        if (index < headers.length) {
          rowData.push(cell.textContent?.trim() || '');
        }
      });
      if (rowData.length > 0) {
        rows.push(rowData);
      }
    });

    // Generate table in PDF
    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 25,
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [0, 0, 0], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [245, 247, 250] },
      margin: { top: 25, left: 10, right: 10 },
    });

    // Open PDF in new tab
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');

    message.success('PDF generated successfully');
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    message.error('Failed to export to PDF');
  }
};

/**
 * Print table content
 */
export const printTable = (elementId: string): void => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      message.error('Print element not found');
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      message.error('Please allow popups for this website');
      return;
    }

    // Extract table data
    const table = element.querySelector('table');
    if (!table) {
      message.error('No table found to print');
      return;
    }

    // Clone the table to avoid modifying the original
    const tableClone = table.cloneNode(true) as HTMLTableElement;

    // Remove action columns from the clone
    const actionHeaders = tableClone.querySelectorAll('thead th');
    const actionColumnIndices: number[] = [];
    actionHeaders.forEach((header, index) => {
      if (header.textContent?.includes('Actions') || header.textContent?.includes('Action')) {
        actionColumnIndices.push(index);
      }
    });

    // Remove action column headers
    actionColumnIndices.reverse().forEach(index => {
      actionHeaders[index]?.remove();
    });

    // Remove action column cells from body
    const bodyRows = tableClone.querySelectorAll('tbody tr');
    bodyRows.forEach(row => {
      const cells = row.querySelectorAll('td');
      actionColumnIndices.reverse().forEach(index => {
        cells[index]?.remove();
      });
    });

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print</title>
          <style>
            body {
              margin: 0;
              padding: 20px;
              font-family: Arial, sans-serif;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 12px 8px;
              text-align: left;
              font-size: 12px;
            }
            th {
              background-color: #000000 !important;
              color: #ffffff !important;
              font-weight: bold;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            tr:nth-child(even) {
              background-color: #f8fafc;
            }
            button, .ant-btn, .actions-column {
              display: none !important;
            }
            @media print {
              body {
                padding: 10px;
              }
              .no-print, button, .ant-btn {
                display: none !important;
              }
              th {
                background-color: #000000 !important;
                color: #ffffff !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
            }
          </style>
        </head>
        <body>
          ${tableClone.outerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();

    // Wait for content to load, then trigger print
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 500);

    message.success('Print dialog opened');
  } catch (error) {
    console.error('Error printing:', error);
    message.error('Failed to print');
  }
};

/**
 * Helper function to flatten nested objects for Excel export
 */
export const flattenObject = (obj: Record<string, any>, prefix = ''): Record<string, any> => {
  const flattened: Record<string, any> = {};

  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(flattened, flattenObject(value, newKey));
    } else if (Array.isArray(value)) {
      flattened[newKey] = value.join(', ');
    } else {
      flattened[newKey] = value;
    }
  });

  return flattened;
};

/**
 * Format data for export by removing unwanted fields and flattening
 */
export const prepareDataForExport = <T extends Record<string, any>>(
  data: T[],
  excludeFields: string[] = ['id', 'avatar']
): any[] => {
  return data.map((item) => {
    const flattened = flattenObject(item);

    // Remove excluded fields
    excludeFields.forEach((field) => {
      delete flattened[field];
    });

    return flattened;
  });
};
