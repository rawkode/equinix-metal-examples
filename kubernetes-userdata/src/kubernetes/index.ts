import * as pulumi from "@pulumi/pulumi";
import * as metal from "@pulumi/equinix-metal";
import * as random from "@pulumi/random";
import * as fs from "fs";

type ControlPlaneNode = metal.Device;

export interface ControlPlaneConfig {
  name: string;
  kubernetesVersion: string;
  highlyAvailable: boolean;
}

export interface ControlPlane {
  ipAddress: pulumi.Output<string>;
  joinToken: pulumi.Output<string>;
  certificateKey: pulumi.Output<string>;
}

export const createControlPlane = (
  config: ControlPlaneConfig
): ControlPlane => {
  const certificateKey = new random.RandomString("certificateKey", {
    length: 32,
    special: false,
  });

  const joinTokenLeft = new random.RandomString("joinTokenLeft", {
    length: 6,
    special: false,
    lower: true,
    number: true,
    upper: false,
  });

  const joinTokenRight = new random.RandomString("joinTokenRight", {
    length: 16,
    special: false,
    lower: true,
    number: true,
    upper: false,
  });

  const ip = new metal.ReservedIpBlock("rawkode", {
    projectId: "7158c8a9-a55e-454e-a1aa-ce5f8937ed10",
    metro: "am",
    type: "public_ipv4",
    quantity: 1,
  });

  const controlPlane = {
    ipAddress: ip.address,
    joinToken: pulumi.interpolate`${joinTokenLeft.result}.${joinTokenRight.result}`,
    certificateKey: certificateKey.result,
  };

  const controlPlane1: ControlPlaneNode = createControlPlaneNode(
    1,
    config,
    controlPlane,
    []
  );

  if (config.highlyAvailable) {
    const controlPlane2: ControlPlaneNode = createControlPlaneNode(
      2,
      config,
      controlPlane,
      [controlPlane1]
    );
    const controlPlane3: ControlPlaneNode = createControlPlaneNode(
      3,
      config,
      controlPlane,
      [controlPlane2]
    );
  }

  return controlPlane;
};

const createControlPlaneNode = (
  number: Number,
  config: ControlPlaneConfig,
  controlPlane: ControlPlane,
  dependsOn: ControlPlaneNode[]
): ControlPlaneNode => {
  const device = new metal.Device(
    `${config.name}-${number}`,
    {
      hostname: `${config.name}-${number}`,
      metro: "am",
      billingCycle: metal.BillingCycle.Hourly,
      plan: metal.Plan.S3XLargeX86,
      operatingSystem: metal.OperatingSystem.Ubuntu2004,
      projectId: "7158c8a9-a55e-454e-a1aa-ce5f8937ed10",
      customData: pulumi
        .all([
          controlPlane.certificateKey,
          controlPlane.joinToken,
          controlPlane.ipAddress,
        ])
        .apply(([certificateKey, joinToken, ipAddress]) =>
          JSON.stringify({
            kubernetesVersion: config.kubernetesVersion,
            joinToken: joinToken,
            controlPlaneIp: ipAddress,
            certificateKey: certificateKey,
          })
        ),
      userData: fs.readFileSync("../control-plane.sh", "utf8"),
    },
    {
      dependsOn,
    }
  );

  new metal.BgpSession(`${config.name}-${number}`, {
    deviceId: device.id,
    addressFamily: "ipv4",
  });

  return device;
};
