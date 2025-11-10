import * as prismic from "@prismicio/client";

export type PrismicConfig = {
  repositoryName?: string;
  accessToken?: string;
};

export function getRepositoryName() {
  return process.env.PRISMIC_REPOSITORY_NAME;
}

export function createClient(config: PrismicConfig = {}) {
  function normalizeRepositoryName(input?: string) {
    if (!input) return undefined;
    const s = input.replace(/^https?:\/\//i, "");
    const match = s.match(/^([^.]+)\.prismic\.io/i);
    return match ? match[1] : input;
  }

  const repoName = normalizeRepositoryName(config.repositoryName || getRepositoryName());
  if (!repoName) throw new Error("Missing PRISMIC_REPOSITORY_NAME");

  const endpoint = prismic.getRepositoryEndpoint(repoName);
  const client = prismic.createClient(endpoint, {
    accessToken: config.accessToken || process.env.PRISMIC_ACCESS_TOKEN,
  });

  return client;
}
