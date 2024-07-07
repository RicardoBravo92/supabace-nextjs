import { redirect } from 'next/navigation';

import { createClient } from '@/utils/supabase/server';

export default async function PrivatePage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  return <p>Hello {user.email}</p>;
}
