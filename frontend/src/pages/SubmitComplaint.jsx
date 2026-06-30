import ComplaintForm from '../components/ComplaintForm.jsx'

export default function SubmitComplaint() {
  return (
    <div className="container">
      <div className="page-header">
        <h1>Submit a Complaint</h1>
        <p>Tell us what went wrong and we'll get it sorted.</p>
      </div>

      <ComplaintForm />
    </div>
  )
}
