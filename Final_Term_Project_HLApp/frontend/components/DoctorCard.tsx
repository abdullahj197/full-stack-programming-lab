import { FiPhone, FiMail, FiStar, FiClock } from 'react-icons/fi';

interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  qualification: string;
  experience: number;
  phone: string;
  email: string;
  fee: number;
  availableDays: string[];
  availableTime: string;
}

interface DoctorCardProps {
  doctor: Doctor;
  onEdit?: (doctor: Doctor) => void;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

export default function DoctorCard({
  doctor, onEdit, onDelete, showActions = true,
}: DoctorCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-14 h-14 bg-[#EFF6FF] rounded-2xl flex items-center justify-center flex-shrink-0">
          <span className="text-[#2563EB] font-bold text-xl">
            {doctor.name.charAt(0)}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-[#1E293B] truncate">{doctor.name}</h3>
          <p className="text-sm text-[#2563EB] font-medium">{doctor.specialization}</p>
          <p className="text-xs text-[#64748B]">{doctor.qualification}</p>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-[#64748B]">
          <FiStar className="text-[#F59E0B] flex-shrink-0" />
          <span>{doctor.experience} years experience</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-[#64748B]">
          <FiPhone className="flex-shrink-0" />
          <span className="truncate">{doctor.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-[#64748B]">
          <FiMail className="flex-shrink-0" />
          <span className="truncate">{doctor.email}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-[#64748B]">
          <FiClock className="flex-shrink-0" />
          <span>{doctor.availableTime || '9:00 AM - 5:00 PM'}</span>
        </div>
      </div>

      {/* Fee */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-[#64748B]">Consultation Fee</span>
        <span className="font-bold text-[#10B981]">Rs. {doctor.fee}</span>
      </div>

      {/* Available Days */}
      <div className="flex flex-wrap gap-1 mb-4">
        {doctor.availableDays?.map((day) => (
          <span
            key={day}
            className="text-xs bg-[#EFF6FF] text-[#2563EB] px-2 py-1 rounded-lg font-medium"
          >
            {day.slice(0, 3)}
          </span>
        ))}
      </div>

      {/* Actions */}
      {showActions && (
        <div className="flex gap-2">
          <button
            onClick={() => onEdit?.(doctor)}
            className="flex-1 py-2 text-sm font-semibold bg-[#EFF6FF] text-[#2563EB] rounded-xl hover:bg-[#2563EB] hover:text-white transition-all"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete?.(doctor._id)}
            className="flex-1 py-2 text-sm font-semibold bg-[#FEF2F2] text-[#EF4444] rounded-xl hover:bg-[#EF4444] hover:text-white transition-all"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}