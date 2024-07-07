'use server';
import { createClient } from '@/utils/supabase/server';

export const userData = async () => {
  const supabase = createClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return { user: user };
  } catch (error) {
    console.error('Error fetching user data:', error);
    return { user: null };
  }
};

export async function logout() {
  const supabase = createClient();

  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Error signing out:', error);
    return;
  }
}
