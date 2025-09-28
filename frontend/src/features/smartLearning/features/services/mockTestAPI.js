import { authenticatedFetch, authenticatedFetchFormData } from '../../../../utils/auth';
import { API_ENDPOINTS } from "../../../../config/api";
const API_BASE = `${API_ENDPOINTS.smartLearning}/test`


export const mockTestAPI = {
  getMockTest: async (subjectName) => {
    try {
      const response = await authenticatedFetch(`${API_BASE}/generate/${encodeURIComponent(subjectName)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      const mockTestData = data["Mock test"];
      
      if (!mockTestData || mockTestData.length === 0) {
        throw new Error('No questions received from API');
      }
      
      return mockTestData;
    } catch (error) {
      console.error('API Error:', error);
      throw new Error(`Failed to load mock test: ${error.message}`);
    }
  }
};


export const storeMockTestResult = async (subjectName, resultData) => {
  try {
    const response = await authenticatedFetch(`${API_BASE}/result/${subjectName}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(resultData), // Now sends the full object with wrong_answers
    });
    
    if (!response.ok) {
      throw new Error(`Failed to store result: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error storing mock test result:", error);
    throw error;
  }
};

export const getMockTestResult = async (subjectName) => {

  const response = await authenticatedFetch(`${API_BASE}/performance/${encodeURIComponent(subjectName)}`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error('Failed to get mock test result');
  }

  return response.json();
};

export const getAllMockTestResults = async () => {
  
  const response = await authenticatedFetch(`${API_BASE}/performance/all`, {
    method: 'GET',

  });
  if (!response.ok) {
    throw new Error('Failed to get all mock test results');
  }
  return response.json();
};