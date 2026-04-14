import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getSavedJobs, unsaveJob } from '../services/jobsApi'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
    const { user } = useAuth()
    const queryClient = useQueryClient()

    const { data: savedJobs, isLoading } = useQuery({
        queryKey: ['savedJobs'],
        queryFn: getSavedJobs,
    })

    const { mutate: removeSaved } = useMutation({
        mutationFn: unsaveJob,
        onSuccess: () => queryClient.invalidateQueries(['savedJobs']),
    })

    const formatSalary = (min, max) => {
        if (!min && !max) return 'Not specified'
        if (min && max) return `£${Math.round(min / 1000)}k – £${Math.round(max / 1000)}k`
        return min ? `From £${Math.round(min / 1000)}k` : `Up to £${Math.round(max / 1000)}k`
    }

    return (
        <div className="min-h-screen bg-gray-50 px-6 py-10">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
                    <p className="text-gray-500 text-sm mt-1">Welcome back, {user?.name}</p>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                    <h2 className="font-semibold text-gray-800 mb-4">
                        Saved Jobs {savedJobs && <span className="text-blue-600">({savedJobs.length})</span>}
                    </h2>

                    {isLoading && <p className="text-gray-400 text-sm">Loading...</p>}

                    {savedJobs?.length === 0 && (
                        <p className="text-gray-400 text-sm text-center py-10">
                            No saved jobs yet. Start searching and click ★ to save jobs.
                        </p>
                    )}

                    <div className="flex flex-col gap-3">
                        {savedJobs?.map(job => (
                            <div key={job._id} className="flex items-start justify-between border border-gray-100 rounded-xl p-4 hover:bg-gray-50 transition">
                                <div className="flex flex-col gap-1">
                                    <h3 className="font-medium text-gray-900 text-sm">{job.title}</h3>
                                    <p className="text-blue-600 text-xs">{job.company}</p>
                                    <div className="flex gap-2 text-xs text-gray-500 mt-1">
                                        <span>📍 {job.location}</span>
                                        <span>💰 {formatSalary(job.salary_min, job.salary_max)}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2 shrink-0 ml-4">
                                    <a href={job.redirectUrl} target="_blank" rel="noopener noreferrer"
                                        className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition">
                                        Apply
                                    </a>
                                    <button onClick={() => removeSaved(job.jobId)}
                                        className="text-xs bg-red-50 text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-100 transition">
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}