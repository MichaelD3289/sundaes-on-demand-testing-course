import React from "react";
import Options from "./Options";
import { useOrderDetails } from "../../contexts/OrderDetails";

function OrderEntry() {
  const [orderDetails, updateItemCount] = useOrderDetails();

  return (
    <div>
      <Options optionType="scoops" />
      <Options optionType="toppings" />
      <h2>Grand total: {`${orderDetails.totals.grandTotal}`}</h2>
    </div>
  );
}

export default OrderEntry;
