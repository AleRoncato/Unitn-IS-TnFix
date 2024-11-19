import React from "react";
import { Header } from "../components";
import Card from "../components/card";

export const Home = ({ theme, toggleTheme }) => {
  return (
    <>
      <div className="flex-col ">
        <div>
          <Header theme={theme} toggleTheme={toggleTheme} />
        </div>
        <div>
          {" "}
          <Card
            theme={theme}
            data={{ title: "Card Title", description: "Card Description" }}
          />
        </div>
      </div>
    </>
  );
};
