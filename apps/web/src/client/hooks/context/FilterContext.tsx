import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ComponentAddressAddress,
  Resource,
} from "../../graphql-strapi/types.generated";
import fuzzysort from "fuzzysort";

export type SelectOption = { id: string; name: string };
export type SelectedOptions = SelectOption[];

export type ProcessedResource = Omit<Resource, "address"> & {
  id: string | null;
  address: ComponentAddressAddress[];
};

type SortAndFilterProviderProps = {
  children: React.ReactNode;
  resources: ProcessedResource[];
};

export const sortConfig = [
  { label: "Recently Added", id: "recently-added" },
  { label: "Popular", id: "popular" },
];

const SortAndFilterStateContext = createContext<
  | {
      filters: {
        selectedTags: SelectedOptions;
        selectedCountries: SelectedOptions;
        searchText: string;
      };
      setSearchText: Dispatch<SetStateAction<string>>;
      setSelectedTags: Dispatch<SetStateAction<SelectOption[]>>;
      setSelectedCountries: Dispatch<SetStateAction<SelectOption[]>>;
      fileteredResources: ProcessedResource[];
    }
  | undefined
>(undefined);

function SortAndFilterProvider({
  children,
  resources,
}: SortAndFilterProviderProps) {
  const [searchText, setSearchText] = useState("");
  const [selectedTags, setSelectedTags] = useState<SelectOption[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<SelectOption[]>(
    []
  );

  const [fileteredResources, setFilteredResources] = useState(resources);
  useEffect(() => {
    const selectedCountriesSet = new Set(selectedCountries.map((i) => i.name));
    const selectedTagsSet = new Set(selectedTags.map((i) => i.id));
    const orderedResults = fuzzysort.go(searchText.length > 0 ? searchText : "*",resources,{
      keys: ['name','desc'],
      scoreFn: a => Math.max(a[0]?a[0].score:-1000, a[1]?a[1].score-100:-1000)
    })
    const searchResults = orderedResults.filter((resourceObj) => {
      const resource = resourceObj.obj;
      if (
        (searchText === "" ||
          resource.name
            .toLocaleLowerCase()
            .includes(searchText.toLocaleLowerCase()) ||
          resource.description
            ?.toLocaleLowerCase()
            .includes(searchText.toLocaleLowerCase())) &&
        (selectedCountriesSet.size === 0 ||
          resource.address?.some(
            (country) =>
              country?.cityInfo?.country &&
              selectedCountriesSet.has(country.cityInfo.country)
          )) &&
        (selectedTagsSet.size === 0 ||
          resource.tags?.data.some((tag) =>
            selectedTagsSet.has(tag.attributes?.notionItemId as string)
          ))
      ) {
        return true;
      }
      return false;
    });
    setFilteredResources(searchResults.map((result)=>result.obj));
  }, [resources, searchText, selectedCountries, selectedTags]);

  const value = useMemo(() => {
    return {
      filters: {
        searchText,
        selectedTags,
        selectedCountries,
      },
      setSearchText,
      setSelectedCountries,
      setSelectedTags,
      fileteredResources,
    };
  }, [fileteredResources, searchText, selectedCountries, selectedTags]);

  return (
    <SortAndFilterStateContext.Provider value={value}>
      {children}
    </SortAndFilterStateContext.Provider>
  );
}

function useSortAndFilter() {
  const context = useContext(SortAndFilterStateContext);
  if (context === undefined) {
    throw new Error(
      "useSortAndFilter must be used within a SortAndFilterProvider"
    );
  }
  return context;
}

export { SortAndFilterProvider, useSortAndFilter };
