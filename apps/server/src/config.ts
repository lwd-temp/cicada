import * as yargs from 'yargs';
import fs from 'fs';
import os from 'os';
import path from 'path';
import exitWithMessage from './utils/exit_with_message';

interface Config {
  base: string;
  publicAddress: string;
  port: number;
  emailHost: string;
  emailPort: number;
  emailUser: string;
  emailPass: string;
  clusterCount: number;
  userExportMusicbillMaxTimesPerDay: number;
  userUploadMusicMaxTimesPerDay: number;
}

let configFilePath: string;
if (process.env.NODE_ENV === 'production') {
  const argv = yargs.parse(process.argv) as {
    config?: string;
  };
  if (!argv.config) {
    exitWithMessage('请通过 [--config] 指定配置文件');
  }
  configFilePath = path.resolve(process.cwd(), argv.config!);
} else {
  configFilePath = path.join(__dirname, '../../../config.json');
}
if (!fs.existsSync(configFilePath)) {
  exitWithMessage(`配置文件 [${configFilePath}] 不存在`);
}

let configFromFile: Config;
try {
  configFromFile = JSON.parse(fs.readFileSync(configFilePath).toString());
} catch (error) {
  console.error(error);
  exitWithMessage(`配置文件 [${configFilePath}] 解析错误`);
}

const DEFAULT_CONFIG: Omit<
  Config,
  'publicAddress' | 'emailHost' | 'emailUser' | 'emailPass'
> = {
  base: `${os.homedir()}/cicada`,
  port: 8000,
  emailPort: 465,
  clusterCount: 1,
  userExportMusicbillMaxTimesPerDay: 3,
  userUploadMusicMaxTimesPerDay: 5,
};

const config: Config = {
  ...DEFAULT_CONFIG,
  // @ts-expect-error
  ...configFromFile,
};
if (!config.publicAddress) {
  config.publicAddress = `http://localhost:${config.port}`;
}

const REQUIRED_CONFIG_KEYS: (keyof Config)[] = [
  'emailHost',
  'emailUser',
  'emailPass',
];
for (const key of REQUIRED_CONFIG_KEYS) {
  if (!config[key]) {
    exitWithMessage(`配置项 [${key}] 不能为空`);
  }
}

export default config;