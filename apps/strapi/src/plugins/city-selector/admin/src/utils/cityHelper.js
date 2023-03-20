import axios from "./axiosInstance";

const getAllCityDetails = async (page = 1, pageSize = 10000) => {
  const result = [];
  const endpoint = `/content-manager/collection-types/api::city.city?page=${page}&pageSize=${pageSize}`;
  try {
    const response = await axios.get(endpoint);

    const data = response.data;

    const paginationData = data.pagination ?? { page: page, pageCount: page };

    result.push(...data.results);

    if (paginationData.page >= paginationData.pageCount) {
      return result;
    }

    const nextRes = await getAllCityDetails(
      paginationData.page + 1,
      pageSize
    ).catch((e) => console.log("err-push", e));
    if (nextRes) {
      result.push(...nextRes);
    }
    return result;
  } catch (e) {
    if (e.response) {
      console.log(
        "Response error while fetching the data for endpoint " + endpoint,
        JSON.stringify(e.response.data)
      );
    } else if (e.request) {
      console.log(
        "Request error while fetching the data for endpoint " + endpoint,
        JSON.stringify(e.request)
      );
    } else {
      console.log("err", e);
    }

    return result;
  }
};

export default { getAllCityDetails };
