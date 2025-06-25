import { useState } from 'react';
import { XMarkIcon, DocumentTextIcon, TableCellsIcon } from '@heroicons/react/24/outline';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const ExportModal = ({ data, columns, title, onClose }) => {
  const [exportFormat, setExportFormat] = useState('pdf');
  const [selectedColumns, setSelectedColumns] = useState(
    columns.reduce((acc, col) => ({ ...acc, [col.key]: true }), {})
  );
  const [includeFilters, setIncludeFilters] = useState(false);

  const getSelectedColumns = () => {
    return columns.filter(col => selectedColumns[col.key]);
  };

  const getExportData = () => {
    const selectedCols = getSelectedColumns();
    return data.map(row => {
      const exportRow = {};
      selectedCols.forEach(col => {
        // For export, we want the raw value, not the rendered component
        exportRow[col.label] = row[col.key];
      });
      return exportRow;
    });
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const selectedCols = getSelectedColumns();
    const exportData = getExportData();

    // Add title
    doc.setFontSize(16);
    doc.text(title, 14, 22);

    // Add timestamp
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 32);

    // Prepare table data
    const headers = selectedCols.map(col => col.label);
    const rows = exportData.map(row => 
      selectedCols.map(col => row[col.label] || '')
    );

    // Add table
    doc.autoTable({
      head: [headers],
      body: rows,
      startY: 40,
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [59, 130, 246], // Primary blue
        textColor: 255,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252], // Light gray
      },
    });

    // Save the PDF
    const fileName = `${title.replace(/\s+/g, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  };

  const exportToExcel = () => {
    const selectedCols = getSelectedColumns();
    const exportData = getExportData();

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);

    // Set column widths
    const colWidths = selectedCols.map(col => ({
      wch: Math.max(col.label.length, 15)
    }));
    ws['!cols'] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Data');

    // Generate Excel file
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    const fileName = `${title.replace(/\s+/g, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}.xlsx`;
    saveAs(blob, fileName);
  };

  const handleExport = () => {
    if (exportFormat === 'pdf') {
      exportToPDF();
    } else if (exportFormat === 'excel') {
      exportToExcel();
    }
    onClose();
  };

  const handleColumnToggle = (columnKey) => {
    setSelectedColumns(prev => ({
      ...prev,
      [columnKey]: !prev[columnKey]
    }));
  };

  const selectAllColumns = () => {
    setSelectedColumns(columns.reduce((acc, col) => ({ ...acc, [col.key]: true }), {}));
  };

  const deselectAllColumns = () => {
    setSelectedColumns(columns.reduce((acc, col) => ({ ...acc, [col.key]: false }), {}));
  };

  const selectedCount = Object.values(selectedColumns).filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>

        {/* Modal panel */}
        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Export Data</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Export Format Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Export Format
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setExportFormat('pdf')}
                className={`flex items-center justify-center p-3 border rounded-lg transition-colors ${
                  exportFormat === 'pdf'
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <DocumentTextIcon className="h-5 w-5 mr-2" />
                PDF
              </button>
              <button
                onClick={() => setExportFormat('excel')}
                className={`flex items-center justify-center p-3 border rounded-lg transition-colors ${
                  exportFormat === 'excel'
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <TableCellsIcon className="h-5 w-5 mr-2" />
                Excel
              </button>
            </div>
          </div>

          {/* Column Selection */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Select Columns ({selectedCount} of {columns.length})
              </label>
              <div className="flex space-x-2">
                <button
                  onClick={selectAllColumns}
                  className="text-xs text-primary-600 hover:text-primary-800"
                >
                  Select All
                </button>
                <button
                  onClick={deselectAllColumns}
                  className="text-xs text-gray-600 hover:text-gray-800"
                >
                  Deselect All
                </button>
              </div>
            </div>
            <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-md p-2">
              {columns.map(column => (
                <label key={column.key} className="flex items-center py-1">
                  <input
                    type="checkbox"
                    checked={selectedColumns[column.key]}
                    onChange={() => handleColumnToggle(column.key)}
                    className="mr-2 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">{column.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Export Options */}
          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={includeFilters}
                onChange={(e) => setIncludeFilters(e.target.checked)}
                className="mr-2 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">Include current filters</span>
            </label>
          </div>

          {/* Export Info */}
          <div className="mb-6 p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600">
              <strong>Records to export:</strong> {data.length}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Columns to export:</strong> {selectedCount}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              disabled={selectedCount === 0}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Export {exportFormat.toUpperCase()}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
