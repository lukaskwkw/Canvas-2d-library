import React from "react";
import { PropTypes } from "prop-types";
import { Helmet } from "react-helmet";

const Html = ({ innerContent }) => {
  const helmet = Helmet.renderStatic();
  const htmlAttrs = helmet.htmlAttributes.toComponent();
  const bodyAttrs = helmet.bodyAttributes.toComponent();

  return (
    <html {...htmlAttrs} lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <link href="/main.css" rel="stylesheet" />
        {helmet.title.toComponent()}
        {helmet.meta.toComponent()}
        {helmet.link.toComponent()}
      </head>
      <body {...bodyAttrs}>
        <div id="app" dangerouslySetInnerHTML={{ __html: innerContent }} />
        <script src="/bundle.js" />
      </body>
    </html>
  );
};

Html.propTypes = {
  innerContent: PropTypes.string
};

export default Html;
