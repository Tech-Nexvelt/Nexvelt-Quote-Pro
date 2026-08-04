import React, { useState } from 'react';
import { Users, UserPlus, Mail, Shield, CheckCircle2, Clock } from 'lucide-react';
import { useCompanyContext } from '../../../contexts/CompanyContext';
import { AuthService } from '../../../services/auth.service';
import { StaffInvitation } from '../../../types/saas';

export const TeamManagementModule: React.FC = () => {
  const { companyId } = useCompanyContext();
  const [invitations, setInvitations] = useState<StaffInvitation[]>([]);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'Manager' | 'Sales' | 'Staff' | 'Viewer'>('Staff');
  const [inviting, setInviting] = useState(false);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !companyId) return;
    setInviting(true);
    try {
      const newInv = await AuthService.inviteStaff(companyId, email, role);
      setInvitations([newInv, ...invitations]);
      setEmail('');
    } catch {
      // Fallback
    } finally {
      setInviting(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-[#00B8B8]" /> Team & Staff Management
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Invite team members, assign permissions, and manage company access
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-[#00B8B8]" /> Invite New Member
          </h2>
          <form onSubmit={handleInvite} className="space-y-3.5">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
              <input
                type="email"
                required
                placeholder="colleague@firm.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-[#00D9D9] outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Role Assignment</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-[#00D9D9] outline-none"
              >
                <option value="Manager">Manager</option>
                <option value="Sales">Sales Representative</option>
                <option value="Staff">Designer / Staff</option>
                <option value="Viewer">Viewer (Read-Only)</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={inviting}
              className="w-full py-2.5 rounded-xl bg-[#00D9D9] hover:bg-[#00B8B8] text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4" /> Send Email Invitation
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-500" /> Pending & Active Invitations
          </h2>
          {invitations.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs font-medium border border-dashed border-slate-200 rounded-xl">
              No pending staff invitations. Invite your team members on the left!
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {invitations.map((inv) => (
                <div key={inv.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs">
                      {inv.email[0].toUpperCase()}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">{inv.email}</span>
                      <span className="text-[10px] text-slate-500 font-medium">Role: {inv.role}</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 text-[10px] font-black border border-amber-200 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Pending
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
