import React from "react";
import {
  SelectedOptions,
  useSortAndFilter,
} from "../../hooks/context/FilterContext";
import MultiSelectFilter from "../Filters/MultiSelectFilter";
import Search from "../Filters/Search";

type Props = {
  tags: SelectedOptions;
  countries: SelectedOptions;
};

const ResourceFilter = ({ tags, countries }: Props) => {
  const {
    setSearchText,
    filters: { searchText, selectedTags, selectedCountries },
    setSelectedCountries,
    setSelectedTags,
  } = useSortAndFilter();
  return (
    <>
      <Search searchText={searchText} setSearchText={setSearchText} />
      <div className="flex w-full justify-start">
        <MultiSelectFilter
          options={tags}
          label="Tags"
          selectedOptions={selectedTags}
          setSelectedOptions={setSelectedTags}
        />
        <MultiSelectFilter
          options={countries}
          label="Countries"
          selectedOptions={selectedCountries}
          setSelectedOptions={setSelectedCountries}
        />
      </div>
    </>
  );
};

export default ResourceFilter;
