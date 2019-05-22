import React from "react";
import Header from "../components/Header";
import Link from "../components/Link";

const TestPug = () => pug`
  .testClass
    p.innaKlasa Good #[strong Morning]
`;

const Portfolio = () => (
  <>
    <Header>Portfolio section</Header>
    <TestPug />
    <Link href="/">Main Page</Link>
  </>
);

export default Portfolio;
