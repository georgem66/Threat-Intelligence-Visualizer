const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');

// Static policy guards. These do not replace controller/database integration tests.
const source = (path) => readFileSync(join(__dirname, '../src', path), 'utf8');

test('public registration assigns viewer on the server', () => {
  const controller = source('controllers/authController.ts');
  const registration = controller.slice(controller.indexOf('async register('), controller.indexOf('async login('));
  assert.match(registration, /const \{ username, email, password \} = req\.body;/);
  assert.match(registration, /User\.create\(\{[\s\S]*?role: 'viewer',/);
});

test('registration validation permits only the public viewer role', () => {
  const validation = source('middleware/validation.ts');
  const registration = validation.slice(validation.indexOf('register: ['), validation.indexOf('login: ['));
  assert.match(registration, /body\('role'\)[\s\S]*?\.optional\(\)[\s\S]*?\.isIn\(\['viewer'\]\)/);
});
