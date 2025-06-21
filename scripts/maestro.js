const { spawn } = require('node:child_process');

const env = ['MAESTRO_EMAIL', 'MAESTRO_PASS'];

function getArgs(keys) {
    const args = ['test', '.maestro/flow.yml']; // Base arguments

    keys.forEach(key => {
        if (process.env[key] !== undefined) {
            args.push('-e');
            args.push(`${key}="${process.env[key]}"`);
        }
    });
    return args;
}

spawn('maestro', getArgs(env), {
    stdio: 'inherit',
    shell: true
});