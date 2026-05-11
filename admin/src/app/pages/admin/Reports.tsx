import { useState } from "react"
import { AlertOctagon, MessageSquare, Trash2, MailWarning, CheckSquare, Search } from "lucide-react"
import { Card } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { Badge } from "../../components/ui/Badge"
import { toast } from "sonner"

const reportsMock = [
  { 
    id: "R1", 
    jobTitle: "Data Entry Clerk Remote", 
    company: "TypingPros", 
    reason: "Phishing / Scam", 
    reporter: "candidate_092", 
    date: "10 mins ago",
    details: "They asked me to buy my own equipment from their 'approved vendor' before I could start. I think this is a check fraud scam."
  },
  { 
    id: "R2", 
    jobTitle: "Senior React Developer", 
    company: "TechNova Inc.", 
    reason: "Inaccurate Salary", 
    reporter: "dev_alex", 
    date: "2 hrs ago",
    details: "The job description says the salary is $60k but the listing claims $150k to show up in higher filters."
  },
]

export function Reports() {
  const [selectedReport, setSelectedReport] = useState(reportsMock[0])

  const handleAction = (action: string) => {
    toast.success(`Action taken: ${action}`)
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-[calc(100vh-8rem)] flex flex-col">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Resolution Center</h1>
        <p className="text-slate-500 mt-1">Investigate and resolve user reports regarding jobs and companies.</p>
      </div>

      <div className="flex-1 grid md:grid-cols-3 gap-6 min-h-0">
        {/* Left List */}
        <Card className="md:col-span-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                placeholder="Search reports..." 
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-md text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {reportsMock.map((report) => (
              <button
                key={report.id}
                onClick={() => setSelectedReport(report)}
                className={`w-full text-left p-4 rounded-lg border transition-all ${
                  selectedReport.id === report.id 
                    ? 'border-indigo-500 bg-indigo-50/50 shadow-sm' 
                    : 'border-transparent hover:bg-slate-50'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="destructive" className="text-[10px] uppercase tracking-wider">{report.reason}</Badge>
                  <span className="text-xs text-slate-400">{report.date}</span>
                </div>
                <h4 className="font-semibold text-slate-900 text-sm truncate">{report.jobTitle}</h4>
                <p className="text-xs text-slate-500 mt-1">Reported by: {report.reporter}</p>
              </button>
            ))}
          </div>
        </Card>

        {/* Right Detail */}
        <Card className="md:col-span-2 flex flex-col overflow-hidden">
          {selectedReport ? (
            <>
              <div className="p-6 border-b border-slate-200 bg-slate-50 flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-xl font-bold text-slate-900">{selectedReport.jobTitle}</h2>
                    <Badge variant="outline">{selectedReport.company}</Badge>
                  </div>
                  <p className="text-sm text-slate-500">Report ID: {selectedReport.id} • Submitted {selectedReport.date}</p>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  <div className="bg-rose-50 border border-rose-100 rounded-lg p-4 flex gap-3 text-rose-900">
                    <AlertOctagon className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-500" />
                    <div>
                      <h4 className="font-semibold text-sm">Report Reason: {selectedReport.reason}</h4>
                      <p className="text-sm mt-1 opacity-90">{selectedReport.details}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center">
                      <MessageSquare className="w-4 h-4 mr-2 text-slate-400" />
                      Investigation Notes
                    </h3>
                    <textarea 
                      className="w-full h-32 p-3 border border-slate-200 rounded-md text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
                      placeholder="Add internal notes about this investigation..."
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center">
                <Button variant="ghost" className="text-slate-500 hover:text-slate-900" onClick={() => handleAction("Ignore Report")}>
                  <CheckSquare className="w-4 h-4 mr-2" /> Ignore Report
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" className="text-amber-600 border-amber-200 hover:bg-amber-50" onClick={() => handleAction("Warn Employer")}>
                    <MailWarning className="w-4 h-4 mr-2" /> Warn Employer
                  </Button>
                  <Button variant="destructive" onClick={() => handleAction("Delete Job")}>
                    <Trash2 className="w-4 h-4 mr-2" /> Delete Job
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
              <AlertOctagon className="w-12 h-12 mb-4 opacity-20" />
              <p>Select a report to view details</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
