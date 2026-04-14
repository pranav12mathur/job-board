import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { saveJob, unsaveJob } from '../services/jobsApi'

export default function JobCard({ job, savedJobIds = [], onSaveToggle }) {
    const { user } = useAuth()
    const [saving, setSaving] = useState(false)

    // Check if this specific job is in the savedJobIds array
    const isSaved = savedJobIds.includes(job.id)

    const handleSaveToggle = async () => {
        if (!user) return alert('Please login to save jobs')

        setSaving(true)
        try {
            if (isSaved) {
                await unsaveJob(job.id)
            } else {
                await saveJob({
                    jobId: job.id,
                    title: job.title,
                    company: job.company,
                    location: job.location,
                    salary_min: job.salary_min,
                    salary_max: job.salary_max,
                    description: job.description,
                    redirectUrl: job.redirectUrl,
                    category: job.category,
                    contractType: job.contractType,
                })
            }
            // Notify parent component to update UI state
            if (onSaveToggle) onSaveToggle(job.id, !isSaved)
        } catch (err) {
            alert(err.response?.data?.message || 'Something went wrong')
        } finally {
            setSaving(false)
        }
    }

    const formatSalary = (min, max) => {
        if (!min && !max) return 'Salary not specified'
        if (min && max) return `£${Math.round(min / 1000)}k - £${Math.round(max / 1000)}k`
        if (min) return `From £${Math.round(min / 1000)}k`
        return `Up to £${Math.round(max / 1000)}k`
    }

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition flex flex-col gap-3">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-semibold text-gray-900 text-base">{job.title}</h3>
                    <p className="text-blue-600 text-sm font-medium">{job.company}</p>
                </div>
                <button
                    onClick={handleSaveToggle}
                    disabled={saving}
                    className={`text-xl transition ${isSaved ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-400'}`}
                    aria-label={isSaved ? "Unsave job" : "Save job"}
                >
                    {saving ? '...' : '★'}
                </button>
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full">📍 {job.location}</span>
                <span className="bg-green-50 text-green-700 px-2 py-1 rounded-full">💰 {formatSalary(job.salary_min, job.salary_max)}</span>
                {job.contractType && (
                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full">{job.contractType}</span>
                )}
                {job.category && (
                    <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded-full">{job.category}</span>
                )}
            </div>

            <p className="text-gray-500 text-sm line-clamp-2">{job.description}</p>

            {/* FIXED: Added the opening <a> tag here */}
            <a
                href={job.redirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto bg-blue-600 hover:bg-blue-700 text-white text-sm text-center py-2 rounded-lg transition"
            >
                Apply Now
            </a>
        </div>
    )
}