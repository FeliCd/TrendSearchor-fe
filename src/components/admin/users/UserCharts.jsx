import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { ROLES, ROLE_LABELS } from '@/constants/roles';
import { Users, TrendingUp } from 'lucide-react';

const COLORS = ['#0058be', '#009668', '#f59e0b', '#8b5cf6', '#64748b', '#ef4444'];

export default function UserCharts({ users = [] }) {
  const roleData = useMemo(() => {
    const counts = {};
    users.forEach(u => {
      counts[u.role] = (counts[u.role] || 0) + 1;
    });
    return Object.entries(counts).map(([role, count]) => ({
      name: ROLE_LABELS[role] || role,
      value: count,
    })).sort((a, b) => b.value - a.value);
  }, [users]);

  const registrationData = useMemo(() => {
    const dataMap = {};
    users.forEach(u => {
      if (!u.createdAt) return;
      const date = new Date(u.createdAt);
      if (isNaN(date.getTime())) return;
      
      const monthYear = date.toLocaleString('en-US', { month: 'short', year: 'numeric' });
      
      if (!dataMap[monthYear]) {
        dataMap[monthYear] = {
          name: monthYear,
          timestamp: new Date(date.getFullYear(), date.getMonth(), 1).getTime(),
          [ROLES.LECTURER]: 0,
          [ROLES.RESEARCHER]: 0,
          [ROLES.USER]: 0,
          [ROLES.ADMIN]: 0
        };
      }
      dataMap[monthYear][u.role] = (dataMap[monthYear][u.role] || 0) + 1;
    });
    return Object.values(dataMap).sort((a, b) => a.timestamp - b.timestamp);
  }, [users]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-5 mb-5">
      {/* Role Distribution Chart */}
      <motion.div 
        initial={{ opacity: 0, y: 16 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.4 }}
        className="bg-white/60 backdrop-blur-xl border border-[#c6c6cd]/40 rounded-2xl p-5 shadow-sm lg:col-span-3"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-[#0b1c30] font-bold text-base">Role Distribution</h3>
            <p className="text-xs text-[#76777d] mt-0.5">User breakdown by role</p>
          </div>
        </div>
        <div className="h-[180px] w-full">
          {roleData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roleData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {roleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: '1px solid rgba(198, 198, 205, 0.4)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', padding: '12px' }}
                  itemStyle={{ color: '#0b1c30', fontWeight: 'bold' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-[#76777d]">No data available</div>
          )}
        </div>
        <div className="flex flex-wrap justify-center gap-4 mt-2">
          {roleData.map((entry, index) => (
            <div key={entry.name} className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
              <span className="text-xs text-[#76777d] font-medium">{entry.name} ({entry.value})</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Registration Trends Chart */}
      <motion.div 
        initial={{ opacity: 0, y: 16 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-white/60 backdrop-blur-xl border border-[#c6c6cd]/40 rounded-2xl p-5 shadow-sm lg:col-span-7"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-[#0b1c30] font-bold text-base">New Registrations</h3>
            <p className="text-xs text-[#76777d] mt-0.5">Account growth by role over time</p>
          </div>
        </div>
        <div className="h-[180px] w-full">
          {registrationData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={registrationData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#c6c6cd" strokeOpacity={0.4} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#76777d' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#76777d' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: '1px solid rgba(198, 198, 205, 0.4)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ color: '#0b1c30', fontWeight: 'bold', marginBottom: '8px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey={ROLES.LECTURER} name="Student / Lecturer" stroke="#009668" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey={ROLES.RESEARCHER} name="Researcher" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey={ROLES.USER} name="User" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey={ROLES.ADMIN} name="Admin" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-[#76777d]">No registration data available</div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
