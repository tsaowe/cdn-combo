import React, { useEffect, useState, Fragment } from "react";
import { Spin } from "antd";

export const Tree = (props) => {
  return (
    <Spin className="page-spin" spinning>
      <div>tree</div>
    </Spin>
  );
};
