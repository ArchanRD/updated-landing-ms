import seedCategoriesData from "./seed-categories";
import seedRelatedContent from "./seed-related-content";
import seedResourcesData from "./seed-resources";
import seedProductsData from "./seed-products";
import seedCityData from "./seed-city-data";

export async function seedRepositoryData(__req, res) {
  const seedDataToStrapi = true;
  // const categoriesData = await seedCategoriesData({ seedDataToStrapi });
  // const relatedcontent = await seedRelatedContent({ seedDataToStrapi });
  // if (seedDataToStrapi) {
  //   await seedCityData();
  // }
  // const reourcesData = await seedResourcesData({ seedDataToStrapi });
  const productsData = await seedProductsData({ seedDataToStrapi });
}
