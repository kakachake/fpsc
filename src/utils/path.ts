import path from "path";
export const getpath = (name: string, basePath: string = "") => {
  return path.resolve(basePath, name);
};
