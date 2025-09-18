const {spawn} = require('node:child_process');
const fs = require('node:fs');
const path = '';// 'C:\\pj\\gen-react-native\\';
// const path = '';
const keystore = {
    file: process.env['KEYSTORE_FILE'],//'gen-react-native.keystore',
    keyAlias: process.env['KEYSTORE_ALIAS'],//'my-key-alias',
    password: process.env['KEYSTORE_PASS'],
    keyPassword: process.env['KEYSTORE_KEY_PASS']
};
const appBuildGradle = 'android/app/build.gradle';

const prebuild = spawn('expo', [' prebuild --platform android --clean'], {
    stdio: 'inherit',
    shell: true
});

prebuild.on('exit', () => {
    console.info('ADD KEYSTORE');
    fs.copyFileSync(path + keystore.file, path + 'android/app/' + keystore.file)

    console.info('ADD DEFAULT LOCALE');
    fs.copyFileSync(path + 'android/app/src/main/res/values-b+en/strings.xml', path + 'android/app/src/main/res/values/strings.xml');

    console.info('UPDATE GRADLE VARIABLES');
    const content = `
MYAPP_UPLOAD_STORE_FILE=${keystore.file}
MYAPP_UPLOAD_KEY_ALIAS=${keystore.keyAlias}
MYAPP_UPLOAD_STORE_PASSWORD=${keystore.password}
MYAPP_UPLOAD_KEY_PASSWORD=${keystore.keyPassword}
`;
    const dotGradle = 'android/.gradle';
    if (!fs.existsSync(dotGradle)) {
        fs.mkdirSync(dotGradle);
    }
    fs.writeFileSync(path + dotGradle + '/gradle.properties', content);
    fs.appendFileSync(path + 'android/gradle.properties', content);

    console.info('ADD SIGNING CONFIG TO BUILD.GRADLE');
    const buildGradle = fs.readFileSync(path + appBuildGradle, 'utf8');
    const lines = buildGradle.split('\n');
    const newBuildGradle = [];
    let signingConfigs = false;
    let signingConfigsDebug = false;
    let buildTypes = false;
    let buildTypesRelease = false;
    lines.forEach((line) => {
        newBuildGradle.push(line);
        if (line.includes('signingConfigs')) signingConfigs = true;
        if (!buildTypes && signingConfigs && line.includes('debug')) signingConfigsDebug = true;
        if (signingConfigsDebug && line.includes('}')) {
            newBuildGradle.push('        release {');
            newBuildGradle.push("            if (project.hasProperty('MYAPP_UPLOAD_STORE_FILE')) {");
            newBuildGradle.push('                storeFile file(MYAPP_UPLOAD_STORE_FILE)');
            newBuildGradle.push('                storePassword MYAPP_UPLOAD_STORE_PASSWORD');
            newBuildGradle.push('                keyAlias MYAPP_UPLOAD_KEY_ALIAS');
            newBuildGradle.push('                keyPassword MYAPP_UPLOAD_KEY_PASSWORD');
            newBuildGradle.push('            }');
            newBuildGradle.push('        }');
            signingConfigs = false;
            signingConfigsDebug = false;
        }
        if (line.includes('buildTypes')) buildTypes = true;
        if (buildTypes && line.includes('release')) buildTypesRelease = true;
        if (buildTypesRelease && line.includes('signingConfig signingConfigs.debug')) {
            newBuildGradle.pop();
            newBuildGradle.push('            signingConfig signingConfigs.release');
            buildTypes = false;
            buildTypesRelease = false;
        }
    });
    const newBuildGradleText = newBuildGradle.join('\n');
    fs.writeFileSync(path + appBuildGradle, newBuildGradleText);

});