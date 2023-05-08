import React from "react";

const SearchPosts = (props) => {
  const handleChange = (event) => {
    props.searchValue(event.target.value);
  };
  return (
    <form method="POST " name="formName" className="center">
      <label htmlFor='searchBar'></label><input
      className="search-input"
        placeholder="Search Posts..."
        autoComplete="off"
        autoFocus="autofocus"
        type="text"
        id="searchBar"
        name="searchTerm"
        onChange={handleChange}
      />
    </form>
  );
};

export default SearchPosts;
