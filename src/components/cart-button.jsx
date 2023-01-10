import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Badge, FloatButton } from "antd";
import {
  ALLOW_ADD_CART_TYPES,
  KEY_OF_CART,
  SubjectOfAddToCart,
} from "../constant.js";

export const CartButton = () => {
  const [cartList, setCartList] = useState([]);

  const refreshCart = useCallback(() => {
    const cartList = JSON.parse(localStorage.getItem(KEY_OF_CART)) || [];
    setCartList(cartList);
  }, []);
  useEffect(() => {
    refreshCart();

    SubjectOfAddToCart.subscribe(() => {
      refreshCart();
    });
  }, []);

  const cartCategoryMap = useMemo(() => {
    const map = ALLOW_ADD_CART_TYPES.reduce((acc, type) => {
      acc[type] = [];
      return acc;
    }, {});

    cartList.forEach((item) => {
      const { key } = item;
      //  key is dist/umd/jquery.js
      const ext = key.split(".").pop();
      const extWithDot = `.${ext}`;
      map[extWithDot] && map[extWithDot].push(item);
    });

    return map;
  }, [cartList]);

  if (!cartList.length) {
    return null;
  }

  return (
    <FloatButton.Group style={{ right: 24 }}>
      {Object.keys(cartCategoryMap).map((key) => {
        const list = cartCategoryMap[key];
        if (!list.length) {
          return null;
        }
        switch (key) {
          case ".js":
            return (
              <FloatButton
                type="primary"
                description={
                  <Badge
                    style={{ backgroundColor: "#52c41a" }}
                    count={list.length}
                  />
                }
              />
            );
          case ".css":
            return (
              <FloatButton
                description={
                  <Badge
                    count={list.length}
                    style={{ backgroundColor: "#722ed1" }}
                  />
                }
              />
            );
          default:
            return <FloatButton description={<Badge count={list.length} />} />;
        }
      })}
    </FloatButton.Group>
  );
};
