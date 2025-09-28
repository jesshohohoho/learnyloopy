import { authenticatedFetch, authenticatedFetchFormData } from '../../../../utils/auth';
import { API_ENDPOINTS } from "../../../../config/api";
const API_BASE = `${API_ENDPOINTS.smartLearning}/documents`

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