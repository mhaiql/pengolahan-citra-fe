import * as React from "react";

interface IHomeProps {}

const Home: React.FunctionComponent<IHomeProps> = (props) => {
  return (
    <div className="flex justify-center items-center text-center h-screen">
      <p>Home Page</p>
    </div>
  );
};

export default Home;
