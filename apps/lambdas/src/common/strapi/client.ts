import axios from "axios";
import { STRAPI_ENDPOINT } from "../utils/consts";
import axiosRetry from "axios-retry";

const strapiClient = axios.create({
  baseURL: STRAPI_ENDPOINT,
  timeout: 10000,
  headers: {
    Authorization:
      "Bearer 4467dd4a39e2208483a9db94901b0f87d532a715e2445192786ebe5f06cdedd222159f6943653caad2049c82d21f6a4d306d68ff20d3c1e19a1c40aa5fea963898fefaf786342cf97080e6dc29a9fdeeb180f8f78fae9511c3d5bd3dc7b69707917ed2851593c1392e1126f64a1c5e4aad26f5b97fd0d7f03f78d44752d1ab21",
  },
});
axiosRetry(strapiClient, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
});

export default strapiClient;
