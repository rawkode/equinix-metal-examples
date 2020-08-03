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
  const bootstrapString = fs
    .readFileSync(path.join(__dirname, "./user-data.sh"))
    .toString();

  const pythonPacketMetadataGrain = fs
    .readFileSync(path.join(__dirname, "..", "salt", "packet_metadata.py"))
    .toString();

  const saltMaster = new Device(`master-${name}`, {
    hostname: name,
    plan: Plans.C2MediumX86,
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
    userData: mustache.render(bootstrapString, {
      PACKET_METADATA_PY: pythonPacketMetadataGrain,
    }),
    tags: ["role/salt-master"],
  });

  return {
    device: saltMaster,
  };
};
