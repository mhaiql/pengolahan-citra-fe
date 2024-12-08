import * as React from "react";
import { Outlet } from "react-router-dom";

interface IRootProps {}

const Root: React.FunctionComponent<IRootProps> = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default Root;
