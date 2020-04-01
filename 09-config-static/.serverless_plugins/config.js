const filewalker = require('filewalker');
const fs = require('fs-extra');
const terser = require('terser');

module.exports = class ConfigServerlessPlugin {
  constructor(serverless, options) {
    //Paths
    this.configOrigin = `${process.cwd()}/config/index.json`;
    this.configDestination = `${process.cwd()}/dist/config/default.json`;
    this.sourceOrigin = `${process.cwd()}/src`;
    this.sourceDestination = `${process.cwd()}/dist`;
    //Params
    this.serverless = serverless;
    this.options = options;
    this.commands = {
      putsecret: {
        usage: 'Add a new secret to parameter store',
        lifecycleEvents: ['putsecret'],
        options: {
          name: { usage: 'Secret Name', required: true },
          value: { usage: 'Secret Value', required: true },
          stage: { usage: 'Env', required: true, shortcut: 's' },
        },
      },
      getconfig: {
        usage: 'Updates the dist config',
        lifecycleEvents: ['getconfig'],
      },
    };
    this.hooks = {
      // 'after:deploy:deploy': this.overrideConfig.bind(this),
      'putsecret:putsecret': this.putSecret.bind(this),
      'getconfig:getconfig': this.overrideConfig.bind(this),
    };
    this.service = this.serverless.service.getServiceName();
    this.stage = this.serverless.getProvider('aws').getStage();
  }

  $awsAction = async (service, command, params) =>
    this.serverless.getProvider('aws').request(service, command, params, this.service, this.stage);
  $putParameter = async ({ Name, Value, Type = 'String' }) =>
    this.$awsAction('SSM', 'putParameter', { Name, Value, Type, Overwrite: true });
  $getParameter = async (Names) =>
    this.$awsAction('SSM', 'getParameters', { Names, WithDecryption: true });
  $getFiles = (path) => {
    return new Promise(resolve => {
      const files = [];
      filewalker(path).walk()
        .on('file', (_a, _b, filePath) => files.push(filePath))
        .on('done', () => resolve(files));
    });
  }
  $compressSourceCode = async () => {
    console.log(`Generating dist folder at ${this.sourceDestination} ...`);
    await fs.rmdir(this.sourceDestination, { recursive: true });
    if (this.stage.includes('local')) await fs.ensureSymlink(this.sourceOrigin, this.sourceDestination);
    else {
      const files = await this.$getFiles(this.sourceOrigin);
      await Promise.all(files.map(async filePath => {
        const fileDest = filePath.replace(this.sourceOrigin, this.sourceDestination);
        await fs.ensureFile(fileDest);
        if (filePath.endsWith('.js')) {
          const fileContent = await fs.readFile(filePath).catch(console.log);
          const { code: compressedData } = terser.minify(fileContent.toString());
          await fs.writeFile(fileDest, compressedData)
        } else await fs.copyFile(filePath, fileDest);
      }));
    }
    console.log('compressSourceCode: DONE');
  }
  $compressNodeModules = async () => {
    console.log(`Compressing node-modules...`);
    if (this.stage.includes('local')) return;
    const files = await this.$getFiles(`${process.cwd()}/node_modules`);
    await Promise.all(files.map(async filePath => {
      if (filePath.endsWith('.js')) {
        const fileContent = await fs.readFile(filePath).catch(console.log);
        const { code: compressedData } = terser.minify(fileContent.toString());
        await fs.writeFile(filePath, compressedData);
      }
    }));
    console.log('compressNodeModules: DONE');
  }
  $getOutputs = async (wantedOutputs) => {
    try {
      console.log('Getting outputs...');
      const stacks = await this.$awsAction('CloudFormation', 'describeStacks', { StackName: `${this.service}-${this.stage}` });
      const currentOutputs = stacks.Stacks[0].Outputs;
      const calculatedOutputs = Object.keys(wantedOutputs).map(key => {
        const { OutputValue = null } = currentOutputs.find(output => output.OutputKey === wantedOutputs[key]) || {};
        return {
          [key]: OutputValue
        };
      }).reduce((p, c) => { p[Object.keys(c)[0]] = c[Object.keys(c)[0]]; return p; }, {});
      console.log('getOutputs: DONE');
      return calculatedOutputs;
    } catch (error) {
      return wantedOutputs;
    }
  }
  $getSecrets = async (wantedSecrets) => {
    console.log('Getting secrets...');
    const wantedSecretsPath = wantedSecrets.map(s => `/${this.service}/${this.stage}/secrets/${s}`);
    const { Parameters } = await this.$getParameter(wantedSecretsPath);
    const calculatedSecrets = wantedSecrets.map(s => {
      const { Value = null } = Parameters.find(p => p.Name === `/${this.service}/${this.stage}/secrets/${s}`) || {};
      return {
        [s]: Value
      };
    }).reduce((p, c) => { p[Object.keys(c)[0]] = c[Object.keys(c)[0]]; return p; }, {});
    console.log('getSecrets: DONE');
    return calculatedSecrets;
  }

  overrideConfig = async () => {
    console.log('Generating dist package...');
    const rawConfigs = await fs.readJson(this.configOrigin);
    const tasks = [
      this.$getOutputs(rawConfigs.defaults.outputs),
      this.$getSecrets(rawConfigs.defaults.secrets),
      this.$compressSourceCode(),
      this.$compressNodeModules(),
    ];
    const { 0: outputs, 1: secrets } = await Promise.all(tasks);
    const envTarget = Object.keys(rawConfigs).find(k => k.includes(this.stage));
    const out = { NODE_ENV: envTarget, ...rawConfigs.defaults, ...rawConfigs[envTarget], outputs, secrets };
    await fs.writeJSON(this.configDestination, out);
    console.log('genDistPackage: DONE');
  }

  putSecret = async () => {
    console.log('ConfigServerlessPlugin: Uploading secret...');
    await this.$putParameter({ Name: `/${this.service}/${this.stage}/secrets/${this.options.name}`, Value: this.options.value, Type: 'SecureString' });
    const rawConfigs = await fs.readJson(this.configOrigin);
    if (!rawConfigs.defaults.secrets.find(e => e === this.options.name)) {
      rawConfigs.defaults.secrets.push(this.options.name);
      await fs.writeJSON(this.configOrigin, rawConfigs, { spaces: 2 });
    }
  };
}