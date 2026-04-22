import { access, readFile } from "node:fs/promises";
import { join } from "node:path";
import type {
  ArticlePreview,
  ArticleType,
  DailyDigest,
  ProfileSummary,
  ReaderArticle,
  VocabularySnapshot,
} from "@buildspeak/types";

const existingPath = async (path: string) => {
  try {
    await access(path);
    return path;
  } catch {
    return null;
  }
};

const resolveContentDir = async (rootDir = process.cwd()) => {
  const candidates = [join(rootDir, "content"), join(rootDir, "apps", "web", "content")];

  for (const candidate of candidates) {
    const matched = await existingPath(candidate);
    if (matched) {
      return matched;
    }
  }

  throw new Error(`Unable to find content directory from root: ${rootDir}`);
};

const readJson = async <T>(path: string): Promise<T> =>
  JSON.parse(await readFile(path, "utf8")) as T;

export const getDailyDigest = async (rootDir?: string): Promise<DailyDigest> => {
  const contentDir = await resolveContentDir(rootDir);
  return readJson<DailyDigest>(join(contentDir, "digest", "latest.json"));
};

export const getReaderArticle = async (
  type: ArticleType,
  id: string,
  rootDir?: string,
): Promise<ReaderArticle | undefined> => {
  const contentDir = await resolveContentDir(rootDir);
  const articlePath = join(contentDir, "articles", `${id}.json`);

  if (!(await existingPath(articlePath))) {
    return undefined;
  }

  const article = await readJson<ReaderArticle>(articlePath);
  return article.type === type ? article : undefined;
};

export const getAllReaderRoutes = async (
  rootDir?: string,
): Promise<Array<Pick<ArticlePreview, "id" | "type">>> => {
  const digest = await getDailyDigest(rootDir);

  return Object.values(digest.sections)
    .flat()
    .map((article) => ({ id: article.id, type: article.type }));
};

export const getFeaturedReaderHref = async (rootDir?: string) => {
  const digest = await getDailyDigest(rootDir);
  return `/read/${digest.featuredArticle.type}/${digest.featuredArticle.id}`;
};

export const getVocabularySnapshot = async (
  rootDir?: string,
): Promise<VocabularySnapshot> => {
  const contentDir = await resolveContentDir(rootDir);
  return readJson<VocabularySnapshot>(join(contentDir, "vocab", "latest.json"));
};

export const getProfileSummary = async (rootDir?: string): Promise<ProfileSummary> => {
  const contentDir = await resolveContentDir(rootDir);
  return readJson<ProfileSummary>(join(contentDir, "profile", "latest.json"));
};
