
import { supabase } from "./supabase";

const normalizeCustomer = (row) => ({
  id: row.id,
  name: row.name,
  email: row.email,
  role: row.role,
  isBlocked: row.is_blocked,
});

export const listCustomers = async () => {
  const { data, error } = await supabase.rpc(
    "admin_list_customers"
  );

  if (error) throw error;

  return (data || []).map(normalizeCustomer);
};

export const setCustomerBlocked = async (
  customerId,
  blocked
) => {
  const { data, error } = await supabase.rpc(
    "admin_set_customer_blocked",
    {
      target_user_id: customerId,
      blocked,
    }
  );

  if (error) throw error;

  if (!data?.length) {
    throw new Error("Customer was not updated.");
  }

  return normalizeCustomer(data[0]);
};