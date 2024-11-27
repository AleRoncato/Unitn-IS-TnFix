import React from "react";
import { Header } from "../components";
import CardList from "../components/cardlist";

export const Home = ({ theme, toggleTheme }) => {
  return (
    <>
      <div className="flex-col ">
        <div>
          <Header theme={theme} toggleTheme={toggleTheme} />
          <CardList cards={[
            { id: 1, title: "Card 1", content: "This is the first card" },
            { id: 2, title: "Card 2", content: "This is the second card" },
            { id: 3, title: "Card 3", content: "This is the third card" },
          ]} />

        </div>
      </div>
    </>
  );
};
