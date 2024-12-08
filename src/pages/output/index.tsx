import * as React from "react";

interface IOutputPageProps {}

const OutputPage: React.FunctionComponent<IOutputPageProps> = (props) => {
  return (
    <div className="flex items-center justify-center h-screen">
      <p>Output Page</p>
    </div>
  );
};

export default OutputPage;
