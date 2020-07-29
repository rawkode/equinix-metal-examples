import * as packet from "@pulumi/packet";
import { getPlatform } from "./platform";
import { createSaltMaster } from "./salt-master";
import { createSaltMinion } from "./salt-minion";

const project = new packet.Project("pulumi-saltstack-example", {
  name: "pulumi-saltstack-example",
});

const platform = getPlatform(project);

export const projectName = platform.project.name;

const saltMaster = createSaltMaster(platform, "master-1");
export const saltMasterPublicIp = saltMaster.device.accessPublicIpv4;

const saltMinion = createSaltMinion(platform, "minion-1", saltMaster);
