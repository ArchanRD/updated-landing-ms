import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import SelectItem from "./SelectItem";
import CityHelper from "./../../utils/cityHelper";
import { Loader } from "@strapi/design-system";

const CitySelector = (props) => {
  console.log("props", props);

  const { value, onChange, name, required, attribute } = props;
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [possibleOptions, setPossibleActions] = useState([]);

  useEffect(async () => {
    setIsLoading(true);
    const data = await CityHelper.getAllCityDetails(1, 10000);
    if (data) {
      setPossibleActions(data);
      setDataLoaded(true);
      setIsLoading(false);
    }
  }, []);

  const sanitizedValue = useMemo(() => {
    let parsedValue = {};
    try {
      parsedValue = JSON.parse(value && value !== "null" ? value : "{}");
    } catch (e) {
      parsedValue = {};
    }
    return parsedValue;
  }, [value, possibleOptions]);

  const { city, state, country } = sanitizedValue;

  const handleOnChange = (type, value) => {
    const result = { ...sanitizedValue };
    result[type] = value;

    onChange({
      target: {
        name: name,
        value: JSON.stringify(result),
        type: attribute.type,
      },
    });
  };

  const possibleCountries = useMemo(() => {
    const countrySet = new Set(possibleOptions?.map((s) => s.country));
    if (country) {
      countrySet.add(country);
    }
    return [...countrySet];
  }, [possibleOptions, country]);

  const possibleStates = useMemo(() => {
    if (!country) {
      return [];
    }

    const stateSet = new Set(
      possibleOptions
        .filter((opt) => opt.country === country)
        .map((s) => s.state)
    );

    if (state) {
      stateSet.add(state);
    }

    return [...stateSet];
  }, [possibleOptions, country]);

  const possibleCities = useMemo(() => {
    if (!country || !state) {
      return [];
    }

    const citySet = new Set(
      possibleOptions
        .filter((opt) => opt.country === country && opt.state === state)
        .map((s) => s.city)
    );

    if (city) {
      citySet.add(city);
    }
    return [...citySet];
  }, [possibleOptions, country, state]);

  if (isLoading) {
    return <Loader small={true} />;
  }

  return (
    <>
      <SelectItem
        possibleOptions={possibleCountries}
        onChange={(v) => handleOnChange("country", v)}
        label={"Country"}
        placeHolder={"Select a country"}
        required={required}
        value={country}
        loading={isLoading}
        disabled={!dataLoaded || isLoading}
      />
      <br />

      {country && (
        <SelectItem
          possibleOptions={possibleStates}
          onChange={(v) => handleOnChange("state", v)}
          label={"State"}
          placeHolder={"Select a state"}
          required={required}
          value={state}
          loading={isLoading}
          disabled={!dataLoaded || isLoading}
        />
      )}

      <br />

      {country && state && (
        <SelectItem
          possibleOptions={possibleCities}
          onChange={(v) => handleOnChange("city", v)}
          label={"City"}
          placeHolder={"Select a city"}
          required={required}
          value={city}
          loading={isLoading}
          disabled={!dataLoaded || isLoading}
        />
      )}
    </>
  );
};

CitySelector.defaultProps = {
  description: null,
  disabled: false,
  error: null,
  labelAction: null,
  required: false,
  value: "",
};

CitySelector.PropTypes = {
  intlLabel: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  attribute: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.object,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  labelAction: PropTypes.object,
  required: PropTypes.bool,
  value: PropTypes.string,
};

export default CitySelector;
