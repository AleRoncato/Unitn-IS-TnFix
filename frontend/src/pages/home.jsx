import React from "react";
import { Header } from "../components";
import CardList from "../components/cardlist";

export const Home = ({ theme, toggleTheme }) => {
  return (
    <>
      <div className="flex-col ">

        <Header theme={theme} toggleTheme={toggleTheme} />

        <CardList />

      </div>
    </>
  );
};
