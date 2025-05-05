import React from "react";
import { Link } from "react-router-dom";

const PageHeaders = ({ curPage }) => {
  return (
    <div className="breadcrumbs text-sm pl-10 pt-5">
      <ul>
        <li>
          <Link to="/" className="text-black ">
            Home
          </Link>
        </li>
        <li>{curPage}</li>
      </ul>
    </div>
  );
};

export default PageHeaders;
