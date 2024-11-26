import React from "react";
import { Header } from "../components";
import Card from "../components/card";
import LoginForm from "../components/LoginForm";

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
