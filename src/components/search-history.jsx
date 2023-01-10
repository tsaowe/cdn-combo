import React, { useEffect, useState } from "react";
import { Tag, Badge } from "antd";
import { useNavigate } from "react-router-dom";

const MyTag = (props) => {
  const navigate = useNavigate();
  return (
    <Tag
      onClick={() => {
        navigate(`/versions/${props.children}`);
      }}
      className="cursor-pointer"
      color="success"
      {...props}
    />
  );
};

export const SearchHistory = () => {
  //  data from KEY_OF_SEARCH_HISTORY
  const [searchList, setSearchList] = useState([]);
  useEffect(() => {
    const searchHistory = localStorage.getItem("searchHistory");
    if (searchHistory) {
      setSearchList(JSON.parse(searchHistory));
    }
  }, []);
  return (
    <div className="flex margin-24-0">
      {searchList.map((item) => {
        if (item.queryCount > 1) {
          return (
            <Badge offset={[-8, 0]} size="small" count={item.queryCount}>
              <MyTag>{item.name}</MyTag>
            </Badge>
          );
        }
        return <MyTag key={item.name}>{item.name}</MyTag>;
      })}
    </div>
  );
};
