import React, { useEffect, useState, Fragment } from "react";
import { Spin } from "antd";
import * as R from "ramda";
import axios from "axios";
import { useMatch } from "react-router-dom";

export const Tree = () => {
  const match1 = useMatch("/tree/:packageName/:version");
  const match2 = useMatch("/tree/:scope/:packageName/:version");
  const match = match1 || match2;
  const scope = R.path(["params", "scope"], match);
  const packageName = R.path(["params", "packageName"], match);
  const version = R.path(["params", "version"], match);
  const realPackageName = scope ? `${scope}/${packageName}` : packageName;
  const [loading, setLoading] = useState(false);

  const [treeData, setTreeData] = useState([]);

  useEffect(() => {
    axios({
      method: "get",
      url: `/api/view/${realPackageName}/${version}`,
    }).then((res) => {
      console.log(res.data);
      setTreeData(res.data);
      setLoading(false);
    });
  }, [realPackageName, version]);
  return (
    <Spin className="page-spin" spinning={loading}>
      <div>{JSON.stringify(treeData)}</div>
    </Spin>
  );
};
