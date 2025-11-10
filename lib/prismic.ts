import * as prismic from "@prismicio/client";

export type PrismicConfig = {
  repositoryName?: string;
  accessToken?: string;
};

export function getRepositoryName() {
  return process.env.PRISMIC_REPOSITORY_NAME;
}

export function createClient(config: PrismicConfig = {}) {
  const repo = config.repositoryName || getRepositoryName();
  if (!repo) throw new Error("Missing PRISMIC_REPOSITORY_NAME");

  const endpoint = prismic.getRepositoryEndpoint(repo);
  const client = prismic.createClient(endpoint, {
    accessToken: config.accessToken || process.env.PRISMIC_ACCESS_TOKEN,
  });

  return client;
}
