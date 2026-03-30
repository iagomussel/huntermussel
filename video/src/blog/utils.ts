import {staticFile} from "remotion";

export const resolveAsset = (path?: string) => {
  if (!path) return undefined;
  if (path.startsWith("/") || path.includes(":\\")) {
    return path; // Absolute path
  }
  return staticFile(path); // Relative to public
};
