export const strapiConnectClause = <T extends string>(
  key: T,
  connectClause: {
    connect?: { [K in T]: string } | Array<{ [K in T]: string }>;
  },
  idMapper
) => {
  if (!connectClause.connect) {
    return;
  }
  let connectData: Array<{ [K in T]: string }> = [];
  if (!Array.isArray(connectClause.connect)) {
    connectData.push(connectClause.connect);
  } else {
    connectData = connectClause.connect;
  }

  // Replace notionItemId with DB Id
  const mappedConnectData = connectData
    .map((s) => {
      const id = idMapper(s[key]);
      if (!id) {
        console.log(`No mapped id found for id: ${s[key]}`);
        return;
      }

      return { id: id };
    })
    .filter((s) => s);

  return mappedConnectData;
};
