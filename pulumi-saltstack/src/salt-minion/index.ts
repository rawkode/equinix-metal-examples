import { interpolate } from "@pulumi/pulumi";
import {
  BillingCycles,
  Device,
  Facilities,
  OperatingSystems,
  Plans,
} from "@pulumi/packet";
import { Platform } from "../platform";
import { SaltMaster } from "../salt-master";
import * as fs from "fs";
import * as path from "path";
import * as mustache from "mustache";

type SaltMinion = {
  device: Device;
};

export const createSaltMinion = (
  platform: Platform,
  name: string,
  master: SaltMaster
): SaltMinion => {
  const bootstrapString = fs
    .readFileSync(path.join(__dirname, "./user-data.sh"))
    .toString();

  const saltMinion = new Device(`minion-${name}`, {
    hostname: name,
    plan: Plans.C1LargeARM,
    facilities: [Facilities.AMS1],
    operatingSystem: OperatingSystems.Debian9,
    billingCycle: BillingCycles.Hourly,
    projectId: platform.project.id,
    userData: master.device.accessPrivateIpv4.apply((ipv4) => {
      return mustache.render(bootstrapString, { master_ip: ipv4 });
    }),
  });

  // interpolate`${mustache.render(bootstrapString, {
  //   master_ip: master.device.accessPrivateIpv4,
  // })}`,

  return {
    device: saltMinion,
  };
};
