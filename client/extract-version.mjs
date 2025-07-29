import fs from 'fs/promises';
import xml2js from 'xml2js';

const pomXmlPath = './pom.xml';
const packageJsonPath = './package.json';
const versionTsxPath = './version.tsx';

const parser = new xml2js.Parser();

// Read current version from pom.xml file
async function readPomXml() {
  try {
    const data = await fs.readFile(pomXmlPath);
    const result = await parser.parseStringPromise(data);
    const version = result.project.version[0];
    const marketingVersion = result.project.properties[0]["related.marketing.version"];
    console.log(`Extracted version from pom.xml: ${version}`);
    console.log(`Extracted marketingVersion from pom.xml: ${marketingVersion}`);
    return {
        version: version,
        marketingVersion: marketingVersion,
    }
  } catch (error) {
    console.error('Error reading or parsing pom.xml:', error);
    throw error;
  }
}


// Update package.json in two places:
// 1. In the version member at the top
// 2. In the deploy script for uploading to Artifactory
async function updatePackageJson(version) {
  try {
    const packageJsonData = await fs.readFile(packageJsonPath, 'utf-8');
    const packageJson = JSON.parse(packageJsonData);
    packageJson.version = version;

    // Updating the maven-deploy script in package.json
    const mavenDeployScript = packageJson.scripts['maven-deploy'];
    const updatedMavenDeployScript = mavenDeployScript.replace(
      /-Dversion=[^\s]+/g,
      `-Dversion=${version}`
    );
    packageJson.scripts['maven-deploy'] = updatedMavenDeployScript;

    await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('Updated package.json with the extracted version.');
  } catch (error) {
    console.error('Error updating package.json:', error);
    throw error;
  }
}

// Update version.tsx to be shown in the clients "About" modal
async function updateVersionTsx(version, marketingVersion) {
  try {
    const versionTsxData = await fs.readFile(versionTsxPath, 'utf-8');
    const updatedVersionTsxData = versionTsxData.replace(/VERSION = '.*'/, `VERSION = '${version}'`)
                                                .replace(/RELATED_MARKETING_VERSION = '.*./, `RELATED_MARKETING_VERSION = '${marketingVersion}'`);
    await fs.writeFile(versionTsxPath, updatedVersionTsxData);
    console.log('Updated version.tsx with the extracted version.');
  } catch (error) {
    console.error('Error updating version.tsx:', error);
    throw error;
  }
}


// Function Execution
(async () => {
  try {
    const {version, marketingVersion} = await readPomXml();
    await updatePackageJson(version);
    await updateVersionTsx(version, marketingVersion);
  } catch (error) {
    console.error('An error occurred:', error);
  }
})();
