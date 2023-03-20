import { ProcessedResource } from "../client/hooks/context/FilterContext";

export function getTagsForResourceList(resources: ProcessedResource[]) {
  const tagsSet = new Set();
  const tags: { name: string; id: string }[] = [];
  resources?.forEach((resource) => {
    resource.tags?.data?.forEach((tag) => {
      if (!tagsSet.has(tag.attributes?.notionItemId)) {
        tags.push({
          name: tag.attributes?.name as string,
          id: tag.attributes?.notionItemId as string,
        });
        tagsSet.add(tag.attributes?.notionItemId);
      }
    });
  });
  return tags.sort((a, b) => ((a?.name ?? "") > (b?.name ?? "") ? 1 : -1));
}

export function getCountriesForResourceList(resources: ProcessedResource[]) {
  const countriesSet = new Set();
  const countries: { name: string; id: string }[] = [];
  resources?.forEach((resource) => {
    resource.address?.forEach((country) => {
      if (
        country?.cityInfo?.country &&
        !countriesSet.has(country?.cityInfo.country)
      ) {
        countries.push({
          name: country?.cityInfo.country,
          id: country?.cityInfo.country,
        });
        countriesSet.add(country?.cityInfo.country);
      }
    });
  });
  return countries.sort((a, b) => (a.name > b.name ? 1 : -1));
}
