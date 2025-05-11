import React from "react";
import { Link } from "react-router-dom";

const PageHeaders = ({ curPage, title }) => {
  return (
    <div className="breadcrumbs text-sm pl-10 pt-5">
      <ul>
        <li>
          <Link to="/" className="text-black ">
            Home
          </Link>
        </li>
        <li className="text-gray-700">{curPage}</li>
        <li className="text-[var(--primary-color)]">{title}</li>
      </ul>
    </div>
  );
};

export default PageHeaders;
