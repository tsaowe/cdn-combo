import React, { useEffect, useState } from "react";
import {
  Button,
  Spin,
  Tree as AntdTree,
  Popover,
  message,
  Tooltip,
} from "antd";
import * as R from "ramda";
import axios from "axios";
import { useMatch, useNavigate } from "react-router-dom";
import { CartButton } from "../components/cart-button.jsx";
import {
  ALLOW_ADD_CART_TYPES,
  KEY_OF_CART,
  SubjectOfAddToCart,
} from "../constant.js";

/**
 * api data structure: {path: string, type: 'file|folder', name: string, children: [...]}
 * tree data: {title, key, children: [...]}
 * @param data
 */
export const convertApiDataToTreeData = (data) => {
  return data.map((item) => {
    if (item.type === "file") {
      return {
        title: item.name,
        key: item.path,
      };
    }
    return {
      title: item.name,
      selectable: false,
      disabled: true,
      key: item.path,
      children: convertApiDataToTreeData(item.children),
    };
  });
};

export const getAllTreeDataExpandedKeys = (data, keys = []) => {
  data.forEach((item) => {
    keys.push(item.key);
    if (item.children) {
      getAllTreeDataExpandedKeys(item.children, keys);
    }
  });
  return keys;
};

export const Tree = () => {
  const match1 = useMatch("/tree/:packageName/:version");
  const match2 = useMatch("/tree/:scope/:packageName/:version");
  const match = match1 || match2;
  const scope = R.path(["params", "scope"], match);
  const packageName = R.path(["params", "packageName"], match);
  const version = R.path(["params", "version"], match);
  const realPackageName = scope ? `${scope}/${packageName}` : packageName;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [treeData, setTreeData] = useState([]);

  useEffect(() => {
    setLoading(true);
    axios({
      method: "get",
      url: `/api/view/${realPackageName}/${version}`,
    }).then((res) => {
      R.pipe(convertApiDataToTreeData, setTreeData)([res.data]);
      setLoading(false);
    });
  }, [realPackageName, version]);
  return (
    <Spin className="page-spin" spinning={loading}>
      <div className="padding-24">
        <Button
          className="margin-bottom-24"
          type="primary"
          onClick={() => {
            navigate(`/`);
          }}
        >
          Home
        </Button>
        <AntdTree
          titleRender={(node) => {
            const ext = node.title.split(".").pop();
            const extWithDot = ext ? `.${ext}` : "";
            const allowAddCart = ALLOW_ADD_CART_TYPES.includes(extWithDot);
            if (node.disabled) {
              return node.title;
            }
            if (!allowAddCart) {
              return (
                <Tooltip
                  title={`only allow add ${ALLOW_ADD_CART_TYPES.join(",  ")}`}
                >
                  {node.title}
                </Tooltip>
              );
            }

            return (
              <div className="flex tree-node">
                <Popover
                  placement="right"
                  content={
                    <Button
                      type="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        /**
                         * localStorage key => KEY_OF_CART
                         * if exists do nothing
                         * if not exists, add to localStorage
                         * if localStorage of key is empty, create a new array []
                         */
                        const cartList =
                          JSON.parse(localStorage.getItem(KEY_OF_CART)) || [];
                        if (!cartList.find((item) => item.key === node.key)) {
                          cartList.push(node);
                          localStorage.setItem(
                            KEY_OF_CART,
                            JSON.stringify(cartList)
                          );
                        } else {
                          //  put to position 0
                          const index = cartList.findIndex(
                            (item) => item.key === node.key
                          );
                          const item = cartList.splice(index, 1);
                          cartList.unshift(item[0]);
                          localStorage.setItem(
                            KEY_OF_CART,
                            JSON.stringify(cartList)
                          );
                        }
                        message.success("Add to cart successfully");
                        SubjectOfAddToCart.next(node);
                      }}
                      size="small"
                    >
                      Add to cart
                    </Button>
                  }
                  title={null}
                >
                  <span
                    style={{
                      color: "rgb(82, 196, 26)",
                    }}
                  >
                    {node.title}
                  </span>
                </Popover>
              </div>
            );
          }}
          showLine
          className="move-towards-left-6"
          key={treeData.length}
          defaultExpandAll
          onSelect={(selectedKeys, event) => {
            const key = R.pathOr("", ["node", "key"], event);
            window.open("/v1??" + key);
          }}
          treeData={treeData}
        />
      </div>
      <CartButton />
    </Spin>
  );
};
