module.exports = ({ env }) => ({
  "city-selector": {
    enabled: true,
    resolve: "./src/plugins/city-selector",
  },
  upload: {
    config: {
      provider: "aws-s3",
      providerOptions: {
        accessKeyId: env("AWS_ACCESS_KEY_ID"),
        secretAccessKey: env("AWS_ACCESS_SECRET"),
        region: env("AWS_REGION"),
        params: {
          Bucket: env("AWS_BUCKET", "ms-strapi-uploads-dev"),
        },
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  },
  graphql: {
    enabled: true,
    config: {
      playgroundAlways: true,
      defaultLimit: 100000,
      maxLimit: 100000,
      apolloServer: {
        tracing: true,
      },
    }
  }
});
