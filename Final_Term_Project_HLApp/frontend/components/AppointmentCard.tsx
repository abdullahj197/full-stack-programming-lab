import { FiCalendar, FiClock, FiUser, FiFileText } from 'react-icons/fi';

interface Appointment {
  _id: string;
  patient?: { name: string; email: string; phone: string };
  doctor?: { name: string; specialization: string };
  appointmentDate: string;
  timeSlot: string;
  reason: string;
  status: string;
  treatmentStatus?: string;
  notes?: string;
}

interface AppointmentCardProps {
  appointment: Appointment;
  onStatusChange?: (id: string, status: string) => void;
  onDelete?: (id: string) => void;
  userRole?: string;
}

const getBadgeClass = (status: string) => {
  switch (status) {
    case 'confirmed': return 'badge-confirmed';
    case 'rejected': return 'badge-rejected';
    case 'completed': return 'badge-completed';
    case 'follow-up': return 'badge-followup';
    default: return 'badge-pending';
  }
};

export default function AppointmentCard({
  appointment, onStatusChange, onDelete, userRole,
}: AppointmentCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-sm hover:shadow-md transition-all">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#EFF6FF] rounded-xl flex items-center justify-center">
            <FiCalendar className="text-[#2563EB]" />
          </div>
          <div>
            <p className="font-semibold text-[#1E293B] text-sm">
              {appointment.doctor?.name || 'Doctor Not Assigned'}
            </p>
            <p className="text-xs text-[#64748B]">
              {appointment.doctor?.specialization || ''}
            </p>
          </div>
        </div>
        <span className={getBadgeClass(appointment.status)}>
          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
        </span>
      </div>

      {/* Details */}
      <div className="space-y-2 mb-4">
        {appointment.patient && (
          <div className="flex items-center gap-2 text-sm text-[#64748B]">
            <FiUser className="flex-shrink-0" />
            <span>{appointment.patient.name}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-[#64748B]">
          <FiCalendar className="flex-shrink-0" />
          <span>{new Date(appointment.appointmentDate).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-[#64748B]">
          <FiClock className="flex-shrink-0" />
          <span>{appointment.timeSlot}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-[#64748B]">
          <FiFileText className="flex-shrink-0" />
          <span className="truncate">{appointment.reason}</span>
        </div>
      </div>

      {/* Treatment Status */}
      {appointment.treatmentStatus && (
        <div className="mb-4 px-3 py-2 bg-[#F8FAFC] rounded-xl">
          <p className="text-xs text-[#64748B]">Treatment Status</p>
          <p className="text-sm font-semibold text-[#1E293B]">
            {appointment.treatmentStatus}
          </p>
        </div>
      )}

      {/* Admin/Doctor Actions */}
      {(userRole === 'admin' || userRole === 'doctor') &&
        appointment.status === 'pending' && (
          <div className="flex gap-2">
            <button
              onClick={() => onStatusChange?.(appointment._id, 'confirmed')}
              className="flex-1 py-2 text-sm font-semibold bg-[#F0FDF4] text-[#16A34A] rounded-xl hover:bg-[#16A34A] hover:text-white transition-all"
            >
              Confirm
            </button>
            <button
              onClick={() => onStatusChange?.(appointment._id, 'rejected')}
              className="flex-1 py-2 text-sm font-semibold bg-[#FEF2F2] text-[#EF4444] rounded-xl hover:bg-[#EF4444] hover:text-white transition-all"
            >
              Reject
            </button>
          </div>
        )}

      {/* Delete for admin */}
      {userRole === 'admin' && (
        <button
          onClick={() => onDelete?.(appointment._id)}
          className="w-full mt-2 py-2 text-sm font-semibold bg-[#F8FAFC] text-[#64748B] rounded-xl hover:bg-[#FEF2F2] hover:text-[#EF4444] transition-all"
        >
          Delete
        </button>
      )}
    </div>
  );
}