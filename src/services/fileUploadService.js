/**
 * File Upload Service (Browser Compatible)
 * Handles local file storage and management in browser environment
 */

// Browser-compatible file storage paths
const UPLOADS_BASE = '/uploads';
const VENDOR_UPLOADS_PATH = `${UPLOADS_BASE}/vendors`;
const CLIENT_UPLOADS_PATH = `${UPLOADS_BASE}/clients`;

// Initialize upload directories (browser simulation)
export const initializeUploadDirectories = async () => {
  try {
    // In browser environment, we simulate directory structure
    console.log('✅ Upload directories initialized (browser mode)');
    return true;
  } catch (error) {
    console.error('❌ Error initializing upload directories:', error);
    return false;
  }
};

// Generate unique filename (browser compatible)
const generateUniqueFileName = (originalName, prefix = '') => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);

  // Extract extension manually (browser compatible)
  const lastDotIndex = originalName.lastIndexOf('.');
  const extension = lastDotIndex !== -1 ? originalName.substring(lastDotIndex) : '';
  const baseName = lastDotIndex !== -1 ? originalName.substring(0, lastDotIndex) : originalName;

  return `${prefix}${prefix ? '_' : ''}${baseName}_${timestamp}_${randomString}${extension}`;
};

// Save file locally (browser environment - simulates server upload)
export const saveFileLocally = async (file, category = 'vendors', entityId = null) => {
  try {
    console.log('📁 Processing file for local storage:', file.name);

    const fileName = generateUniqueFileName(file.name, entityId);
    const relativePath = `${category === 'vendors' ? VENDOR_UPLOADS_PATH : CLIENT_UPLOADS_PATH}/${fileName}`;

    // Create file metadata
    const fileMetadata = {
      originalName: file.name,
      fileName: fileName,
      relativePath: relativePath,
      fullPath: `/public${relativePath}`, // Simulate server path
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
      category: category,
      entityId: entityId
    };

    // Create blob URL for immediate preview/access
    const blobUrl = URL.createObjectURL(file);
    fileMetadata.blobUrl = blobUrl;
    fileMetadata.localFile = file;

    // Simulate file upload to server (in real app, this would be an API call)
    try {
      // Store file data in localStorage with proper structure
      const fileKey = `vendor_file_${fileName}`;
      const fileData = {
        ...fileMetadata,
        // Convert file to base64 for storage
        base64Data: await fileToBase64(file),
        uploadedToServer: true,
        serverPath: `public/uploads/${category}/${fileName}`
      };

      localStorage.setItem(fileKey, JSON.stringify(fileData));

      // Also store in a global file registry
      const fileRegistry = JSON.parse(localStorage.getItem('fileRegistry') || '{}');
      fileRegistry[fileName] = {
        path: relativePath,
        originalName: file.name,
        size: file.size,
        type: file.type,
        category: category,
        entityId: entityId,
        uploadedAt: fileMetadata.uploadedAt
      };
      localStorage.setItem('fileRegistry', JSON.stringify(fileRegistry));

      console.log('💾 File saved to simulated server path:', fileData.serverPath);
    } catch (storageError) {
      console.warn('⚠️ Could not store file in localStorage:', storageError);
    }

    console.log('✅ File processed successfully:', fileMetadata);
    return fileMetadata;

  } catch (error) {
    console.error('❌ Error saving file locally:', error);
    throw error;
  }
};

// Convert file to base64 for storage
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

// Save multiple files
export const saveMultipleFiles = async (files, category = 'vendors', entityId = null) => {
  try {
    const savedFiles = [];
    
    for (const file of files) {
      if (file && file.file) {
        const savedFile = await saveFileLocally(file.file, category, entityId);
        savedFiles.push(savedFile);
      }
    }
    
    return savedFiles;
  } catch (error) {
    console.error('❌ Error saving multiple files:', error);
    throw error;
  }
};

// Process vendor files
export const processVendorFiles = async (uploadedFiles, vendorId) => {
  try {
    console.log('🔄 Processing vendor files:', uploadedFiles);

    const processedFiles = {
      gstFileUrl: null,
      ndaFileUrl: null,
      agreementFileUrl: null,
      companyLogoUrl: null,
      otherDocsUrls: []
    };

    // Process GST file
    if (uploadedFiles.gstFile) {
      const file = uploadedFiles.gstFile.file || uploadedFiles.gstFile;
      if (file && file instanceof File) {
        const savedFile = await saveFileLocally(file, 'vendors', vendorId);
        processedFiles.gstFileUrl = savedFile.relativePath;
        console.log('✅ GST file processed:', savedFile.relativePath);
      }
    }

    // Process NDA file
    if (uploadedFiles.ndaFile) {
      const file = uploadedFiles.ndaFile.file || uploadedFiles.ndaFile;
      if (file && file instanceof File) {
        const savedFile = await saveFileLocally(file, 'vendors', vendorId);
        processedFiles.ndaFileUrl = savedFile.relativePath;
        console.log('✅ NDA file processed:', savedFile.relativePath);
      }
    }

    // Process Agreement file
    if (uploadedFiles.agreementFile) {
      const file = uploadedFiles.agreementFile.file || uploadedFiles.agreementFile;
      if (file && file instanceof File) {
        const savedFile = await saveFileLocally(file, 'vendors', vendorId);
        processedFiles.agreementFileUrl = savedFile.relativePath;
        console.log('✅ Agreement file processed:', savedFile.relativePath);
      }
    }

    // Process Company logos (multiple files)
    if (uploadedFiles.companyLogos && Array.isArray(uploadedFiles.companyLogos)) {
      const logoFiles = [];
      for (const logoItem of uploadedFiles.companyLogos) {
        const file = logoItem.file || logoItem;
        if (file && file instanceof File) {
          const savedFile = await saveFileLocally(file, 'vendors', vendorId);
          logoFiles.push(savedFile);
        }
      }

      if (logoFiles.length > 0) {
        processedFiles.companyLogoUrl = logoFiles[0].relativePath; // Use first logo as primary
        processedFiles.otherDocsUrls = logoFiles.slice(1).map(file => file.relativePath); // Rest as other docs
        console.log('✅ Company logos processed:', logoFiles.length);
      }
    }

    console.log('✅ All vendor files processed:', processedFiles);
    return processedFiles;
  } catch (error) {
    console.error('❌ Error processing vendor files:', error);
    throw error;
  }
};

// Get file URL for display
export const getFileUrl = (relativePath) => {
  if (!relativePath) return null;
  
  // If it's already a full URL, return as is
  if (relativePath.startsWith('http') || relativePath.startsWith('blob:')) {
    return relativePath;
  }
  
  // For local files, return the relative path (assuming they're served from public directory)
  return relativePath;
};

// Delete file
export const deleteFile = async (relativePath) => {
  try {
    // In a real implementation, this would call a backend API to delete the file
    console.log('🗑️ File deletion requested:', relativePath);
    
    // For blob URLs, revoke them
    if (relativePath.startsWith('blob:')) {
      URL.revokeObjectURL(relativePath);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error deleting file:', error);
    throw error;
  }
};

// Validate file
export const validateFile = (file, maxSizeInMB = 5, allowedTypes = []) => {
  const errors = [];
  
  // Check file size
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  if (file.size > maxSizeInBytes) {
    errors.push(`File size must be less than ${maxSizeInMB}MB`);
  }
  
  // Check file type if specified
  if (allowedTypes.length > 0) {
    const isAllowed = allowedTypes.some(type => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.slice(0, -1));
      }
      return file.type === type;
    });
    
    if (!isAllowed) {
      errors.push(`File type ${file.type} is not allowed`);
    }
  }
  
  return errors;
};

// Format file size for display
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Process client files
export const processClientFiles = async (uploadedFiles, clientId) => {
  try {
    console.log('🔄 Processing client files:', uploadedFiles);

    const processedFiles = {
      dpiitCertificateUrl: null,
      tdsFileUrl: null,
      gstFileUrl: null,
      ndaFileUrl: null,
      agreementFileUrl: null,
      quotationFileUrl: null,
      panCardFileUrl: null,
      udhyamRegistrationFileUrl: null,
      othersFileUrls: []
    };

    // Process individual files
    const fileTypes = [
      'dpiitCertificate',
      'tdsFile',
      'gstFile',
      'ndaFile',
      'agreementFile',
      'quotationFile',
      'panCardFile',
      'udhyamRegistrationFile'
    ];

    for (const fileType of fileTypes) {
      if (uploadedFiles[fileType]) {
        const file = uploadedFiles[fileType].file || uploadedFiles[fileType];
        if (file && file instanceof File) {
          const savedFile = await saveFileLocally(file, 'clients', clientId);
          processedFiles[`${fileType}Url`] = savedFile.relativePath;
          console.log(`✅ ${fileType} processed:`, savedFile.relativePath);
        }
      }
    }

    // Process others files (multiple)
    if (uploadedFiles.othersFile && Array.isArray(uploadedFiles.othersFile)) {
      const otherFiles = [];
      for (const fileItem of uploadedFiles.othersFile) {
        const file = fileItem.file || fileItem;
        if (file && file instanceof File) {
          const savedFile = await saveFileLocally(file, 'clients', clientId);
          otherFiles.push(savedFile.relativePath);
        }
      }
      processedFiles.othersFileUrls = otherFiles;
      console.log(`✅ Other files processed: ${otherFiles.length} files`);
    }

    console.log('✅ All client files processed:', processedFiles);
    return processedFiles;
  } catch (error) {
    console.error('❌ Error processing client files:', error);
    throw error;
  }
};

// Initialize on import
initializeUploadDirectories();
