import React from "react";
import Header from "../components/Header";
import { Routes } from "../routes";

const Home = () => (
  <>
    <Header>Home Page!</Header>
    <ul>
      {Routes.map(href => (
        <li key={href}>
          <a href={href}>{href}</a>
        </li>
      ))}
    </ul>
  </>
);

export default Home;
