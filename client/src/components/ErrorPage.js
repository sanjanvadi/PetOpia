import React from "react";

const ErrorPage = (props) => {
  return (
    <>
      <p className="error">* {props.error}</p>
    </>
  );
};
export default ErrorPage;
