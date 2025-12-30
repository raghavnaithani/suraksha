import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { COMPLAINT_TYPES } from '../lib/complaint-types'
import Layout from '../../components/Layout'
import ComplaintForm from '../components/complaints/ComplaintForm'

function NewComplaintWrapper() {
  const { typeId } = useParams()
  const schema = COMPLAINT_TYPES.find((t) => t.id === typeId)
  if (!schema) return <div className="p-6">Unknown complaint type.</div>
  return <ComplaintForm schema={schema} type={schema} />
}

export default function ComplaintsIndex(): JSX.Element {
  const { typeId } = useParams()

  if (typeId) {
    return (
      <Layout>
        <NewComplaintWrapper />
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="p-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">File a Complaint</h2>
        <div className="grid gap-4">
          {COMPLAINT_TYPES.map((t) => (
            <div key={t.id} className="p-4 border rounded">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium">{t.title}</h3>
                  <p className="text-sm text-muted-foreground">{t.description}</p>
                </div>
                <div>
                  <Link to={`/complaints/new/${t.id}`} className="inline-block px-4 py-2 bg-blue-600 text-white rounded">Start</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}
