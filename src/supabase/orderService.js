import { supabase } from "./supabase";

const normalizeItem = (item) => ({
  id: item.product_id || item.id,

  orderItemId: item.id,

  title: item.product_title || item.title || "Product",

  image: item.product_image || item.image || "",

  price: Number(item.price || 0),

  quantity: Number(item.quantity || 1),
});

const normalizeOrder = (order) => ({
  id: order.id,

  userId: order.user_id,

  customer: {
    fullName: order.customer_name || "",

    name: order.customer_name || "",

    email: order.customer_email || "",

    phone: order.customer_phone || "",

    address: order.shipping_address || "",

    city: order.shipping_city || "",

    postalCode: order.shipping_postal_code || "",

    userId: order.user_id,
  },

  items: (order.order_items || []).map(normalizeItem),

  subtotal: Number(order.subtotal || 0),

  shipping: Number(order.shipping || 0),

  total: Number(order.total || 0),

  paymentMethod: order.payment_method || "cod",

  status: order.status || "Pending",

  createdAt: order.created_at,

  date: order.created_at,

  updatedAt: order.updated_at,
});

const ORDER_SELECT = `
  *,
  order_items (
    id,
    order_id,
    product_id,
    product_title,
    product_image,
    price,
    quantity,
    created_at
  )
`;

export const createOrder = async ({
  customer,
  items,
  subtotal,
  shipping,
  total,
  paymentMethod,
}) => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error("You must be logged in to place an order.");
  }

  if (!Array.isArray(items) || !items.length) {
    throw new Error("Your cart is empty.");
  }

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,

      customer_name: customer.fullName.trim(),

      customer_email: customer.email.trim().toLowerCase(),

      customer_phone: customer.phone.trim(),

      shipping_address: customer.address.trim(),

      shipping_city: customer.city.trim(),

      shipping_postal_code: customer.postalCode.trim(),

      payment_method: paymentMethod,

      status: "Pending",

      subtotal: Number(subtotal),

      shipping: Number(shipping),

      total: Number(total),
    })
    .select()
    .single();

  if (orderError) {
    throw orderError;
  }

  const orderItems = items.map((item) => ({
    order_id: order.id,

    product_id: item.id,

    product_title: item.title || "Product",

    product_image: item.image || "",

    price: Number(item.price || 0),

    quantity: Number(item.quantity || 1),
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) {
    // Prevent leaving an empty order
    // if its item insertion fails.
    await supabase.from("orders").delete().eq("id", order.id);

    throw itemsError;
  }

  const { data: completeOrder, error: completeOrderError } = await supabase
    .from("orders")
    .select(ORDER_SELECT)
    .eq("id", order.id)
    .single();

  if (completeOrderError) {
    throw completeOrderError;
  }

  return normalizeOrder(completeOrder);
};

export const getMyOrders = async () => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error("You must be logged in.");
  }

  const { data, error } = await supabase
    .from("orders")
    .select(ORDER_SELECT)
    .eq("user_id", user.id)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return (data || []).map(normalizeOrder);
};

export const getAdminOrders = async () => {
  const { data, error } = await supabase
    .from("orders")
    .select(ORDER_SELECT)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return (data || []).map(normalizeOrder);
};

export const getOrderById = async (orderId) => {
  const { data, error } = await supabase
    .from("orders")
    .select(ORDER_SELECT)
    .eq("id", orderId)
    .single();

  if (error) {
    throw error;
  }

  return normalizeOrder(data);
};

export const updateAdminOrderStatus = async (orderId, status) => {
  const allowedStatuses = [
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  if (!allowedStatuses.includes(status)) {
    throw new Error("Invalid order status.");
  }

  const { data, error } = await supabase
    .from("orders")
    .update({
      status,

      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId)
    .select(ORDER_SELECT)
    .single();

  if (error) {
    throw error;
  }

  return normalizeOrder(data);
};
