import { useState } from 'react';
import { documentsAPI } from '../services/uploaddocAPI';

export const useUploadMaterial = (onUploadSuccess) => { // ✅ Add callback parameter
  const [subject, setSubject] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(''); // ✅ Add error state

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setError(''); // ✅ Clear error when new file selected
  };

  const uploadMaterial = async () => {
    // ✅ Reset error state
    setError('');
    
    if (!file || !subject) {
      const errorMessage = "Please enter a subject and select a file.";
      setError(errorMessage);
      throw new Error(errorMessage);
    }

    setLoading(true);
    try {
      console.log('Uploading material:', { subject, fileName: file.name });
      
      await documentsAPI.uploadMaterial(file, subject);
      
      // ✅ Reset form on success
      setSubject("");
      setFile(null);
      setError('');

      // ✅ Call success callback to refresh subjects
      if (onUploadSuccess && typeof onUploadSuccess === 'function') {
        console.log('Calling onUploadSuccess callback...');
        onUploadSuccess();
      }

      console.log('Upload successful!');
      return { success: true };
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error.message || 'Failed to upload file';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Reset function to clear form
  const resetForm = () => {
    setSubject("");
    setFile(null);
    setError('');
  };

  return {
    subject,
    setSubject,
    file,
    handleFileChange,
    uploadMaterial,
    loading,
    error,     // ✅ Export error state
    resetForm  // ✅ Export reset function
  };
};