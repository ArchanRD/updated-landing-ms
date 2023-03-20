import pMap from "p-map";
import cityData from "./../../../data/city_state_country.json";
import strapi from "../../../common/strapi/client";
import chalk from "chalk";
import colors from "ansi-colors";

import cliProgress from "cli-progress";

const progressBar = new cliProgress.SingleBar({
  format:
    "Inserting cities Data: " +
    colors.blueBright("{bar}") +
    "| {percentage}% || {value}/{total} || ETA: {eta}s || Elapsed: {duration}s",
  barCompleteChar: "\u2588",
  barIncompleteChar: "\u2591",
  hideCursor: true,
});

export default async function seedCityDataToStrapi() {
  console.log("Starting seeding city data");
  const dataToImport = cityData as Array<{
    city: string;
    state: string;
    country: string;
  }>;

  const entriesToCreate = dataToImport.length;
  progressBar.start(entriesToCreate, 0);
  let processed = 0;

  await pMap(
    dataToImport,
    async (cityData) => {
      try {
        const reqBody = {
          data: {
            city: cityData.city,
            state: cityData.state,
            country: cityData.country,
          },
        };

        const response = await strapi.post("/cities", reqBody);
        progressBar.update(++processed);

        return response.data;
      } catch (e) {
        // if (e.response) {
        //   console.log(
        //     chalk.red(
        //       "Response error: ",
        //       JSON.stringify(e.response.data),
        //       JSON.stringify(cityData)
        //     )
        //   );
        // } else if (e.request) {
        //   console.log(chalk.red("Request error: ", JSON.stringify(e.request)));
        // } else {
        //   console.log(chalk.red("err", e));
        // }
      }
    },
    { concurrency: 50 }
  ).catch((e) => {});

  console.log("Completed seeding city data");
}
