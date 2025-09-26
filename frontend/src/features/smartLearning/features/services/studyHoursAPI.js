import { supabase } from '../../../../lib/supabase';
import { authenticatedFetch } from '../../../../utils/auth'

const API_BASE = 'http://localhost:8000/past-performance';

export const updateSubjectStudyHours = async (subjectName, additionalHours) => {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) throw sessionError;
    if (!session) throw new Error('Not authenticated');

    // Call backend API
    const response = await authenticatedFetch(`${API_BASE}/performance/${encodeURIComponent(subjectName)}/study-hours`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        additional_hours: additionalHours
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to update study hours');
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to update study hours');
    }

    return { success: true, newTotal: result.new_total };
  } catch (error) {
    console.error('Error updating study hours:', error);
    throw error;
  }
};