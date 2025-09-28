import { createClient } from '@/utils/supabase/server-props';

export default async function Dashboard() {
  const supabase = await createClient();
  const { data: instruments } = await supabase.from("ptest").select();

  return <pre>{JSON.stringify(instruments, null, 2)}</pre>
}