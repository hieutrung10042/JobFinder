import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { 
  Search, 
  Download, 
  Plus, 
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  CheckCircle2,
  Clock,
  XCircle
} from "lucide-react"

// 1. ĐÃ SỬA ĐƯỜNG DẪN: Lùi 2 cấp (../../) và viết chữ thường cho tên file
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Input } from "../../components/ui/input"
import { Checkbox } from "../../components/ui/checkbox"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../../components/ui/table"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "../../components/ui/dropdown-menu"
import { toast } from "sonner"

// Mock Data for Job Management
const jobsData = [
  {
    id: "JOB-4829",
    title: "Senior React Developer",
    company: "TechNova Inc.",
    location: "Remote (US)",
    category: "Engineering",
    salary: "$120,000 - $160,000",
    jobType: "Full-time",
    level: "Senior",
    status: "Approved",
  },
  {
    id: "JOB-4830",
    title: "Marketing Director",
    company: "BlueSky Corp",
    location: "New York, NY",
    category: "Marketing",
    salary: "$90,000 - $130,000",
    jobType: "Hybrid",
    level: "Director",
    status: "Pending",
  },
  {
    id: "JOB-4831",
    title: "Crypto Trader",
    company: "Unknown LLC",
    location: "Global Remote",
    category: "Finance",
    salary: "$500,000 - $1,000,000",
    jobType: "Contract",
    level: "Entry Level",
    status: "Rejected",
  },
  {
    id: "JOB-4832",
    title: "Product Designer",
    company: "CreativeFlow",
    location: "San Francisco, CA",
    category: "Design",
    salary: "$110,000 - $145,000",
    jobType: "Full-time",
    level: "Middle",
    status: "Approved",
  },
  {
    id: "JOB-4833",
    title: "Summer Intern - Data Science",
    company: "DataWorks",
    location: "Boston, MA",
    category: "Data",
    salary: "$3,000 - $4,500 /mo",
    jobType: "Part-time",
    level: "Intern",
    status: "Closed",
  },
  {
    id: "JOB-4834",
    title: "Frontend Engineer",
    company: "Startup XYZ",
    location: "Remote (EU)",
    category: "Engineering",
    salary: "$70,000 - $90,000",
    jobType: "Full-time",
    level: "Fresher",
    status: "Approved",
  },
]

// 2. ĐÃ SỬA TÊN FUNCTION: Đổi từ export function Jobs() thành JobManagement()
export function JobManagement() {
  const [selectedJobs, setSelectedJobs] = useState<string[]>([])
  const navigate = useNavigate()
  
  const toggleSelectAll = () => {
    if (selectedJobs.length === jobsData.length) {
      setSelectedJobs([])
    } else {
      setSelectedJobs(jobsData.map(job => job.id))
    }
  }

  const toggleSelectJob = (id: string) => {
    if (selectedJobs.includes(id)) {
      setSelectedJobs(selectedJobs.filter(jobId => jobId !== id))
    } else {
      setSelectedJobs([...selectedJobs, id])
    }
  }

  const handleDeleteSelected = () => {
    toast.success(`Deleted ${selectedJobs.length} selected jobs.`)
    setSelectedJobs([])
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return <Badge variant="success" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-200">Approved</Badge>
      case "Pending":
        return <Badge variant="warning" className="bg-amber-50 text-amber-700 hover:bg-amber-50 border-amber-200">Pending</Badge>
      case "Rejected":
        return <Badge variant="destructive" className="bg-rose-50 text-rose-700 hover:bg-rose-50 border-rose-200">Rejected</Badge>
      case "Closed":
        return <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-100 border-slate-200">Closed</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="min-h-full bg-[#F8FAFC] p-8 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header & Quick Stats */}
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Job Management</h1>
              <p className="text-slate-500 mt-1">Manage, moderate, and monitor all job postings across the platform.</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="border-slate-200 text-slate-700 bg-white">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm border-transparent">
                <Plus className="w-4 h-4 mr-2" />
                Add New Job
              </Button>
              <Button 
                onClick={() => navigate('/jobs')}
                variant="outline" 
                className="border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 font-medium transition-colors"
              >
                <Clock className="w-4 h-4 mr-2" />
                Moderation Queue
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: "Total Jobs", value: "1,248", icon: Briefcase, color: "text-indigo-600", bg: "bg-indigo-50" },
              { label: "Active", value: "982", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
              { label: "Pending Review", value: "12", icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
              { label: "Closed", value: "254", icon: XCircle, color: "text-slate-500", bg: "bg-slate-100" },
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.bg}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900 leading-none mb-1">{stat.value}</div>
                  <div className="text-sm font-medium text-slate-500">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Advanced Filter Bar */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[280px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input 
              className="pl-9 h-10 bg-slate-50 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-sm" 
              placeholder="Search by job title, company, or ID..." 
            />
          </div>
          
          <select className="h-10 px-3 py-2 bg-white border border-slate-200 rounded-md text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500">
            <option value="">Status: All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="closed">Closed</option>
          </select>
          
          <select className="h-10 px-3 py-2 bg-white border border-slate-200 rounded-md text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500">
            <option value="">Job Type: All</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
          </select>
          
          <select className="h-10 px-3 py-2 bg-white border border-slate-200 rounded-md text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500">
            <option value="">Experience: All</option>
            <option value="intern">Intern</option>
            <option value="fresher">Fresher</option>
            <option value="middle">Middle</option>
            <option value="senior">Senior</option>
          </select>
          
          <button className="text-sm font-medium text-slate-500 hover:text-slate-900 px-2 transition-colors">
            Clear Filters
          </button>
        </div>

        {/* Master Data Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50 border-b border-slate-200">
                <TableRow className="hover:bg-slate-50">
                  <TableHead className="w-12 px-6">
                    <Checkbox 
                      checked={selectedJobs.length === jobsData.length && jobsData.length > 0}
                      onCheckedChange={toggleSelectAll}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead className="font-semibold text-slate-600">Job Info</TableHead>
                  <TableHead className="font-semibold text-slate-600">Location & Category</TableHead>
                  <TableHead className="font-semibold text-slate-600">Salary Range</TableHead>
                  <TableHead className="font-semibold text-slate-600">Tags</TableHead>
                  <TableHead className="font-semibold text-slate-600">Status</TableHead>
                  <TableHead className="w-16 px-6 text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobsData.map((job) => (
                  <TableRow key={job.id} className="hover:bg-slate-50/50 transition-colors group">
                    <TableCell className="px-6 py-4">
                      <Checkbox 
                        checked={selectedJobs.includes(job.id)}
                        onCheckedChange={() => toggleSelectJob(job.id)}
                        aria-label={`Select ${job.id}`}
                      />
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {job.title}
                      </div>
                      <div className="text-sm text-slate-500 mt-0.5">
                        {job.company} <span className="text-slate-300 mx-1">•</span> {job.id}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="text-sm text-slate-700 font-medium">{job.location}</div>
                      <div className="text-sm text-slate-500 mt-0.5">{job.category}</div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="text-sm font-medium text-slate-700">{job.salary}</div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-50 font-normal">
                          {job.jobType}
                        </Badge>
                        <Badge variant="outline" className="bg-indigo-50 text-indigo-600 border-indigo-100 hover:bg-indigo-50 font-normal">
                          {job.level}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      {getStatusBadge(job.status)}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-slate-900">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px]">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit Job</DropdownMenuItem>
                          <DropdownMenuItem>Duplicate</DropdownMenuItem>
                          <div className="h-px bg-slate-100 my-1" />
                          <DropdownMenuItem className="text-rose-600 focus:text-rose-700 focus:bg-rose-50">
                            Delete Job
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {/* Table Footer */}
          <div className="bg-slate-50/50 border-t border-slate-200 px-6 py-4 flex items-center justify-between">
            <div className="flex-1">
              {selectedJobs.length > 0 ? (
                <div className="flex items-center gap-4 animate-in fade-in slide-in-from-bottom-2">
                  <span className="text-sm text-slate-600 font-medium">
                    {selectedJobs.length} selected
                  </span>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="h-8 bg-rose-100 text-rose-700 hover:bg-rose-200 border-transparent shadow-none"
                    onClick={handleDeleteSelected}
                  >
                    Delete Selected
                  </Button>
                </div>
              ) : (
                <div className="text-sm text-slate-500">
                  Select items to perform bulk actions
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-500">
                Showing 1 to 6 of 124
              </span>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-slate-200 bg-white" disabled>
                  <span className="sr-only">Previous page</span>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-slate-200 bg-white">
                  <span className="sr-only">Next page</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}