import { Config } from "@pulumi/pulumi";
import { Project } from "@pulumi/packet";

export type Platform = {
  project: Project;
  config: Config;
};

export const getPlatform = (): Platform => {
  const config = new Config();

  const project = new Project("project", {
    name: config.require("projectName"),
    organizationId: config.require("organizationID"),
  });

  return {
    project,
    config,
  };
};
