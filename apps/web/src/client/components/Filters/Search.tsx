import React from "react";

type Props = {
  searchText: string;
  setSearchText: (x: string) => void;
};

const Search = ({ searchText, setSearchText }: Props) => {
  return (
    <div className="flex items-start w-full sm:mr-2">
      <label htmlFor="search" className="sr-only">
        Quick search
      </label>
      <div className="w-full relative mt-1 flex items-center">
        <input
          type="text"
          name="search"
          id="search"
          aria-label="Search components"
          placeholder="Search"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="block w-full rounded-md border-gray-300 pr-12 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
    </div>
  );
};

export default Search;
