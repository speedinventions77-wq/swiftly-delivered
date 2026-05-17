import { supabase } from "@/integrations/supabase/client";

// Generic edge-function invoker. Returns parsed JSON or throws.
export async function invokeFn<T = any>(name: string, body?: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabase.functions.invoke(name, { body });
  if (error) throw new Error(error.message || `Edge function ${name} failed`);
  return data as T;
}
