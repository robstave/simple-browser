import fs from 'fs';
import path from 'path';
import os from 'os';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';

import {
  validatePath,
  validatePathExists,
  validateIsDirectory,
  validateIsFile,
  validateImageExtension,
} from '../src/utils/path-validator';

let tmpRoot = '';
let tmpDir = '';
let tmpFile = '';

beforeAll(() => {
  // Create a temporary directory structure for tests
  tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'sb-root-'));
  tmpDir = path.join(tmpRoot, 'subdir');
  tmpFile = path.join(tmpRoot, 'file.txt');
  fs.mkdirSync(tmpDir);
  fs.writeFileSync(tmpFile, 'hello');
});

afterAll(() => {
  try {
    fs.unlinkSync(tmpFile);
    fs.rmdirSync(tmpDir);
    fs.rmdirSync(tmpRoot);
  } catch {
    // ignore cleanup errors
  }
});

describe('path-validator', () => {
  it('resolves a relative path within the root', () => {
    const resolved = validatePath(tmpRoot, 'subdir');
    expect(resolved).toBe(path.resolve(tmpRoot, 'subdir'));
  });

  it('returns root for empty or "/" requestedPath', () => {
    expect(validatePath(tmpRoot, '')).toBe(path.resolve(tmpRoot));
    expect(validatePath(tmpRoot, '/')).toBe(path.resolve(tmpRoot));
    expect(validatePath(tmpRoot, '.')).toBe(path.resolve(tmpRoot));
  });

  it('throws on directory traversal attempts', () => {
    // Attempt to escape root
    expect(() => validatePath(tmpRoot, '../etc/passwd')).toThrow();
    expect(() => validatePath(tmpRoot, '/etc/passwd')).toThrow();
  });

  it('validatePathExists and type checks', async () => {
    await expect(validatePathExists(tmpRoot)).resolves.toBeUndefined();
    await expect(validateIsDirectory(tmpDir)).resolves.toBeTruthy();
    await expect(validateIsFile(tmpFile)).resolves.toBeTruthy();
  });

  it('validates image extensions', () => {
    expect(validateImageExtension('photo.JPG', ['.jpg', '.png'])).toBeTruthy();
    expect(() => validateImageExtension('document.pdf', ['.jpg', '.png'])).toThrow();
  });
});
