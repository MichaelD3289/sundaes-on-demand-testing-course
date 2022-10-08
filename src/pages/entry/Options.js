import React, { useEffect, useState } from "react";
import ScoopOption from "./ScoopOption";
import ToppingOption from "./ToppingOption";
import Row from "react-bootstrap/Row";
import axios from "axios";
import AlertBanner from "../common/AlertBanner";
import { pricePerItem } from "../../constants";
import { useOrderDetails } from "../../contexts/OrderDetails";

function Options({ optionType }) {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(false);
  const [orderDetails, updateItemCount] = useOrderDetails();

  // optionsType is 'scoops' or 'toppings'
  useEffect(() => {
    axios(`http://localhost:3030/${optionType}`)
      .then((res) => setItems(res.data))
      .catch((err) => {
        setError(true);
      });
  }, [optionType]);

  if (error) {
    return <AlertBanner />;
  }

  // TODO: replace 'null' with ToppingOption when available
  const ItemComponent = optionType === "scoops" ? ScoopOption : ToppingOption;
  const title = optionType[0].toUpperCase() + optionType.slice(1).toLowerCase();

  const optionItems = items.map((item) => (
    <ItemComponent
      key={item.name}
      name={item.name}
      imagePath={item.imagePath}
      updateItemCount={(itemName, newItemCount) =>
        updateItemCount(itemName, newItemCount, optionType)
      }
    />
  ));

  return (
    <>
      <h2>{title}</h2>
      <p>{pricePerItem[optionType]} each</p>
      <p>
        {title} total: {orderDetails.totals[optionType]}
      </p>
      <Row>{optionItems}</Row>
    </>
  );
}

export default Options;
