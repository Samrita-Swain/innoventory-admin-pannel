import React from 'react';
import {
  DocumentIcon,
  PhotoIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

/**
 * FileViewer Component
 * Displays uploaded files with preview and download options
 */
const FileViewer = ({ files, title = "Uploaded Files", onRemove = null, readOnly = false }) => {
  if (!files || Object.keys(files).length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 text-center">
        <DocumentIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-500 text-sm">No files uploaded</p>
      </div>
    );
  }

  const getFileIcon = (fileType) => {
    if (fileType && fileType.startsWith('image/')) {
      return <PhotoIcon className="h-6 w-6 text-blue-500" />;
    }
    return <DocumentIcon className="h-6 w-6 text-gray-500" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileView = (file) => {
    if (file.blobUrl) {
      window.open(file.blobUrl, '_blank');
    } else if (file.relativePath) {
      // Try to open the file from the server path
      window.open(file.relativePath, '_blank');
    } else {
      console.warn('No viewable URL available for file:', file);
    }
  };

  const handleFileDownload = (file) => {
    if (file.blobUrl) {
      const link = document.createElement('a');
      link.href = file.blobUrl;
      link.download = file.originalName || file.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.warn('No downloadable URL available for file:', file);
    }
  };

  const renderFileItem = (file, label, fileKey) => {
    if (!file) return null;

    return (
      <div key={fileKey} className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <div className="flex-shrink-0">
              {getFileIcon(file.type)}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 mb-1">{label}</h4>
              <p className="text-sm text-gray-600 truncate">
                {file.originalName || file.fileName}
              </p>
              <p className="text-xs text-gray-500">
                {file.size ? formatFileSize(file.size) : 'Unknown size'}
              </p>
              {file.uploadedAt && (
                <p className="text-xs text-gray-400">
                  Uploaded: {new Date(file.uploadedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2 ml-4">
            <button
              onClick={() => handleFileView(file)}
              className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
              title="View file"
            >
              <EyeIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleFileDownload(file)}
              className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
              title="Download file"
            >
              <ArrowDownTrayIcon className="h-4 w-4" />
            </button>
            {!readOnly && onRemove && (
              <button
                onClick={() => onRemove(fileKey)}
                className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                title="Remove file"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderFileArray = (fileArray, label) => {
    if (!Array.isArray(fileArray) || fileArray.length === 0) return null;

    return (
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-900">{label}</h4>
        {fileArray.map((file, index) => 
          renderFileItem(file, `${label} ${index + 1}`, `${label}_${index}`)
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      
      {/* Individual files */}
      {files.gstFileUrl && renderFileItem(files.gstFileUrl, "GST Certificate", "gst")}
      {files.ndaFileUrl && renderFileItem(files.ndaFileUrl, "NDA Document", "nda")}
      {files.agreementFileUrl && renderFileItem(files.agreementFileUrl, "Agreement Document", "agreement")}
      {files.companyLogoUrl && renderFileItem(files.companyLogoUrl, "Company Logo", "logo")}
      
      {/* File arrays */}
      {files.otherDocsUrls && renderFileArray(files.otherDocsUrls, "Other Documents")}
      {files.companyLogos && renderFileArray(files.companyLogos, "Company Logos")}
      
      {/* Handle generic file objects */}
      {Object.entries(files).map(([key, file]) => {
        // Skip already rendered files
        if (['gstFileUrl', 'ndaFileUrl', 'agreementFileUrl', 'companyLogoUrl', 'otherDocsUrls', 'companyLogos'].includes(key)) {
          return null;
        }
        
        if (file && typeof file === 'object' && (file.originalName || file.fileName)) {
          const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
          return renderFileItem(file, label, key);
        }
        
        return null;
      })}
      
      {/* Show message if no files found */}
      {Object.keys(files).length === 0 && (
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <DocumentIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">No files uploaded</p>
        </div>
      )}
    </div>
  );
};

export default FileViewer;
