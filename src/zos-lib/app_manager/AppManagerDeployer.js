import Logger from '../../utils/Logger'
import AppManagerWrapper from "./AppManagerWrapper"
import ContractsProvider from "../../models/ContractsProvider"

const log = new Logger('AppManagerDeployer')

export default {
  async call(owner, version, stdlibAddress = 0x0) {
    this.txParams = { from: owner }
    await this.createFactory()
    await this.createPackage()
    await this.createAppDirectory(stdlibAddress)
    await this.addVersion(version)
    await this.createAppManager(version)
    return new AppManagerWrapper(owner, this.packagedAppManager, this.factory, this.appDirectory, this.package, this.version)
  },

  async createAppManager(version) {
    log.info('Deploying new PackagedAppManager...')
    const PackagedAppManager = ContractsProvider.getByName('PackagedAppManager')
    this.packagedAppManager = await PackagedAppManager.new(this.package.address, version, this.factory.address, this.txParams)
    log.info(`Deployed PackagedAppManager ${this.packagedAppManager.address}`)
  },

  async createFactory() {
    log.info('Deploying new UpgradeabilityProxyFactory...')
    const UpgradeabilityProxyFactory = ContractsProvider.getByName('UpgradeabilityProxyFactory')
    this.factory = await UpgradeabilityProxyFactory.new(this.txParams)
    log.info(`Deployed UpgradeabilityProxyFactory ${this.factory.address}`)
  },

  async createPackage() {
    log.info('Deploying new Package...')
    const Package = ContractsProvider.getByName('Package')
    this.package = await Package.new(this.txParams)
    log.info(`Deployed Package ${this.package.address}`)
  },

  async createAppDirectory(stdlibAddress) {
    log.info('Deploying new AppDirectory...')
    const AppDirectory = ContractsProvider.getByName('AppDirectory')
    this.appDirectory = await AppDirectory.new(stdlibAddress, this.txParams)
    log.info(`Deployed AppDirectory ${this.appDirectory.address}`)
  },

  async addVersion(version) {
    log.info('Adding new version...')
    this.version = version
    await this.package.addVersion(version, this.appDirectory.address, this.txParams)
    log.info(`Added version ${version}`)
  }
}