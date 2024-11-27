import React from "react";
import { Header } from "../components";

export const Home = ({ theme, toggleTheme }) => {
  return (
    <>
      <div className="flex-col ">
        <div>
          <Header theme={theme} toggleTheme={toggleTheme} />
        </div>
      </div>
    </>
  );
};
