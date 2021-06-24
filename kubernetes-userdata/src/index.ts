import { createControlPlane } from "./kubernetes";

createControlPlane({
  name: "rawkode",
  highlyAvailable: true,
  kubernetesVersion: "1.21.2",
});
