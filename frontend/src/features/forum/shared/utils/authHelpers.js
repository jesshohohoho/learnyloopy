import { supabase } from '../../../../lib/supabase';

export const checkAuthAndPrompt = async (actionName) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      alert(`You need to log in to ${actionName}`);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error checking auth:', error);
    return false;
  }
};