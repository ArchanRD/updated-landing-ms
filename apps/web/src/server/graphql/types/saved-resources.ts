import { db } from "@ms/clients";
import builder from "../builder";

export const SavedResourcesSchema = () => {
  // builder.prismaObject("Country", {
  //   fields: (t) => ({
  //     id: t.exposeID("id"),
  //     name: t.exposeString("name"),
  //     createdAt: t.expose("createdAt", {
  //       type: "DateTime",
  //       nullable: true,
  //     }),
  //     updatedAt: t.expose("updatedAt", {
  //       type: "DateTime",
  //       nullable: true,
  //     }),
  //   }),
  // });
  builder.prismaObject("User", {
    fields: (t) => ({
      id: t.exposeID("id"),
      name: t.exposeString("name"),
      email: t.exposeString("email"),
      image: t.exposeString("image", {
        nullable: true,
      }),
      emailVerified: t.expose("emailVerified", {
        nullable: true,
        type: "DateTime",
      }),
      savedResources: t.relation("UserSavedResources"),
    }),
  });
  builder.prismaObject("UserSavedResource", {
    fields: (t) => ({
      id: t.exposeID("id"),
      userId: t.exposeString("userId"),
      resourceId: t.exposeString("resourceId"),
      user: t.relation("user"),
      savedAt: t.expose("savedAt", {
        type: "DateTime",
        nullable: true,
      }),
    }),
  });
};

export const ResourceQueriesSchema = () => {
  builder.queryField("currentUser", (t) =>
    t.prismaField({
      type: "User",
      nullable: true,
      resolve: async (query, _, { resourceId }, ctx) => {
        return db.user.findUnique({
          ...query,
          where: {
            id: ctx.user?.id,
          },
        });
      },
    })
  );

  builder.mutationField("saveResource", (t) =>
    t.prismaField({
      type: "UserSavedResource",
      args: {
        resourceId: t.arg({ type: "String", required: true }),
      },
      authScopes: {
        user: true,
      },
      resolve: async (query, _, { resourceId }, ctx) => {
        if (!ctx.user?.id) throw new Error("User not found");
        return db.userSavedResource.upsert({
          ...query,
          create: {
            userId: ctx.user?.id,
            resourceId,
          },
          update: {
            userId: ctx.user?.id,
            resourceId,
          },
          where: {
            userId_resourceId: {
              userId: ctx.user?.id,
              resourceId,
            },
          },
        });
      },
    })
  );

  builder.mutationField("removeSavedResource", (t) =>
    t.prismaField({
      type: "UserSavedResource",
      nullable: true,
      args: {
        resourceId: t.arg({ type: "String", required: true }),
      },
      authScopes: {
        user: true,
      },
      resolve: async (query, _, { resourceId }, ctx) => {
        if (!ctx.user?.id) throw new Error("User not found");
        return db.userSavedResource.delete({
          ...query,
          where: {
            userId_resourceId: {
              resourceId,
              userId: ctx.user?.id,
            },
          },
        });
      },
    })
  );
};
