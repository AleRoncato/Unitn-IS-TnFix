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
          <CardList cards={[
            { id: 1, title: "Introduction to React", type: "Tutorial", description: "Learn the basics of React.", location: "Online", date: "2023-10-01" },
            { id: 2, title: "Advanced React Patterns", type: "Workshop", description: "Dive deeper into React with advanced patterns.", location: "New York", date: "2023-11-15" },
            { id: 3, title: "State Management", type: "Course", description: "Understand state management in React applications.", location: "San Francisco", date: "2023-12-05" },
            { id: 4, title: "React Hooks", type: "Webinar", description: "Master the use of hooks in React.", location: "Online", date: "2023-10-20" },
            { id: 5, title: "React Hooks", type: "Webinar", description: "Master the use of hooks in React.", location: "Online", date: "2023-10-20" },
            { id: 6, title: "React Hooks", type: "Webinar", description: "Master the use of hooks in React.", location: "Online", date: "2023-10-20" }
          ]} />
        </div>
      </div>
    </>
  );
};
