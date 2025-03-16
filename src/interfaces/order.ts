interface IOrder{
  id: number,
  customerName: string,
  productName: string,
  unit: string,
  quantity: number,
  price: number
}

export default IOrder

export type InputOrder = Omit<IOrder, "id">

