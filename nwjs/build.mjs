import fs from 'fs-extra'
import {buildResolutionsFromLockFileObject, load} from 'yarn-lock-tool'
import * as fse from 'node:fs'
import {execSync} from "node:child_process";

//angular检测不到的依赖
let dependencies = []
let applications = ['shell', 'app-user']

let platform = getArg('platform')
let outDir, arch
if ('win64' === platform) {
  outDir = './out/win64'
  platform = 'win'
  arch = 'x64'
} else if ('osx64' === platform) {
  outDir = './out/osx64'
  platform = 'osx'
  arch = 'x64'
} else {
  console.error('platform不匹配!');
  process.exit(1);
}

// execSync('yarn --cwd ../ run build')

if (fs.pathExistsSync(outDir)) fs.removeSync(outDir)
if (fs.pathExistsSync('./temp')) fs.removeSync('./temp')
// fs.copySync('../dist/demo-nwjs5', './temp')
copyApplications()
copyDependencies()
fs.copySync('./package-prod.json', './temp/package.json')

//执行nwjs构建
// nwbuild({
//   srcDir: "./temp",
//   mode: "build", // "run" | "build"
//   version: "0.82.0",
//   flavor: "normal", // "normal" | "sdk"
//   platform: platform, // "linux" | "osx" | "win"
//   arch: arch, // "ia32" | "x64" | "arm64"
//   outDir: outDir,
//   cacheDir: "./cache",
//   downloadUrl: 'https://npmmirror.com/mirrors/nwjs',
//   glob: false,
//   logLevel: "debug",
// }).then(() => fs.removeSync('./temp'));

// -------------------------

function resolve(resolutions, dependencies) {
  let result = []
  for (let dept of dependencies) {
    let dep = resolutions[dept]
    if (!dep) continue
    result.push(dept)
    for (let depKey of Object.keys(dep)) {
      let depEle = dep[depKey]
      if (!depEle.dependencies) continue
      let children = resolve(resolutions, Object.keys(depEle.dependencies))
      if (children) children.forEach(s => result.push(s))
    }
  }
  return result
}

function resolveDependencies() {
  const workingContext = load('..')
  const resolutions = buildResolutionsFromLockFileObject(workingContext.firstLevelDependencies)
  return resolve(resolutions, dependencies)
}

function copyDependencies() {
  let deptList = resolveDependencies()
  if (!deptList || deptList.length === 0) return;
  for (let dept of deptList) {
    let filepath = `../node_modules/${dept}`;
    let exists = fse.existsSync(filepath)
    if (exists) fs.copySync(filepath, `./temp/node_modules/${dept}`)
  }
}

function getArg(key) {
  let args = process.argv
  let arg = args.filter(s => s.startsWith(`--${key}=`)).map(s => s.split(`--${key}=`)[1])
  if (arg && arg.length > 0) return arg[0]
  return undefined
}

function copyApplications() {
  // applications
  for (let app of applications) {
// execSync('yarn --cwd ../ run build')
// fs.copySync('../dist/demo-nwjs5', './temp')
    let buildCmd = `yarn --cwd ../ run build ${app}`
    execSync(buildCmd)
    let appDistPath = `../dist/${app}`;
    if (fse.existsSync(appDistPath)) {
      console.log(111)
    }
  }
}
