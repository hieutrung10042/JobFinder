import { useState } from "react"
import { Search, Plus, Edit2, Trash2, FolderTree, MapPin, Tag } from "lucide-react"
import { Card } from "../../components/ui/Card"
import { Input } from "../../components/ui/Input"
import { Button } from "../../components/ui/Button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/Table"
import { toast } from "sonner"

const categoriesMock = [
  { id: 1, name: "Engineering", count: 1245 },
  { id: 2, name: "Design", count: 832 },
  { id: 3, name: "Marketing", count: 641 },
  { id: 4, name: "Sales", count: 512 },
]

export function Metadata() {
  const [activeView, setActiveView] = useState("categories")

  const handleDelete = () => {
    toast.error("Category deleted successfully.")
  }

  const handleEdit = () => {
    toast.success("Category updated.")
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Metadata</h1>
        <p className="text-slate-500 mt-1">Manage categories, locations, and skills used across the platform.</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <Card className="md:col-span-1 p-2 space-y-1 h-fit">
          <button 
            onClick={() => setActiveView("categories")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeView === 'categories' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <FolderTree className="w-4 h-4" />
            Job Categories
          </button>
          <button 
            onClick={() => setActiveView("locations")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeView === 'locations' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <MapPin className="w-4 h-4" />
            Locations (SEO)
          </button>
          <button 
            onClick={() => setActiveView("skills")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeView === 'skills' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Tag className="w-4 h-4" />
            Skill Tags
          </button>
        </Card>

        <Card className="md:col-span-3">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50 rounded-t-xl">
            <div className="relative w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input className="pl-9 bg-white" placeholder={`Search ${activeView}...`} />
            </div>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add New
            </Button>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Usage Count</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categoriesMock.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium text-slate-900">{item.name}</TableCell>
                  <TableCell className="text-slate-500">{item.count} jobs</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={handleEdit} className="text-slate-400 hover:text-indigo-600">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={handleDelete} className="text-slate-400 hover:text-rose-600">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  )
}
