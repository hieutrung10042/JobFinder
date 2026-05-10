import React, { useState } from 'react';
import { 
  Edit2, 
  Ban, 
  MoreHorizontal, 
  Search, 
  Filter, 
  Download,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  UserCircle2
} from 'lucide-react';

const ACCOUNT_DATA = [
  { 
    id: 'USR-01', 
    name: 'Nguyen Van A', 
    email: 'nva@gmail.com', 
    role: 'Candidate', 
    joinDate: 'Oct 12, 2024', 
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=150&h=150'
  },
  { 
    id: 'USR-02', 
    name: 'TechCorp Inc.', 
    email: 'hr@techcorp.com', 
    role: 'Company', 
    joinDate: 'Oct 11, 2024', 
    status: 'Suspended',
    avatar: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=150&h=150'
  },
  { 
    id: 'USR-03', 
    name: 'Le Thi B', 
    email: 'ltb@gmail.com', 
    role: 'Candidate', 
    joinDate: 'Oct 10, 2024', 
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150'
  },
  { 
    id: 'USR-04', 
    name: 'Global Ventures', 
    email: 'contact@globalv.com', 
    role: 'Company', 
    joinDate: 'Oct 09, 2024', 
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=150&h=150'
  },
];

export const AccountManagementTable = () => {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const toggleRow = (id: string) => {
    setSelectedRows(prev => 
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedRows.length === ACCOUNT_DATA.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(ACCOUNT_DATA.map(acc => acc.id));
    }
  };

  return (
    <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden mb-8">
      
      <div className="p-8 pb-6 border-b border-gray-50 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h3 className="text-2xl font-black text-gray-900 tracking-tight">Accounts</h3>
          <p className="text-sm text-gray-500 font-medium mt-1">Manage 2,405 active candidates and companies</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search users..." 
              className="pl-11 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-full sm:w-64 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-bold rounded-xl transition-colors">
            <Filter className="w-4 h-4" /> Filters
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-200 transition-all">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white text-gray-400 text-[11px] uppercase tracking-[0.2em] border-b border-gray-50">
              <th className="px-8 py-5 w-12">
                <input 
                  type="checkbox" 
                  checked={selectedRows.length === ACCOUNT_DATA.length && ACCOUNT_DATA.length > 0}
                  onChange={toggleAll}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500/30 cursor-pointer transition-all"
                />
              </th>
              <th className="px-6 py-5 font-black">User Details</th>
              <th className="px-6 py-5 font-black">Account Role</th>
              <th className="px-6 py-5 font-black">Joined Date</th>
              <th className="px-6 py-5 font-black">Status</th>
              <th className="px-8 py-5 font-black text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {ACCOUNT_DATA.map((acc) => {
              const isSelected = selectedRows.includes(acc.id);
              return (
                <tr 
                  key={acc.id} 
                  className={`group transition-all duration-200 hover:bg-blue-50/30 ${isSelected ? 'bg-blue-50/50' : 'bg-white'}`}
                >
                  <td className="px-8 py-4">
                    <input 
                      type="checkbox" 
                      checked={isSelected}
                      onChange={() => toggleRow(acc.id)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500/30 cursor-pointer transition-all"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                        <img src={acc.avatar} alt={acc.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-sm">{acc.name}</div>
                        <div className="text-[13px] font-medium text-gray-500">{acc.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {acc.role === 'Company' ? (
                        <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                          <ShieldAlert className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                          <UserCircle2 className="w-3.5 h-3.5" />
                        </div>
                      )}
                      <span className={`text-sm font-bold ${acc.role === 'Company' ? 'text-purple-900' : 'text-gray-700'}`}>
                        {acc.role}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600 font-medium">{acc.joinDate}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold ${
                      acc.status === 'Active' 
                      ? 'bg-green-50 text-green-700' 
                      : 'bg-red-50 text-red-700'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${acc.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      {acc.status}
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                      <button className="p-2.5 text-gray-500 hover:text-blue-600 hover:bg-blue-100 rounded-xl transition-all" title="Edit Profile">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2.5 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-xl transition-all" title="Suspend Account">
                        <Ban className="w-4 h-4" />
                      </button>
                      <button className="p-2.5 text-gray-500 hover:bg-gray-100 rounded-xl transition-all">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="p-6 border-t border-gray-50 flex items-center justify-between bg-gray-50/50">
        <span className="text-sm font-medium text-gray-500">
          Showing <span className="font-bold text-gray-900">1</span> to <span className="font-bold text-gray-900">4</span> of <span className="font-bold text-gray-900">2,405</span> results
        </span>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-xl border border-gray-200 text-gray-400 hover:text-gray-700 hover:bg-white bg-transparent transition-all disabled:opacity-50" disabled>
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-md shadow-blue-200 flex items-center justify-center">1</button>
            <button className="w-8 h-8 rounded-xl text-gray-600 font-bold text-sm hover:bg-gray-200 flex items-center justify-center transition-colors">2</button>
            <button className="w-8 h-8 rounded-xl text-gray-600 font-bold text-sm hover:bg-gray-200 flex items-center justify-center transition-colors">3</button>
            <span className="text-gray-400 font-medium px-1">...</span>
          </div>
          <button className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-white bg-transparent transition-all">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};