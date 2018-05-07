import AppController from "../models/AppController";

export default async function upgradeProxy({ contractAlias, proxyAddress, initMethod, initArgs, network, all, txParams = {}, packageFileName = null, networkFileName = null }) {
  if (!contractAlias && !all) {
    throw new Error("Please choose a contract name to upgrade, or set --all to upgrade all proxies in the application")
  }
  const appController = new AppController(packageFileName).onNetwork(network, txParams, networkFileName);
  await appController.upgradeProxies(contractAlias, proxyAddress, initMethod, initArgs);
  appController.writeNetworkPackage();
}
