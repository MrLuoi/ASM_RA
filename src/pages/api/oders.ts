import axios from "axios";

const API_URL = "http://localhost:3000/orders";

export const getAllOrders = async () => {
  const { data } = await axios.get(API_URL);
  return data;
};

export const deleteOrder = async (id: number) => {
  await axios.delete(`${API_URL}/${id}`);
};

export const addOrder = async (newOrder: any) => {
  const { data } = await axios.post(API_URL, newOrder);
  return data;
};