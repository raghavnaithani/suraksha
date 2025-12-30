import React from 'react'
import Layout from '../../components/Layout'

export default function RightsPage(): JSX.Element {
  return (
    <Layout>
      <div className="p-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Know Your Rights</h2>
        <p className="mb-4">This section provides quick, plain-language guidance about user rights when filing complaints or reporting emergencies.</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Right to Safety:</strong> You can report incidents and request assistance without fear of retaliation.</li>
          <li><strong>Right to Privacy:</strong> Personal data in reports is stored locally for demo purposes; in production we'd secure and limit access.</li>
          <li><strong>Right to Redress:</strong> Complaints are recorded and may be escalated through official channels (depending on backend integration).</li>
          <li><strong>Consent:</strong> For Aadhaar or sensitive identifiers, the app asks consent before storing or transmitting masked values.</li>
        </ul>
        <div className="mt-6">
          <h3 className="text-lg font-medium">Quick tips</h3>
          <ol className="list-decimal pl-6 mt-2 space-y-1">
            <li>Provide a contact method if comfortable — it helps responders reach you.</li>
            <li>If the situation is life-threatening, contact local emergency services first.</li>
            <li>Use the "Assisted Emergency Reporting" for richer reports and confirmations.</li>
          </ol>
        </div>
      </div>
    </Layout>
  )
}
