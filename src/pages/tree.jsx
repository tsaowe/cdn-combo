import React, { useEffect, useState } from "react";
import { Button, Spin, Tree as AntdTree } from "antd";
import * as R from "ramda";
import axios from "axios";
import { useMatch, useNavigate } from "react-router-dom";

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
    </Spin>
  );
};
