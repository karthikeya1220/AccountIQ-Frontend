"use client"

interface Salary {
  id: string
  employeeName: string
  position: string
  baseSalary: number
  bonus: number
  deductions: number
  netSalary: number
  payDate: string
  status: string
}

interface SalaryListProps {
  salaries: Salary[]
  onStatusChange: (salaryId: string, newStatus: string) => void
}

export function SalaryList({ salaries, onStatusChange }: SalaryListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "badge-success"
      case "pending":
        return "badge-warning"
      default:
        return "badge-warning"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="card">
      <h2 className="card-title mb-4">Salaries</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="table-cell text-left font-semibold">Employee</th>
              <th className="table-cell text-right font-semibold">Net Salary</th>
              <th className="table-cell text-left font-semibold">Pay Date</th>
              <th className="table-cell text-left font-semibold">Status</th>
              <th className="table-cell text-left font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {salaries.map((salary) => {
              const netSalary = Number(salary.netSalary ?? 0)
              const employeeName = salary.employeeName || 'Unknown Employee'
              const position = salary.position || 'N/A'
              const payDate = salary.payDate || new Date().toISOString()
              return (
                <tr key={salary.id} className="border-b border-border hover:bg-background-secondary">
                  <td className="table-cell">
                    <div>
                      <p className="font-medium text-foreground">{employeeName}</p>
                      <p className="text-xs text-foreground-secondary">{position}</p>
                    </div>
                  </td>
                  <td className="table-cell text-right font-semibold text-foreground">${netSalary.toFixed(2)}</td>
                  <td className="table-cell text-foreground-secondary">{formatDate(payDate)}</td>
                  <td className="table-cell">
                    <span className={`badge ${getStatusColor(salary.status)}`}>{salary.status}</span>
                  </td>
                  <td className="table-cell">
                    <select
                      value={salary.status}
                      onChange={(e) => onStatusChange(salary.id, e.target.value)}
                      className="input-field text-xs py-1"
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                    </select>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
