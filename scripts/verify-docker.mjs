import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, writeFile, unlink, rmdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'node:net';
import { randomUUID } from 'node:crypto';

// Local validation only: unique Compose project, test database, ports and volumes.
// The ordinary .env is never loaded by Compose for this run.
const root = dirname(dirname(fileURLToPath(import.meta.url)));
const project = `youlearn-closing-${randomUUID().slice(0, 8)}`;
const temp = await mkdtemp(join(tmpdir(), 'youlearn-docker-test-'));
const envFile = join(temp, 'compose.env');
const freePort = () => new Promise((resolve, reject) => {
  const server = createServer();
  server.on('error', reject);
  server.listen(0, '127.0.0.1', () => {
    const port = server.address().port;
    server.close(error => error ? reject(error) : resolve(port));
  });
});
const apiPort = await freePort();
let mongoPort = await freePort();
while (mongoPort === apiPort) mongoPort = await freePort();
const settings = {
  JWT_SECRET: `docker-test-only-${randomUUID()}`,
  EMAIL_DRIVER: 'log', MONGO_DB_NAME: 'lms_closing_test',
  API_PORT: String(apiPort), MONGO_PORT: String(mongoPort),
  SMTP_HOST: '', SMTP_PORT: '587', SMTP_USER: '', SMTP_PASS: '', SMTP_FROM: '',
};
await writeFile(envFile, Object.entries(settings).map(([key, value]) => `${key}=${value}`).join('\n') + '\n');
const env = { ...process.env, ...settings };
const args = ['compose', '--project-name', project, '--env-file', envFile, '-f', join(root, 'docker-compose.yml')];
const run = (commandArgs, capture = false) => new Promise((resolve, reject) => {
  const child = spawn('docker', [...args, ...commandArgs], { cwd: root, env, stdio: capture ? ['ignore', 'pipe', 'pipe'] : 'inherit', windowsHide: true });
  let output = '', errors = '';
  if (capture) {
    child.stdout.on('data', data => { output += data; });
    child.stderr.on('data', data => { errors += data; });
  }
  child.on('error', reject);
  child.on('close', code => code === 0 ? resolve(output.trim()) : reject(new Error(`Docker verification failed (exit ${code}): ${errors}`)));
});
const probe = async () => {
  const response = await fetch(`http://127.0.0.1:${apiPort}/`);
  assert.equal(response.status, 200);
  assert.equal((await response.json()).success, true);
};
try {
  await run(['config', '--quiet']);
  await run(['up', '--build', '--wait', '--wait-timeout', '120']);
  await probe();
  const config = await run(['exec', '-T', 'api', 'node', '--input-type=module', '-e', `
    import assert from 'node:assert/strict'; import fs from 'node:fs';
    assert.equal(process.env.EMAIL_DRIVER, 'log');
    assert.equal(process.env.MONGO_URI, 'mongodb://mongodb:27017/lms_closing_test');
    for (const file of ['.env', 'init', '.vscode/tasks.json', 'src/services/email/templates/public/fonts/fa-brand-400.orc', 'docs/audit', 'module-test.json', 'resource-module2.json']) assert.equal(fs.existsSync(file), false, file);
    fs.writeFileSync('/app/uploads/closing-verification.txt', 'isolated test');
    console.log('image and environment checks passed');
  `], true);
  console.log(config);
  await run(['exec', '-T', 'api', 'node', '--input-type=module', '-e', `
    import mongoose from 'mongoose'; import assert from 'node:assert/strict';
    await mongoose.connect(process.env.MONGO_URI); assert.equal(mongoose.connection.name, 'lms_closing_test');
    await mongoose.connection.collection('closing_verification').insertOne({ key: 'persisted' });
    await mongoose.disconnect();
  `]);
  // Recreate containers while retaining only this test project's named volumes.
  await run(['up', '--force-recreate', '--wait', '--wait-timeout', '120']);
  await probe();
  await run(['exec', '-T', 'api', 'node', '--input-type=module', '-e', `
    import mongoose from 'mongoose'; import assert from 'node:assert/strict'; import fs from 'node:fs';
    assert.equal(fs.readFileSync('/app/uploads/closing-verification.txt', 'utf8'), 'isolated test');
    await mongoose.connect(process.env.MONGO_URI); assert.equal(mongoose.connection.name, 'lms_closing_test');
    assert.equal(await mongoose.connection.collection('closing_verification').countDocuments({ key: 'persisted' }), 1);
    await mongoose.disconnect();
  `]);
  console.log('PASS: API/MongoDB healthy; isolated DB; log driver; secrets/scratch excluded; MongoDB and uploads survive recreation.');
} finally {
  try { await run(['down', '--volumes', '--remove-orphans']); }
  finally { await unlink(envFile); await rmdir(temp); }
}
