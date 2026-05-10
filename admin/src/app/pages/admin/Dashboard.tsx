import { Users, BriefcaseBusiness, AlertCircle, Building2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

const trendsData = [
  { name: "Mon", postings: 120 },
  { name: "Tue", postings: 150 },
  { name: "Wed", postings: 180 },
  { name: "Thu", postings: 140 },
  { name: "Fri", postings: 210 },
  { name: "Sat", postings: 90 },
  { name: "Sun", postings: 110 },
]

const categoryData = [
  { name: "Engineering", value: 400, color: "#4F46E5" }, // Indigo 600
  { name: "Design", value: 300, color: "#0F172A" }, // Slate 900
  { name: "Marketing", value: 300, color: "#10B981" }, // Emerald 500
  { name: "Sales", value: 200, color: "#3B82F6" }, // Blue 500
]

export function Dashboard() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 mt-1">System health and high-level metrics.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Candidates</CardTitle>
            <Users className="w-4 h-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">45,231</div>
            <p className="text-xs text-emerald-600 mt-1 flex items-center font-medium">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Verified Companies</CardTitle>
            <Building2 className="w-4 h-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">2,845</div>
            <p className="text-xs text-emerald-600 mt-1 flex items-center font-medium">
              +4% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Pending Jobs</CardTitle>
            <BriefcaseBusiness className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">142</div>
            <p className="text-xs text-slate-500 mt-1 flex items-center">
              Requires moderation
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Active Reports</CardTitle>
            <AlertCircle className="w-4 h-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">28</div>
            <p className="text-xs text-rose-600 mt-1 flex items-center font-medium">
              Needs immediate action
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Job Posting Trends</CardTitle>
          </CardHeader>
          <CardContent className="pl-0 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} dx={-10} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="postings" stroke="#4F46E5" strokeWidth={3} dot={{ r: 4, fill: '#4F46E5', strokeWidth: 0 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Job Categories</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex flex-col justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip 
                   contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-4 mt-2">
              {categoryData.map((category) => (
                <div key={category.name} className="flex items-center text-sm text-slate-600">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: category.color }} />
                  {category.name}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
