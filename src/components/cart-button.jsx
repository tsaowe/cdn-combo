import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Badge, FloatButton, Modal, Tag } from "antd";
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
                key={key}
                onClick={() => {
                  const jsList = list.map((item) => item.key);
                  Modal.info({
                    title: "JS List",
                    width: 800,
                    closable: true,
                    okText: "Open All",
                    onOk() {
                      const jsString = jsList.join(",");
                      const url = `/v1??${jsString}`;
                      window.open(url);
                    },
                    content: (
                      <div>
                        {jsList.map((path) => (
                          <Tag closable onClose={()=>{
                            const cartListInLocalStorage = JSON.parse(localStorage.getItem(KEY_OF_CART)) || [];
                            const newCartList = cartListInLocalStorage.filter(item=>item.key !== path);
                            localStorage.setItem(KEY_OF_CART, JSON.stringify(newCartList));
                            refreshCart();
                          }} color="geekblue">{path}</Tag>
                        ))}
                      </div>
                    ),
                  });
                }}
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
                key={key}
                onClick={() => {
                  const cssList = list.map((item) => item.key);
                  Modal.info({
                    title: "CSS List",
                    closable: true,
                    width: 800,
                    okText: "Open All",
                    onOk: () => {
                      const cssString = cssList.join(",");
                      const url = `/v1??${cssString}`;
                      window.open(url);
                    },
                    content: (
                      <div>
                        {cssList.map((path) => (
                          <Tag closable onClose={()=>{
                            const cartListInLocalStorage = JSON.parse(localStorage.getItem(KEY_OF_CART)) || [];
                            const newCartList = cartListInLocalStorage.filter(item=>item.key !== path);
                            localStorage.setItem(KEY_OF_CART, JSON.stringify(newCartList));
                            refreshCart();
                          }} color="purple">{path}</Tag>
                        ))}
                      </div>
                    ),
                  });
                }}
                description={
                  <Badge
                    count={list.length}
                    style={{ backgroundColor: "#722ed1" }}
                  />
                }
              />
            );
          default:
            return <FloatButton key={key} description={<Badge count={list.length} />} />;
        }
      })}
    </FloatButton.Group>
  );
};
