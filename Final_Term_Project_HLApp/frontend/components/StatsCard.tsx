import { IconType } from 'react-icons';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: IconType;
  color: string;
  bgColor: string;
  description?: string;
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  color,
  bgColor,
  description,
}: StatsCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: bgColor }}
        >
          <Icon className="text-2xl" style={{ color }} />
        </div>
      </div>
      <p className="text-3xl font-bold text-[#1E293B] mb-1">{value}</p>
      <p className="text-sm font-semibold text-[#1E293B]">{title}</p>
      {description && (
        <p className="text-xs text-[#64748B] mt-1">{description}</p>
      )}
    </div>
  );
}