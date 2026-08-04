import { NQPError } from './errors';

export interface VersionedRecord {
  id: string;
  version: number;
  updated_at?: string;
}

export const validateRecordVersion = <T extends VersionedRecord>(
  existingRecord: T | null,
  clientVersion: number
): void => {
  if (!existingRecord) return;
  if (existingRecord.version !== clientVersion) {
    throw new NQPError(
      'NQP-004',
      'This record has been updated by another user. Please reload the latest version before modifying.',
      {
        serverVersion: existingRecord.version,
        clientVersion,
        recordId: existingRecord.id,
      }
    );
  }
};
