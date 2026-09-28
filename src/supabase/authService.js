
import { supabase } from "./supabase";

// Register a new customer
export const registerUser = async (name, email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password,
    options: {
      data: {
        name: name.trim(),
      },
    },
  });

  if (error) throw error;

  return data;
};

// Login
export const loginUser = async (email, password) => {
  const { data, error } =
    await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

  if (error) throw error;

  return data;
};

// Logout
export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) throw error;
};

// Get authenticated user
export const getCurrentUser = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw error;

  return user;
};

// Get customer profile from PostgreSQL
export const getUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, name, email, role, is_blocked")
    .eq("id", userId)
    .single();

  if (error) throw error;

  return {
    id: data.id,
    name: data.name,
    email: data.email,
    role: data.role,
    isBlocked: data.is_blocked,
  };
};

// Update customer name
export const updateUserProfile = async (name) => {
  const { data, error } = await supabase.rpc(
    "update_my_profile_name",
    {
      new_name: name.trim(),
    }
  );

  if (error) throw error;

  return data;
};

// Verify current password
export const verifyCurrentPassword = async (
  email,
  currentPassword
) => {
  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password: currentPassword,
  });

  if (error) {
    throw new Error("Current password is incorrect.");
  }
};

// Change password
export const updateUserPassword = async (newPassword) => {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) throw error;

  return data;
};