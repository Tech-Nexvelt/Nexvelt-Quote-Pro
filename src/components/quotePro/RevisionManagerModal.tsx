import React, { useState } from 'react';
import { CommercialProject } from '@/types/project';
import { createRevisionSnapshot, compareRevisions, RevisionSnapshot } from '@/core/engines/summaryEngine';
import { History, GitCompare, RotateCcw } from 'lucide-react';

interface RevisionManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: CommercialProject;
  onSaveRevision: (snapshot: RevisionSnapshot) => void;
  onRestoreRevision: (snapshot: RevisionSnapshot) => void;
}

export const RevisionManagerModal: React.FC<RevisionManagerModalProps> = ({
  isOpen,
  onClose,
  project,
  onSaveRevision,
  onRestoreRevision,
}) => {
  const [revisionNotes, setRevisionNotes] = useState('');
  const [selectedRev1, setSelectedRev1] = useState<string>('');
  const [selectedRev2, setSelectedRev2] = useState<string>('');
  const [diffResult, setDiffResult] = useState<any>(null);

  if (!isOpen) return null;

  const handleCreateSnapshot = (e: React.FormEvent) => {
    e.preventDefault();
    const snapshot = createRevisionSnapshot(project, revisionNotes || 'Client design modification');
    onSaveRevision(snapshot);
    setRevisionNotes('');
  };

  const handleCompare = () => {
    const revs = project.revisions || [];
    const rev1 = revs.find((r: any) => r.revisionCode === selectedRev1);
    const rev2 = revs.find((r: any) => r.revisionCode === selectedRev2);
    if (rev1 && rev2) {
      setDiffResult(compareRevisions(rev1, rev2));
    }
  };

  const revisionsList = project.revisions || [];

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-[#E2E8F0] rounded-2xl max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl text-[#111827]">
        {/* Header */}
        <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-[#111827] flex items-center gap-2">
              <span>🔄 Quotation Revision History & Audit</span>
            </h2>
            <p className="text-xs font-semibold text-[#4B5563]">Snapshot versioning (REV-01, REV-02) and side-by-side diff comparison</p>
          </div>
          <button onClick={onClose} className="text-[#6B7280] hover:text-[#111827] text-lg font-bold">
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 overflow-y-auto space-y-6">
          {/* Create New Snapshot Section */}
          <form onSubmit={handleCreateSnapshot} className="bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0] flex items-end gap-3">
            <div className="flex-1">
              <label className="block text-xs font-bold text-[#111827] mb-1">
                Create Revision Snapshot Note:
              </label>
              <input
                type="text"
                placeholder="e.g. Changed shutter finish from Laminate to PU Paint upon customer request"
                value={revisionNotes}
                onChange={(e) => setRevisionNotes(e.target.value)}
                className="w-full bg-white border border-[#E2E8F0] text-xs text-[#111827] rounded-lg px-3 py-2 focus:outline-none focus:border-[#00D9D9] font-medium"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold bg-[#00D9D9] hover:bg-[#00B8B8] text-white rounded-lg transition whitespace-nowrap shadow-2xs"
            >
              + Save Snapshot
            </button>
          </form>

          {/* Revisions History List */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold text-[#111827] uppercase tracking-wider flex items-center gap-1.5">
              <History className="w-4 h-4 text-[#00B8B8]" /> Saved Revisions Log ({revisionsList.length})
            </h3>

            {revisionsList.length === 0 ? (
              <div className="text-center py-6 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] text-xs font-bold text-[#4B5563]">
                No previous snapshots stored. Click 'Save Snapshot' above to lock current state as REV-01.
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {revisionsList.map((rev: any) => (
                  <div
                    key={rev.id}
                    className="bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0] flex items-center justify-between text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#008080] bg-[#E6F7F7] px-2 py-0.5 rounded">
                          {rev.revisionCode}
                        </span>
                        <span className="font-bold text-[#111827]">{rev.changeDescription}</span>
                      </div>
                      <span className="text-[10px] text-[#4B5563] block">
                        Saved: {new Date(rev.createdAt).toLocaleString()} | Grand Total: ₹{rev.grandTotal.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onRestoreRevision(rev)}
                        className="px-3 py-1 text-xs font-bold bg-white border border-[#E2E8F0] hover:bg-[#F1F5F9] text-[#111827] rounded transition flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3 text-[#00B8B8]" /> Restore
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Compare Revisions Section */}
          {revisionsList.length >= 2 && (
            <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0] space-y-3">
              <h3 className="text-xs font-extrabold text-[#111827] uppercase tracking-wider flex items-center gap-1.5">
                <GitCompare className="w-4 h-4 text-[#00B8B8]" /> Compare Two Revisions (Delta Audit)
              </h3>

              <div className="flex items-center gap-3">
                <select
                  value={selectedRev1}
                  onChange={(e) => setSelectedRev1(e.target.value)}
                  className="bg-white border border-[#E2E8F0] text-xs text-[#111827] font-bold rounded-lg px-2.5 py-1.5"
                >
                  <option value="">Select Base Rev</option>
                  {revisionsList.map((r: any) => (
                    <option key={r.id} value={r.revisionCode}>
                      {r.revisionCode} - ₹{r.grandTotal}
                    </option>
                  ))}
                </select>

                <span className="text-xs text-[#4B5563] font-bold">vs</span>

                <select
                  value={selectedRev2}
                  onChange={(e) => setSelectedRev2(e.target.value)}
                  className="bg-white border border-[#E2E8F0] text-xs text-[#111827] font-bold rounded-lg px-2.5 py-1.5"
                >
                  <option value="">Select Target Rev</option>
                  {revisionsList.map((r: any) => (
                    <option key={r.id} value={r.revisionCode}>
                      {r.revisionCode} - ₹{r.grandTotal}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleCompare}
                  className="px-3 py-1.5 bg-[#00D9D9] hover:bg-[#00B8B8] text-white text-xs font-bold rounded-lg"
                >
                  Run Delta Audit
                </button>
              </div>

              {/* Diff Result Box */}
              {diffResult && (
                <div className="mt-3 p-3 bg-white rounded-lg border border-[#E2E8F0] space-y-2 text-xs">
                  <div className="flex items-center justify-between font-bold border-b border-[#E2E8F0] pb-2">
                    <span className="text-[#111827]">
                      {diffResult.rev1Code} &rarr; {diffResult.rev2Code}
                    </span>
                    <span className={`font-mono ${diffResult.grandTotalDiff >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                      Cost Variance: {diffResult.grandTotalDiff >= 0 ? '+' : ''}₹{diffResult.grandTotalDiff.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="text-[#4B5563] space-y-1">
                    <p>Total Items Changed: <span className="font-bold text-[#111827]">{diffResult.itemCountDiff}</span></p>
                    <p>Total Area Variance: <span className="font-bold text-[#111827]">{diffResult.areaDiffSqFt} Sq.ft</span></p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E2E8F0] flex items-center justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#111827] font-bold text-xs rounded-lg">
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
