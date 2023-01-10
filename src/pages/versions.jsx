import React, { useEffect, useState } from "react";
import * as R from "ramda";
import { Spin } from "antd";
import axios from "axios";
import { useMatch, Link } from "react-router-dom";
import { KEY_OF_SEARCH_HISTORY } from "../constant.js";

export const Versions = () => {
  const match1 = useMatch("/versions/:packageName");
  const match2 = useMatch("/versions/:packageName/:version");

  const match = match1 || match2;

  const [loading, setLoading] = useState(false);
  const packageName = R.path(["params", "packageName"], match);
  const version = R.path(["params", "version"], match);

  const requestPackageName = version
    ? `${packageName}/${version}`
    : packageName;
  const [versions, setVersions] = useState([]);
  useEffect(() => {
    setLoading(true);
    axios({
      method: "get",
      url: `/api/view/${requestPackageName}`,
    }).then((res) => {
      setVersions(res.data);
      setLoading(false);
    });
    // set local storage, key KEY_OF_SEARCH_HISTORY, if not exist, create it, list type, name: packageName, queryCount: +1
    const searchHistory = localStorage.getItem(KEY_OF_SEARCH_HISTORY);
    if (searchHistory) {
      /**
       * if exist, find if packageName exist, if exist, queryCount + 1, if not exist, add it
       * and put it to position 0
       */
      const searchHistoryList = JSON.parse(searchHistory);
      const index = searchHistoryList.findIndex(
        (item) => item.name === packageName
      );
      if (index > -1) {
        searchHistoryList[index].queryCount += 1;
        searchHistoryList.unshift(searchHistoryList.splice(index, 1)[0]);
      } else {
        searchHistoryList.unshift({ name: packageName, queryCount: 1 });
      }
      localStorage.setItem(
        KEY_OF_SEARCH_HISTORY,
        JSON.stringify(searchHistoryList)
      );
    } else {
      localStorage.setItem(
        KEY_OF_SEARCH_HISTORY,
        JSON.stringify([
          {
            name: packageName,
            queryCount: 1,
          },
        ])
      );
    }
  }, [requestPackageName]);
  return (
    <Spin className="page-spin" spinning={loading}>
      <div className="padding-left-12 padding-top-12">
        <ul className="flex-column gap-12 font-16-regular">
          {versions.map((v) => (
            <li key={v}>
              <Link to={`/tree/${requestPackageName}/${v}`}>
                {requestPackageName}@{v}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Spin>
  );
};
