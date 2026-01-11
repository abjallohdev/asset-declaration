import Dexie, { Table } from 'dexie';
import { DeclarationFormValues } from '@/components/forms/declaration-schema';

export interface Draft {
  id: string; // userId or unique draft ID
  data: DeclarationFormValues;
  lastUpdated: number;
}

export interface PendingSubmission {
  id?: number; // Auto-increment
  data: DeclarationFormValues;
  timestamp: number;
  synced: boolean;
}

export class AdsDatabase extends Dexie {
  drafts!: Table<Draft>;
  submissionQueue!: Table<PendingSubmission>;

  constructor() {
    super('ads_database');
    this.version(1).stores({
      drafts: 'id',
      submissionQueue: '++id, synced'
    });
  }
}

export const db = new AdsDatabase();
