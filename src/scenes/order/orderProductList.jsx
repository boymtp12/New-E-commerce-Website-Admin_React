import React from "react";
import {List, ListItem, ListItemText } from "@mui/material";

const ProductList = ({ productList }) => {
  return (
    <List>
      {productList.map((product) => (
        <ListItem key={product.id}>
          <ListItemText
            primary={product.name}
            secondary={`Giá tiền: $${product.price} | Số lượng : ${product.quantityStock}`}
          />
        </ListItem>
      ))}
    </List>
  );
};

export default ProductList;
