import React from "react";
// import { Select, Option } from "@strapi/design-system/Select";
import SelectSearch from "react-select-search";
import cssString from "!raw-loader!react-select-search/style.css";

import { Loader } from "@strapi/design-system";

const SelectItem = ({
  possibleOptions = [],
  onChange,
  label,
  placeHolder,
  required = true,
  value,
  disabled,
  loading = false,
}) => {
  if (loading) return <Loader small={true} />;
  const options = possibleOptions?.map((opt) => ({ value: opt, name: opt }));
  return (
    <>
      <style>{cssString}</style>
      <SelectSearch
        label={label}
        // error={required && !possibleOptions.length ? "No options" : null}

        disabled={disabled || possibleOptions.length === 0}
        // required={required}
        onChange={onChange}
        placeholder={placeHolder}
        // isMulti={false}
        value={value}
        options={options}
        search
      >
        {/* {possibleOptions?.map((value, idx) => (
          <Option value={value} key={`${value}_${idx}`}>
            {value}
          </Option>
        ))} */}
      </SelectSearch>
    </>
  );
};

export default SelectItem;
