import React from "react";
import { Tag } from "antd";
import { useNavigate } from "react-router";

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
  return (
    <div className="flex margin-24-0">
      <MyTag>antd</MyTag>
      <MyTag>react</MyTag>
      <MyTag>vue</MyTag>
      <MyTag>angular</MyTag>
      <MyTag>react-router</MyTag>
      <MyTag>react-redux</MyTag>
      <MyTag>react-router-dom</MyTag>
    </div>
  );
};
