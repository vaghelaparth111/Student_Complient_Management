const STATUS_BADGE_CLASS = {
  Pending: 'badge-pending',
  'In Progress': 'badge-progress',
  Resolved: 'badge-resolved',
}

const STATUS_OPTIONS = ['Pending', 'In Progress', 'Resolved']

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function ComplaintTable({
  complaints,
  mode = 'student',
  onStatusChange,
  onDelete,
}) {
  if (!complaints || complaints.length === 0) {
    return (
      <div className="table-wrapper">
        <div className="empty-state">No complaints found.</div>
      </div>
    )
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            {mode === 'admin' && <th>Student Name</th>}
            {mode === 'admin' && <th>Department</th>}
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
            <th>Date</th>
            {mode === 'admin' && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {complaints.map((complaint) => (
            <tr key={complaint.id}>
              {mode === 'admin' && <td>{complaint.student_name}</td>}
              {mode === 'admin' && <td>{complaint.department}</td>}
              <td>{complaint.title}</td>
              <td className="cell-description">{complaint.description}</td>
              <td>
                {mode === 'admin' ? (
                  <select
                    className="status-select"
                    value={complaint.status}
                    onChange={(e) => onStatusChange(complaint.id, e.target.value)}
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className={`badge ${STATUS_BADGE_CLASS[complaint.status]}`}>
                    {complaint.status}
                  </span>
                )}
              </td>
              <td>{formatDate(complaint.created_at)}</td>
              {mode === 'admin' && (
                <td className="actions-cell">
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => onDelete(complaint.id)}
                  >
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
