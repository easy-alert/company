import Dexie from 'dexie';

import type { LocalStorageData } from '../screens/Buildings/BuildingManageMaintenances';

class AutosaveDB extends Dexie {
  autosave: Dexie.Table<{ key: string; data: LocalStorageData }, string>;

  constructor() {
    super('AutosaveDB');
    this.version(1).stores({
      autosave: 'key',
    });
    this.autosave = this.table('autosave');
  }

  async save(key: string, data: LocalStorageData) {
    await this.autosave.put({ key, data });
  }

  async load(key: string) {
    const entry = await this.autosave.get(key);
    return entry?.data || null;
  }

  async remove(key: string) {
    await this.autosave.delete(key);
  }
}

export const autosaveDB = new AutosaveDB();
