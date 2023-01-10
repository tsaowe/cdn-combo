import React, { useEffect, useState } from "react";
import * as R from "ramda";
import { Spin } from "antd";
import axios from "axios";
import { useMatch, Link } from "react-router-dom";

import "./versions.css";

export const Versions = () => {
  const match = useMatch("/versions/:packageName");
  const [loading, setLoading] = useState(false);
  const packageName = R.path(["params", "packageName"], match);
  const [versions, setVersions] = useState([]);
  useEffect(() => {
    setLoading(true);
    axios({
      method: "get",
      url: `/api/view/${packageName}`,
    }).then((res) => {
      setVersions(res.data);
      setLoading(false);
    });
  }, [packageName]);
  return (
    <Spin className="version-page-spin" spinning={loading}>
      <div className="padding-left-12 padding-top-12">
        <ul className="flex-column gap-12 font-16-regular">
          {versions.map((version) => (
            <li key={version}>
              <Link to={`/tree/${packageName}/${version}`}>{version}</Link>
            </li>
          ))}
        </ul>
      </div>
    </Spin>
  );
};
