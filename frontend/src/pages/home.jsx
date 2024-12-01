import React from "react";
import { Header } from "../components";
import CardList from "../components/cardlist";

export const Home = ({ theme, toggleTheme }) => {
  return (
    <>
      <div className="flex-col ">
        <div>
          <Header theme={theme} toggleTheme={toggleTheme} />

          {/* must get the data from an API Call */}
          <CardList />
        </div>
      </div>
    </>
  );
};
