import { supabase } from "./supabase";

const normalizeProduct = (product) => ({
  id: product.id,
  title: product.title,
  price: Number(product.price || 0),
  category: product.category || "",
  image: product.image || "",
  description: product.description || "",
  rating: Number(product.rating || 0),
  createdAt: product.created_at,
  updatedAt: product.updated_at,
});

export const getProducts = async () => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) throw error;

  return (data || []).map(normalizeProduct);
};

export const createProduct = async (product) => {
  const { data, error } = await supabase
    .from("products")
    .insert({
      title: product.title.trim(),
      price: Number(product.price),
      category: product.category.trim(),
      image: product.image.trim(),
      description: product.description.trim(),
      rating: Number(product.rating),
    })
    .select()
    .single();

  if (error) throw error;

  return normalizeProduct(data);
};

export const editProduct = async (productId, product) => {
  const { data, error } = await supabase
    .from("products")
    .update({
      title: product.title.trim(),
      price: Number(product.price),
      category: product.category.trim(),
      image: product.image.trim(),
      description: product.description.trim(),
      rating: Number(product.rating),
      updated_at: new Date().toISOString(),
    })
    .eq("id", productId)
    .select()
    .single();

  if (error) throw error;

  return normalizeProduct(data);
};

export const removeProduct = async (productId) => {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);

  if (error) throw error;

  return productId;
};
