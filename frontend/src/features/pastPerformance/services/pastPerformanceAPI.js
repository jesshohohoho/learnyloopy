import { authenticatedFetch } from "../../../utils/auth";

const API_BASE = "http://localhost:8000/past-performance";

export const pastPerformanceService = {
  async loadSubjectsWithPerformance() {
    const response = await authenticatedFetch(`${API_BASE}/subjects/with-performance`);
    return await response.json();
  },

  async getPerformanceSummary() {
    const response = await authenticatedFetch(`${API_BASE}/analytics/summary`);
    return await response.json();
  },

  async createSubject(subjectName) {
    const response = await authenticatedFetch(`${API_BASE}/performance/${encodeURIComponent(subjectName)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        test1: null,
        test2: null,
        assignment: null,
        mock_test: null,
      }),
    });
    return await response.json();
  },

  async updatePerformance(subjectName, performanceData) {
    const response = await authenticatedFetch(`${API_BASE}/performance/${encodeURIComponent(subjectName)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(performanceData),
    });
    return await response.json();
  },

  async deletePerformance(subjectName) {
    const response = await authenticatedFetch(`${API_BASE}/performance/${encodeURIComponent(subjectName)}`, {
      method: 'DELETE',
    });
    return await response.json();
  },

  async predictGradeProbability(subjectName, desiredGrade) {
    const response = await authenticatedFetch(`${API_BASE}/performance/${encodeURIComponent(subjectName)}/predict-probability`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        desired_grade: desiredGrade
      }),
    });
    return await response.json();
  }
};