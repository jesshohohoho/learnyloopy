import { authenticatedFetch, authenticatedFetchFormData } from '../../../../utils/auth';

const API_BASE = "http://localhost:8000/smart-learning/documents";

export const documentsAPI = {
  uploadMaterial: async (file, subject) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("subject", subject);

    const response = await authenticatedFetchFormData(`${API_BASE}/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload file');
    }

    return response.json();
  }
};