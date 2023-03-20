import strapi from "./client";
import FormData from "form-data";
import axios from "axios";

interface IStrapiPaginationMetaData {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

interface IStrapiGetResponse<T> {
  data: Array<T>;
  meta: {
    pagination: IStrapiPaginationMetaData;
  };
}

const getNextPageNumFromPaginationMetaData = (
  paginationMetaData: IStrapiPaginationMetaData
) => {
  if (paginationMetaData.page >= paginationMetaData.pageCount) {
    return;
  }

  return paginationMetaData.page + 1;
};

export const fetchPaginatedData = async <T>(
  endpoint,
  fieldsToInclude: string[],
  pageSize = 100
): Promise<Array<T>> => {
  const data: Array<T> = [];
  try {
    const responseData = await fetchData<T>(
      endpoint,
      fieldsToInclude,
      1,
      pageSize
    );
    data.push(...responseData.data);

    let nextPage = getNextPageNumFromPaginationMetaData(
      responseData.meta.pagination
    );

    while (nextPage !== undefined) {
      const resData = await fetchData<T>(
        endpoint,
        fieldsToInclude,
        nextPage,
        pageSize
      );
      data.push(...resData.data);

      nextPage = getNextPageNumFromPaginationMetaData(resData.meta.pagination);
    }
  } catch (e) {
    if (e.response) {
      console.log(
        "Response error while fetching the data for endpoint " + endpoint
        // JSON.stringify(e.response.data)
      );
      console.log("err", e);
    } else if (e.request) {
      console.log(
        "Request error while fetching the data for endpoint " + endpoint
        // JSON.stringify(e.request)
      );
      console.log("err", e);
    } else {
      console.log("err", e);
    }
  }

  return data;
};

const fetchData = async <T>(
  endpoint,
  fieldsToInclude: string[],
  page: number,
  pageSize: number
): Promise<IStrapiGetResponse<T>> => {
  let finalEndpoint = `${endpoint}?`;
  let fieldIncludeQueries: string[] = [];
  finalEndpoint += `pagination[page]=${page}&pagination[pageSize]=${pageSize}`;
  for (let i = 0; i < fieldsToInclude.length; i++) {
    fieldIncludeQueries.push(`fields[${i}]=${fieldsToInclude[i]}`);
  }

  if (fieldIncludeQueries.length > 0) {
    finalEndpoint += "&" + fieldIncludeQueries.join("&");
  }
  console.log(`Making paginated API call to endpoint ${finalEndpoint}`);
  const response = await strapi.get(finalEndpoint);
  return response.data;
};

export const uploadFileToStrapi = async (url: string, fileName: string) => {
  const response = await axios.get(url, { responseType: "stream" });

  const contentType = response?.headers["content-type"];

  const ext = "." + contentType?.split("/")[1];

  const name = fileName + ext;

  const form = new FormData();
  form.append("files", response.data, name);

  try {
    const resp = await strapi.post("/upload", form, {
      headers: { ...form.getHeaders() },
    });

    return resp.data[0].id;
  } catch (e) {
    if (e.response) {
      throw new Error(
        "Failed to upload data to strapi due to " +
          JSON.stringify(e.response.data)
      );
    }

    throw e;
  }
};
