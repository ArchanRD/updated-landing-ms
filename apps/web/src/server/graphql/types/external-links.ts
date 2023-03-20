// import { db, ExternalLinkClickType } from "@ms/clients";
// import builder from "../builder";

export const ExternalLinksSchema = () => {
  // builder.enumType(ExternalLinkClickType, {
  //   name: "ExternalLinkClickType",
  // });
  // builder.prismaObject("ExternalLink", {
  //   fields: (t) => ({
  //     id: t.exposeID("id"),
  //     categoryId: t.exposeString("categoryId"),
  //     resourceId: t.exposeString("resourceId"),
  //     destinationURL: t.exposeString("destinationURL"),
  //     active: t.exposeBoolean("active"),
  //     Resource: t.relation("Resource"),
  //     ExternalLinkClicks: t.relation("ExternalLinkClicks"),
  //     Category: t.relation("Category"),
  //   }),
  // });
  // builder.prismaObject("ExternalLinkClicks", {
  //   fields: (t) => ({
  //     id: t.exposeID("id"),
  //     externalLinkId: t.exposeString("externalLinkId"),
  //     count: t.exposeInt("count"),
  //     externalClickType: t.field({
  //       type: ExternalLinkClickType,
  //       resolve: ({ type }) => type,
  //     }),
  //     ExternalLink: t.relation("ExternalLink"),
  //   }),
  // });
  // builder.queryField("currentCategory", (t) =>
  //   t.prismaField({
  //     type: "Category",
  //     args: {
  //       categorySlug: t.arg.string({ required: true }),
  //     },
  //     nullable: true,
  //     resolve: async (query, root, { categorySlug }, ctx, info) => {
  //       return db.category.findUnique({
  //         ...query,
  //         where: {
  //           slug: categorySlug,
  //         },
  //       });
  //     },
  //   })
  // );
};
