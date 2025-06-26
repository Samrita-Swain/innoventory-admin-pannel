import { useState, useRef } from 'react';
import {
  CloudArrowUpIcon,
  DocumentIcon,
  PhotoIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
// import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
// import { validateImageFile, formatFileSize } from '../../utils/imageUtils';

const FileUpload = ({ 
  onFilesChange, 
  existingFiles = [], 
  maxFileSize = 5, // MB
  allowedTypes = [
    'application/pdf',
    'image/*',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ],
  multiple = true,
  label = "Upload Files"
}) => {
  const [files, setFiles] = useState(existingFiles);
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState([]);
  const fileInputRef = useRef(null);

  const maxFileSizeBytes = maxFileSize * 1024 * 1024;

  const getFileIcon = (fileType) => {
    try {
      if (fileType && fileType.startsWith('image/')) {
        return <PhotoIcon className="h-8 w-8 text-blue-500" />;
      }
      return <DocumentIcon className="h-8 w-8 text-gray-500" />;
    } catch (error) {
      console.warn('Error determining file icon:', error);
      return <DocumentIcon className="h-8 w-8 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const generateUniqueFileName = (fileName, existingNames) => {
    let uniqueName = fileName;
    let counter = 1;
    
    while (existingNames.includes(uniqueName)) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const lastDotIndex = fileName.lastIndexOf('.');
      if (lastDotIndex > 0) {
        const name = fileName.substring(0, lastDotIndex);
        const extension = fileName.substring(lastDotIndex);
        uniqueName = `${name}_${timestamp}${extension}`;
      } else {
        uniqueName = `${fileName}_${timestamp}`;
      }
      counter++;
      if (counter > 100) break; // Prevent infinite loop
    }
    
    return uniqueName;
  };

  const validateFile = (file) => {
    const errors = [];

    // Check file size
    if (file.size > maxFileSizeBytes) {
      errors.push(`File size exceeds ${maxFileSize}MB limit`);
    }

    // Check file type
    const isAllowed = allowedTypes.some(type => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.slice(0, -1));
      }
      return file.type === type;
    });

    if (!isAllowed) {
      errors.push('File type not allowed');
    }

    return errors;
  };

  const handleFiles = (newFiles) => {
    const fileArray = Array.from(newFiles);
    const validFiles = [];
    const newErrors = [];
    const existingFileNames = files.map(f => f.name);

    fileArray.forEach((file, index) => {
      const fileErrors = validateFile(file);
      
      if (fileErrors.length > 0) {
        newErrors.push({
          fileName: file.name,
          errors: fileErrors
        });
      } else {
        // Handle duplicate names
        const uniqueName = generateUniqueFileName(file.name, existingFileNames);
        
        const fileWithMetadata = {
          file,
          name: uniqueName,
          size: file.size,
          type: file.type,
          id: Date.now() + index,
          uploadProgress: 0,
          status: 'ready' // ready, uploading, completed, error
        };
        
        validFiles.push(fileWithMetadata);
        existingFileNames.push(uniqueName);
      }
    });

    setErrors(newErrors);
    
    if (validFiles.length > 0) {
      const updatedFiles = [...files, ...validFiles];
      setFiles(updatedFiles);
      onFilesChange && onFilesChange(updatedFiles);
    }
  };

  const removeFile = (fileId) => {
    const updatedFiles = files.filter(f => f.id !== fileId);
    setFiles(updatedFiles);
    onFilesChange && onFilesChange(updatedFiles);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 group ${
          dragActive
            ? 'border-primary-500 bg-gradient-to-br from-primary-50 to-blue-50 scale-105 shadow-lg'
            : 'border-gray-300 hover:border-primary-400 hover:bg-gradient-to-br hover:from-gray-50 hover:to-primary-50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          onChange={handleFileInput}
          accept={allowedTypes.join(',')}
          className="hidden"
        />
        
        <div className="text-center">
          <div className={`mx-auto transition-all duration-300 ${dragActive ? 'scale-110' : 'group-hover:scale-105'}`}>
            <CloudArrowUpIcon className={`mx-auto h-12 w-12 transition-colors duration-300 ${
              dragActive ? 'text-primary-500' : 'text-gray-400 group-hover:text-primary-500'
            }`} />
          </div>
          <div className="mt-6">
            <button
              type="button"
              onClick={openFileDialog}
              className="btn-primary transform transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              {label}
            </button>
            <p className="mt-3 text-sm text-gray-600 font-medium">
              or drag and drop files here
            </p>
          </div>
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 font-medium">
              📁 Max file size: {maxFileSize}MB
            </p>
            <p className="text-xs text-gray-500 mt-1">
              📄 Allowed types: PDF, Images, Word, Excel, PowerPoint
            </p>
          </div>
        </div>
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="space-y-2">
          {errors.map((error, index) => (
            <div key={index} className="flex items-start p-3 bg-red-50 border border-red-200 rounded-md">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-800">{error.fileName}</p>
                <ul className="text-sm text-red-700 mt-1">
                  {error.errors.map((err, errIndex) => (
                    <li key={errIndex}>• {err}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-900">
            Uploaded Files ({files.length})
          </h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {files.map((fileItem) => (
              <div key={fileItem.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md border">
                <div className="flex items-center space-x-3">
                  {getFileIcon(fileItem.type)}
                  <div>
                    <p className="text-sm font-medium text-gray-900">{fileItem.name}</p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(fileItem.size)} • {fileItem.type}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {fileItem.status === 'completed' && (
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  )}
                  <button
                    onClick={() => removeFile(fileItem.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
