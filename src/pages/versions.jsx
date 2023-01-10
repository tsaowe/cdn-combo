import React, { useEffect, useState } from "react";
import * as R from "ramda";
import { Spin } from "antd";
import axios from "axios";
import { useMatch, Link } from "react-router-dom";

export const Versions = () => {
  const match1 = useMatch("/versions/:packageName");
  const match2 = useMatch("/versions/:packageName/:version");

  const match = match1 || match2;

  const [loading, setLoading] = useState(false);
  const packageName = R.path(["params", "packageName"], match);
  const version = R.path(["params", "version"], match);
  const [versions, setVersions] = useState([]);
  useEffect(() => {
    setLoading(true);
    axios({
      method: "get",
      url: version
        ? `/api/view/${packageName}/${version}`
        : `/api/view/${packageName}`,
    }).then((res) => {
      setVersions(res.data);
      setLoading(false);
    });
  }, [packageName, version]);
  return (
    <Spin className="page-spin" spinning={loading}>
      <div className="padding-left-12 padding-top-12">
        <ul className="flex-column gap-12 font-16-regular">
          {versions.map((v) => (
            <li key={v}>
              <Link to={`/tree/${packageName}/${v}`}>
                {packageName + (version ? `/${version}` : "")}@{v}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Spin>
  );
};
