import * as pulumi from "@pulumi/pulumi";
import * as metal from "@pulumi/equinix-metal";

const config = new pulumi.Config();

const k3sControlPlane = new metal.Device("k3s-control-plane", {
  billingCycle: metal.BillingCycle.Hourly,
  hostname: "k3s-control-plane",
  operatingSystem: metal.OperatingSystem.Ubuntu2004,
  plan: metal.Plan.C3MediumX86,
  projectId: config.require("projectID"),
  description: "K3s Control Plane (Don't Delete)",
  metro: "am",
  userData: `#!/usr/bin/env sh
export INSTALL_K3S_EXEC="--bind-address 127.0.0.1 --disable=traefik"
curl -sfL https://get.k3s.io | sh -
`,
});
