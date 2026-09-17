const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

// Execute the actual client service with an in-memory transport, never a network feed.
test('login service sends username and password', async () => {
  const source = fs.readFileSync(path.join(__dirname, '../../frontend/src/services/authService.ts'), 'utf8');
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  let request;
  const exports = {};
  vm.runInNewContext(js, { exports, require: () => ({ apiClient: {
    post: async (url, body) => { request = { url, body }; return { data: { token: 'fixture' } }; },
  } }) });
  assert.equal((await exports.authService.login('fixture-viewer', 'fixture-password')).token, 'fixture');
  assert.equal(request.url, '/auth/login');
  assert.equal(request.body.username, 'fixture-viewer');
  assert.equal(request.body.password, 'fixture-password');
  assert.equal('email' in request.body, false);
});

test('dashboard handler returns the UI contract from fixture model results', async (t) => {
  const { Threat } = require('../dist/models/Threat');
  const router = require('../dist/routes/analytics').default;
  const counts = [10, 2, 8, 4, 1];
  const rows = [
    [{ severity: 'high', count: '2' }],
    [{ country: 'Fixture', count: '2' }],
    [{ category: 'other', count: '2' }],
    [{ id: 1, sourceIp: '192.0.2.1', category: 'other', severity: 'high', source: 'fixture', createdAt: '2026-01-01T00:00:00Z' }],
    [],
  ];
  const countOptions = [];
  t.mock.method(Threat, 'count', async options => { countOptions.push(options); return counts.shift(); });
  t.mock.method(Threat, 'findAll', async () => rows.shift());
  const handler = router.stack.find(layer => layer.route?.path === '/dashboard').route.stack[0].handle;
  let body;
  await handler({}, { json: value => { body = value; } }, error => { throw error; });
  assert.deepEqual(body.overview, { totalThreats: 10, threatsLast30Days: 8, threatsLast7Days: 4, threatsToday: 1 });
  assert.deepEqual(body.charts.severityDistribution, { critical: 0, high: 2, medium: 0, low: 0 });
  assert.deepEqual(body.charts.categoryDistribution, { other: 2 });
  assert.equal(body.recentActivity[0].value, '192.0.2.1');
  assert.equal(body.recentActivity[0].id, '1');
  assert.equal(body.recentActivity[0].type, 'ip');
  assert.equal(countOptions.length, 5);
  assert.equal(rows.length, 0);
});
