import { Config } from "@pulumi/pulumi";
import { Project } from "@pulumi/packet";

export type Platform = {
  project: Project;
  config: Config;
};

export const getPlatform = (project: Project): Platform => {
  return {
    project,
    config: new Config(),
  };
};
