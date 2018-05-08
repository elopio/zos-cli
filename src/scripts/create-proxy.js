import AppController from '../models/AppController';

export default async function createProxy({ contractAlias, initMethod, initArgs, network, txParams = {}, packageFileName = null, networkFileName = null, force = false }) {
  const appController = new AppController(packageFileName).onNetwork(network, txParams, networkFileName);
  await appController.checkContractChanged(contractAlias, !force);
  await appController.createProxy(contractAlias, initMethod, initArgs);
  appController.writeNetworkPackage();
}

