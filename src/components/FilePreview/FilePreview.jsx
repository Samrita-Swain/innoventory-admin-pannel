import React, { useState } from 'react';
import { 
  DocumentIcon, 
  PhotoIcon, 
  EyeIcon, 
  ArrowDownTrayIcon,
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline';
import ImageWithFallback from '../ImageWithFallback/ImageWithFallback';

const FilePreview = ({ 
  file, 
  showPreview = true, 
  showDownload = true, 
  onView = null,
  onDownload = null,
  className = ''
}) => {
  const [previewError, setPreviewError] = useState(false);

  // Determine file type and icon
  const getFileTypeInfo = (file) => {
    if (!file) return { type: 'unknown', icon: DocumentIcon, color: 'text-gray-500' };

    const fileName = file.name || '';
    const fileType = file.type || '';
    const extension = fileName.split('.').pop()?.toLowerCase() || '';

    // Image files
    if (fileType.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(extension)) {
      return { type: 'image', icon: PhotoIcon, color: 'text-blue-500' };
    }

    // Document files
    if (fileType.includes('pdf') || extension === 'pdf') {
      return { type: 'pdf', icon: DocumentIcon, color: 'text-red-500' };
    }

    if (fileType.includes('word') || ['doc', 'docx'].includes(extension)) {
      return { type: 'word', icon: DocumentIcon, color: 'text-blue-600' };
    }

    if (fileType.includes('excel') || fileType.includes('spreadsheet') || ['xls', 'xlsx'].includes(extension)) {
      return { type: 'excel', icon: DocumentIcon, color: 'text-green-600' };
    }

    if (fileType.includes('powerpoint') || fileType.includes('presentation') || ['ppt', 'pptx'].includes(extension)) {
      return { type: 'powerpoint', icon: DocumentIcon, color: 'text-orange-600' };
    }

    // Default
    return { type: 'document', icon: DocumentIcon, color: 'text-gray-500' };
  };

  const fileInfo = getFileTypeInfo(file);
  const FileIcon = fileInfo.icon;

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Handle view action
  const handleView = () => {
    try {
      if (onView) {
        onView(file);
      } else if (file.url) {
        window.open(file.url, '_blank');
      } else if (file instanceof File) {
        // Create object URL for file preview
        const url = URL.createObjectURL(file);
        window.open(url, '_blank');
        // Clean up the URL after a delay
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
    } catch (error) {
      console.error('Error viewing file:', error);
      alert('Unable to preview this file');
    }
  };

  // Handle download action
  const handleDownload = () => {
    try {
      if (onDownload) {
        onDownload(file);
      } else if (file.url) {
        const link = document.createElement('a');
        link.href = file.url;
        link.download = file.name || 'download';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else if (file instanceof File) {
        // Create download link for file
        const url = URL.createObjectURL(file);
        const link = document.createElement('a');
        link.href = url;
        link.download = file.name || 'download';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Unable to download this file');
    }
  };

  if (!file) {
    return (
      <div className={`flex items-center justify-center p-4 bg-gray-50 rounded-lg ${className}`}>
        <ExclamationTriangleIcon className="h-6 w-6 text-gray-400 mr-2" />
        <span className="text-sm text-gray-500">No file available</span>
      </div>
    );
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between">
        {/* File info */}
        <div className="flex items-center flex-1 min-w-0">
          {/* File icon or image preview */}
          <div className="flex-shrink-0 mr-3">
            {fileInfo.type === 'image' && showPreview && (file.url || file instanceof File) ? (
              <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200">
                <ImageWithFallback
                  src={file.url || (file instanceof File ? URL.createObjectURL(file) : null)}
                  alt={file.name}
                  className="w-full h-full object-cover"
                  onError={() => setPreviewError(true)}
                />
              </div>
            ) : (
              <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
                <FileIcon className={`h-6 w-6 ${fileInfo.color}`} />
              </div>
            )}
          </div>

          {/* File details */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {file.name || 'Unnamed file'}
            </p>
            <p className="text-xs text-gray-500">
              {formatFileSize(file.size)} • {fileInfo.type.toUpperCase()}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-2 ml-4">
          {showPreview && (
            <button
              onClick={handleView}
              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors duration-200"
              title="View file"
            >
              <EyeIcon className="h-4 w-4" />
            </button>
          )}
          
          {showDownload && (
            <button
              onClick={handleDownload}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              title="Download file"
            >
              <ArrowDownTrayIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilePreview;
