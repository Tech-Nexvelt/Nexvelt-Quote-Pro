/**
 * Revision Engine for Nexvelt Quote Pro (10/10 Edition)
 * Manages quotation revisions (REV-01, REV-02, REV-03), snapshot historical data,
 * restoration logic, and side-by-side diff comparison between revisions.
 */

import { ProjectEntity, QuotationRevision } from '../../types/enterprise';

export interface RevisionDiffResult {
  oldRevisionCode: string;
  newRevisionCode: string;
  totalPriceDiff: number; // positive = increased, negative = decreased
  percentageChange: number;
  roomDiffs: {
    roomName: string;
    oldSubtotal: number;
    newSubtotal: number;
    diff: number;
  }[];
}

export function createRevisionSnapshot(
  project: ProjectEntity,
  notes: string = '',
  author: string = 'Workshop Admin'
): QuotationRevision {
  const currentCount = project.revisions ? project.revisions.length + 1 : 1;
  const revisionCode = `REV-${currentCount.toString().padStart(2, '0')}`;

  return {
    revisionCode,
    createdAt: new Date().toISOString(),
    notes: notes || `Revision snapshot ${revisionCode}`,
    author,
    snapshotData: {
      rooms: JSON.parse(JSON.stringify(project.rooms || [])),
      additionalCharges: { ...project.additionalCharges },
      discount: { ...project.discount },
      tax: { ...project.tax },
      grandTotal: project.grandTotal || 0,
    },
  };
}

export function compareRevisions(
  revOld: QuotationRevision,
  revNew: QuotationRevision
): RevisionDiffResult {
  const oldTotal = revOld.snapshotData.grandTotal || 0;
  const newTotal = revNew.snapshotData.grandTotal || 0;
  const totalPriceDiff = parseFloat((newTotal - oldTotal).toFixed(2));

  const percentageChange = oldTotal > 0 ? parseFloat(((totalPriceDiff / oldTotal) * 100).toFixed(1)) : 0;

  const oldRoomMap = new Map(revOld.snapshotData.rooms.map((r) => [r.name, r.summary.subtotal]));
  const newRoomMap = new Map(revNew.snapshotData.rooms.map((r) => [r.name, r.summary.subtotal]));

  const allRoomNames = Array.from(new Set([...oldRoomMap.keys(), ...newRoomMap.keys()]));

  const roomDiffs = allRoomNames.map((roomName) => {
    const oldSub = oldRoomMap.get(roomName) || 0;
    const newSub = newRoomMap.get(roomName) || 0;
    return {
      roomName,
      oldSubtotal: oldSub,
      newSubtotal: newSub,
      diff: parseFloat((newSub - oldSub).toFixed(2)),
    };
  });

  return {
    oldRevisionCode: revOld.revisionCode,
    newRevisionCode: revNew.revisionCode,
    totalPriceDiff,
    percentageChange,
    roomDiffs,
  };
}
