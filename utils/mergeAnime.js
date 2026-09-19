export const getSearchMergeKey = (title = "") => {
  return title
    .toLowerCase()
    .replace(/\(.*?\)/g, "")
    .replace(/subtitle\s*indonesia|sub\s*indo|subtitle/gi, "")
    .replace(/\b(bd|batch|uncensored|uncen)\b/gi, "")
    .replace(/[^a-z0-9]/g, "")
    .trim();
};

export const getMergeKey = (title = "") => {
  return title
    .toLowerCase()
    .replace(/\(.*?\)/g, "")
    .replace(/subtitle\s*indonesia|sub\s*indo|subtitle/gi, "")
    .replace(/\b(bd|batch|uncensored|uncen)\b/gi, "")
    .replace(/\b(season|s)\s*\d+\b/gi, "")
    .replace(/\b\d+(st|nd|rd|th)\s*(season)?\b/gi, "")
    .replace(/\bpart\s*\d+\b/gi, "")
    .replace(/\b(wa|no|ga|wo|ni|to|de|na|mo|ya|ka|he)\b/gi, "")
    .replace(/[^a-z0-9]/g, "")
    .trim();
};
