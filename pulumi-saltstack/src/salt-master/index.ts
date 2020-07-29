import {
  Device,
  IpAddressTypes,
  OperatingSystems,
  Plans,
  Facilities,
  BillingCycles,
} from "@pulumi/packet";
import { Platform } from "../platform";
import * as fs from "fs";
import * as path from "path";
import * as mustache from "mustache";

export type SaltMaster = {
  device: Device;
};

export const createSaltMaster = (
  platform: Platform,
  name: string
): SaltMaster => {
  // While we're not interpolating anything in this script atm,
  // might as well leave this code in for the time being; as
  // we probably will shortly.
  const bootstrapString = fs
    .readFileSync(path.join(__dirname, "./user-data.sh"))
    .toString();

  const bootstrapScript = mustache.render(bootstrapString, {});

  const saltMaster = new Device(`master-${name}`, {
    hostname: name,
    plan: Plans.C1LargeARM,
    facilities: [Facilities.AMS1],
    operatingSystem: OperatingSystems.Debian9,
    billingCycle: BillingCycles.Hourly,
    ipAddresses: [
      { type: IpAddressTypes.PrivateIPv4, cidr: 31 },
      {
        type: IpAddressTypes.PublicIPv4,
      },
    ],
    projectId: platform.project.id,
    userData: bootstrapScript,
  });

  return {
    device: saltMaster,
  };
};
