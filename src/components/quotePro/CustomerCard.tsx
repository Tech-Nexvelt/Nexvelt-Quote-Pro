import React, { useState } from 'react';
import { useProjectStore } from '@/store/useProjectStore';
import { Card } from '@/components/ui/Card';
import { User, Edit3 } from 'lucide-react';

export const CustomerCard: React.FC = () => {
  const { project, updateCustomerDetails, updateProjectDetails } = useProjectStore();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Card className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#E0F7F7] text-[#00B8B8]">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-[20px] font-extrabold text-[#111827] leading-tight">
              Customer & Project Details
            </h2>
            <p className="text-[13px] text-[#6B7280] font-medium mt-0.5">
              Customer information and site location for this quotation.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="h-10 px-4 rounded-xl border border-[#E5E7EB] bg-white hover:bg-[#F8FAFC] text-[#111827] text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
        >
          <Edit3 className="w-4 h-4 text-[#6B7280]" />
          <span>{isEditing ? 'Save Details' : 'Edit Details'}</span>
        </button>
      </div>

      {/* 3 Column Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-3.5 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC]">
          <label className="text-[13px] font-medium text-[#6B7280] block mb-1.5">Customer Name</label>
          {isEditing ? (
            <input
              type="text"
              value={project.customer.name || ''}
              onChange={(e) => updateCustomerDetails({ name: e.target.value })}
              className="w-full h-11 text-base font-semibold text-[#111827] bg-white border border-[#E5E7EB] rounded-xl px-3 focus:outline-none focus:border-[#00D9D9]"
            />
          ) : (
            <div className="text-[16px] font-bold text-[#111827]">
              {project.customer.name || 'Not specified'}
            </div>
          )}
        </div>

        <div className="p-3.5 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC]">
          <label className="text-[13px] font-medium text-[#6B7280] block mb-1.5">Phone Number</label>
          {isEditing ? (
            <input
              type="text"
              value={project.customer.phone || ''}
              onChange={(e) => updateCustomerDetails({ phone: e.target.value })}
              className="w-full h-11 text-base font-semibold text-[#111827] bg-white border border-[#E5E7EB] rounded-xl px-3 focus:outline-none focus:border-[#00D9D9]"
            />
          ) : (
            <div className="text-[16px] font-bold text-[#111827]">
              {project.customer.phone || 'Not specified'}
            </div>
          )}
        </div>

        <div className="p-3.5 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC]">
          <label className="text-[13px] font-medium text-[#6B7280] block mb-1.5">Site Location / City</label>
          {isEditing ? (
            <input
              type="text"
              value={project.projectLocation || ''}
              onChange={(e) => {
                updateProjectDetails({ projectLocation: e.target.value });
                updateCustomerDetails({ projectLocation: e.target.value });
              }}
              className="w-full h-11 text-base font-semibold text-[#111827] bg-white border border-[#E5E7EB] rounded-xl px-3 focus:outline-none focus:border-[#00D9D9]"
            />
          ) : (
            <div className="text-[16px] font-bold text-[#111827]">
              {project.projectLocation || 'Not specified'}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
