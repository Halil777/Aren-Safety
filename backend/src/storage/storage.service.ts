import { Injectable } from '@nestjs/common';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { TenantRecord } from '../shared/types';

@Injectable()
export class StorageService {
  private readonly dataDir = join(process.cwd(), 'data');
  private readonly tenantsFile = join(this.dataDir, 'tenants.json');
  private collectionFile(tenantId: string, name: string) {
    const dir = join(this.dataDir, tenantId);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    return join(dir, `${name}.json`);
  }

  private ensureFiles() {
    if (!existsSync(this.dataDir)) mkdirSync(this.dataDir, { recursive: true });
    if (!existsSync(this.tenantsFile)) writeFileSync(this.tenantsFile, '[]', 'utf-8');
  }

  readTenants(): TenantRecord[] {
    this.ensureFiles();
    const raw = readFileSync(this.tenantsFile, 'utf-8');
    try {
      return JSON.parse(raw) as TenantRecord[];
    } catch {
      return [];
    }
  }

  writeTenants(tenants: TenantRecord[]): void {
    this.ensureFiles();
    writeFileSync(this.tenantsFile, JSON.stringify(tenants, null, 2), 'utf-8');
  }

  readCollection<T = any>(tenantId: string, name: string): T[] {
    const file = this.collectionFile(tenantId, name);
    if (!existsSync(file)) {
      writeFileSync(file, '[]', 'utf-8');
      return [];
    }
    const raw = readFileSync(file, 'utf-8');
    try {
      return JSON.parse(raw) as T[];
    } catch {
      return [];
    }
  }

  writeCollection<T = any>(tenantId: string, name: string, items: T[]): void {
    const file = this.collectionFile(tenantId, name);
    writeFileSync(file, JSON.stringify(items, null, 2), 'utf-8');
  }
}

export interface StoredCollection<T> {
  readCollection<T>(tenantId: string, name: string): T[];
  writeCollection<T>(tenantId: string, name: string, items: T[]): void;
}
