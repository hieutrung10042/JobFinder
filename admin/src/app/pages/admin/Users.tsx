import { useState } from "react"
import { Search, MoreHorizontal, Shield, User, Building2, Ban, RefreshCw, Eye } from "lucide-react"
import { Card } from "../../components/ui/Card"
import { Input } from "../../components/ui/Input"
import { Button } from "../../components/ui/Button"
import { Badge } from "../../components/ui/Badge"
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/Tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/Table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../components/ui/Dialog"

const usersMock = [
  { id: "1", name: "Alex Mercer", email: "alex@example.com", role: "Candidate", status: "Active", joined: "2024-01-15" },
  { id: "2", name: "TechNova Inc.", email: "hr@technova.com", role: "Employer", status: "Active", joined: "2024-02-10", is_verified: true },
  { id: "3", name: "Sarah Connor", email: "sarah@example.com", role: "Admin", status: "Active", joined: "2023-11-05" },
  { id: "4", name: "Spammy Recruiter", email: "jobs@spam.com", role: "Employer", status: "Banned", joined: "2024-03-22", is_verified: false },
  { id: "5", name: "David Kim", email: "david@example.com", role: "Candidate", status: "Active", joined: "2024-04-01" },
  { id: "6", name: "BlueSky Corp", email: "careers@bluesky.com", role: "Employer", status: "Pending Verification", joined: "2024-05-12", is_verified: false },
]

export function Users() {
  const [filter, setFilter] = useState("all")
  const [suspendModalOpen, setSuspendModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)

  const filteredUsers = usersMock.filter(u => {
    if (filter === "all") return true
    if (filter === "employers") return u.role === "Employer"
    if (filter === "candidates") return u.role === "Candidate"
    if (filter === "banned") return u.status === "Banned"
    if (filter === "pending") return u.status === "Pending Verification"
    return true
  })

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">User & Company Management</h1>
          <p className="text-slate-500 mt-1">Manage accounts, verify companies, and handle suspensions.</p>
        </div>
        <Button>Export CSV</Button>
      </div>

      <Card>
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Tabs defaultValue="all" onValueChange={setFilter}>
            <TabsList>
              <TabsTrigger value="all">All Accounts</TabsTrigger>
              <TabsTrigger value="employers">Employers</TabsTrigger>
              <TabsTrigger value="candidates">Candidates</TabsTrigger>
              <TabsTrigger value="pending">Pending Verification</TabsTrigger>
              <TabsTrigger value="banned">Banned</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input className="pl-9" placeholder="Search name or email..." />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User / Company</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-500">
                      {user.role === "Employer" ? <Building2 className="w-4 h-4" /> : 
                       user.role === "Admin" ? <Shield className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 flex items-center gap-2">
                        {user.name}
                        {user.role === "Employer" && user.is_verified && (
                          <Badge variant="success" className="h-4 px-1 text-[10px]">Verified</Badge>
                        )}
                      </p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{user.role}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={
                    user.status === "Active" ? "success" : 
                    user.status === "Banned" ? "destructive" : 
                    "warning"
                  }>
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-slate-500">{user.joined}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {user.role === "Employer" && user.status === "Pending Verification" && (
                      <Button variant="outline" size="sm" className="h-8 border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                        Verify
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500" title="View details">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50" 
                      title={user.status === "Banned" ? "Unban User" : "Suspend User"}
                      onClick={() => {
                        setSelectedUser(user)
                        setSuspendModalOpen(true)
                      }}
                    >
                      <Ban className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={suspendModalOpen} onOpenChange={setSuspendModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Account Suspension</DialogTitle>
            <DialogDescription>
              Are you sure you want to suspend <strong>{selectedUser?.name}</strong>? They will no longer be able to log in or access the platform. Any active jobs will be paused.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900">Reason for suspension (optional)</label>
              <Input placeholder="e.g. Violation of Terms of Service" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSuspendModalOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => setSuspendModalOpen(false)}>Confirm Suspension</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
