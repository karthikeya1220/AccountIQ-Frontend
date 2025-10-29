export function exportToCSV(data: any[], filename: string) {
  if (data.length === 0) {
    alert("No data to export")
    return
  }

  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header]
          if (typeof value === "string" && value.includes(",")) {
            return `"${value}"`
          }
          return value
        })
        .join(","),
    ),
  ].join("\n")

  const blob = new Blob([csvContent], { type: "text/csv" })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `${filename}-${new Date().toISOString().split("T")[0]}.csv`
  link.click()
  window.URL.revokeObjectURL(url)
}

export function exportToPDF(data: any[], filename: string, title: string) {
  if (data.length === 0) {
    alert("No data to export")
    return
  }

  const headers = Object.keys(data[0])
  const htmlContent = `
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #333; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background-color: #4f46e5; color: white; padding: 10px; text-align: left; }
          td { padding: 8px; border-bottom: 1px solid #ddd; }
          tr:nth-child(even) { background-color: #f9fafb; }
          .footer { margin-top: 30px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <p>Generated on: ${new Date().toLocaleString()}</p>
        <table>
          <thead>
            <tr>
              ${headers.map((h) => `<th>${h}</th>`).join("")}
            </tr>
          </thead>
          <tbody>
            ${data
              .map(
                (row) => `
              <tr>
                ${headers.map((h) => `<td>${row[h]}</td>`).join("")}
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
        <div class="footer">
          <p>This is an automatically generated report from the Accounting System.</p>
        </div>
      </body>
    </html>
  `

  const blob = new Blob([htmlContent], { type: "text/html" })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `${filename}-${new Date().toISOString().split("T")[0]}.html`
  link.click()
  window.URL.revokeObjectURL(url)
}

export function filterDataByDateRange(data: any[], dateField: string, startDate: Date, endDate: Date) {
  return data.filter((item) => {
    const itemDate = new Date(item[dateField])
    return itemDate >= startDate && itemDate <= endDate
  })
}
