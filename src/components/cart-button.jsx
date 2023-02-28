import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Badge, FloatButton, Modal, Tag, message, Button } from "antd";
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

  const handleCartClick = useCallback((list, title = "") => {
    const filePathList = list.map((item) => item.key);
    Modal.info({
      title,
      width: 800,
      closable: true,
      footer: [
        <div className="flex flex-end-center margin-top-12">
          <Button
            type="primary"
            onClick={(event) => {
              if (filePathList.length === 0) {
                message.info("No files to open");
                return Promise.reject();
              }
              const comboString = filePathList.join(",");
              const url = `/v1??${comboString}`;
              //  cmd+click || alt+click|| ctrl+click
              if (event.metaKey || event.altKey || event.ctrlKey) {
                const replUrl = `/repl${url}`;
                console.log(replUrl);
                window.open(replUrl, "_blank");
              } else {
                window.open(url, "_blank");
              }
              return Promise.reject();
            }}
          >
            Open All
          </Button>
        </div>,
      ],
      content: (
        <div className="flex wrap gap-6-12">
          {filePathList.map((path) => (
            <Tag
              closable
              onClose={() => {
                const cartListInLocalStorage =
                  JSON.parse(localStorage.getItem(KEY_OF_CART)) || [];
                const newCartList = cartListInLocalStorage.filter(
                  (item) => item.key !== path
                );
                filePathList.splice(filePathList.indexOf(path), 1);
                localStorage.setItem(KEY_OF_CART, JSON.stringify(newCartList));
                refreshCart();
              }}
              color="geekblue"
            >
              {path}
            </Tag>
          ))}
        </div>
      ),
    });
  }, []);

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
                  handleCartClick(list, "JS Files");
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
                  handleCartClick(list, "CSS Files");
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
            return (
              <FloatButton
                key={key}
                description={<Badge count={list.length} />}
              />
            );
        }
      })}
    </FloatButton.Group>
  );
};
