import React from "react";
import Select, {
  components,
  ValueContainerProps,
  MultiValueProps,
} from "react-select";
import { useState } from "react";

export type SelectOption = { id: string; name: string };

type Props = {
  options: SelectOption[];
  selectedOptions: SelectOption[];
  setSelectedOptions: React.Dispatch<React.SetStateAction<SelectOption[]>>;
  label: string;
};

const MultiSelectFilter = ({
  options,
  label,
  selectedOptions,
  setSelectedOptions,
}: Props) => {
  const [query, setQuery] = useState("");

  const filteredPeople =
    query === ""
      ? options
      : options.filter((option) => {
          return option.name.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <Select
      options={filteredPeople?.map((opt) => {
        return { value: opt.id, label: opt.name };
      })}
      id="long-value-select"
      instanceId="long-value-select"
      isMulti={true}
      closeMenuOnSelect={false}
      closeMenuOnScroll={false}
      isSearchable={true}
      placeholder={label}
      className="block mr-1 mt-1 w-1/2 h-fit shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm react-select-multi"
      onChange={(option) => {
        setSelectedOptions(
          option.map((op) => {
            return { name: op.label as string, id: op.value as string };
          })
        );
      }}
    ></Select>
  );
};

export default MultiSelectFilter;
