import { describe, it, expect, beforeAll } from 'vitest';
import { DirectoryService } from '../src/services/directory-service';
import path from 'path';
import fs from 'fs';
import os from 'os';

let tmpRoot = '';
let service: DirectoryService;

beforeAll(() => {
  // Create temp directory structure for testing
  tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'sb-dir-test-'));
  
  // Create test structure:
  // tmpRoot/
  //   dir1/
  //     subdir1/
  //   dir2/
  fs.mkdirSync(path.join(tmpRoot, 'dir1'));
  fs.mkdirSync(path.join(tmpRoot, 'dir1', 'subdir1'));
  fs.mkdirSync(path.join(tmpRoot, 'dir2'));
  fs.writeFileSync(path.join(tmpRoot, 'file.txt'), 'test');
  
  service = new DirectoryService(tmpRoot);
});

describe('DirectoryService', () => {
  it('lists directories at root', async () => {
    const dirs = await service.listDirectories('');
    
    expect(dirs).toHaveLength(2);
    expect(dirs[0].name).toBe('dir1');
    expect(dirs[1].name).toBe('dir2');
    expect(dirs[0].isDirectory).toBe(true);
  });

  it('lists subdirectories', async () => {
    const dirs = await service.listDirectories('dir1');
    
    expect(dirs).toHaveLength(1);
    expect(dirs[0].name).toBe('subdir1');
    expect(dirs[0].path).toBe('dir1/subdir1');
  });

  it('does not list files', async () => {
    const dirs = await service.listDirectories('');
    
    // Should not include file.txt
    expect(dirs.every(d => d.name !== 'file.txt')).toBe(true);
  });

  it('throws on invalid path', async () => {
    await expect(service.listDirectories('../etc')).rejects.toThrow();
  });

  it('throws on non-existent directory', async () => {
    await expect(service.listDirectories('nonexistent')).rejects.toThrow();
  });

  it('gets directory with children', async () => {
    const dir = await service.getDirectoryWithChildren('');
    
    expect(dir.name).toBe(path.basename(tmpRoot));
    expect(dir.children).toHaveLength(2);
    expect(dir.children?.[0].name).toBe('dir1');
  });

  it('checks directory exists', async () => {
    expect(await service.directoryExists('dir1')).toBe(true);
    expect(await service.directoryExists('nonexistent')).toBe(false);
  });
});
