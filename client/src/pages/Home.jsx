import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { searchJobs, getCategories, getSavedJobs } from '../services/jobsApi'
import { useAuth } from '../context/AuthContext'
import JobCard from '../components/JobCard'
import JobFilters from '../components/JobFilters'

export default function Home() {
    const { user } = useAuth()
    const [query, setQuery] = useState('developer')
    const [inputVal, setInputVal] = useState('developer')
    const [page, setPage] = useState(1)
    const [filters, setFilters] = useState({
        location: '', sort_by: 'relevance',
        contract_type: '', salary_min: '', category: ''
    })
    const [savedIds, setSavedIds] = useState([])

    const { data: jobs, isLoading, isError } = useQuery({
        queryKey: ['jobs', query, page, filters],
        queryFn: () => searchJobs({ query, page, results_per_page: 12, ...filters }),
        keepPreviousData: true,
    })

    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: getCategories,
        staleTime: Infinity,
    })

    useQuery({
        queryKey: ['savedJobs'],
        queryFn: async () => {
            const data = await getSavedJobs()
            setSavedIds(data.map(j => j.jobId))
            return data
        },
        enabled: !!user,
    })

    const handleSearch = (e) => {
        e.preventDefault()
        setQuery(inputVal)
        setPage(1)
    }

    const handleSaveToggle = (jobId, saved) => {
        setSavedIds(prev => saved ? [...prev, jobId] : prev.filter(id => id !== jobId))
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero */}
            <div className="bg-blue-600 py-14 px-6 text-center">
                <h1 className="text-3xl font-bold text-white mb-2">Find Your Next Job</h1>
                <p className="text-blue-100 text-sm mb-6">Search thousands of jobs from top companies</p>
                <form onSubmit={handleSearch} className="flex gap-2 max-w-xl mx-auto">
                    <input
                        value={inputVal}
                        onChange={e => setInputVal(e.target.value)}
                        placeholder="Job title, keyword..."
                        className="flex-1 px-4 py-3 rounded-xl text-sm focus:outline-none"
                    />
                    <button type="submit" className="bg-white text-blue-600 font-medium px-6 py-3 rounded-xl text-sm hover:bg-blue-50 transition">
                        Search
                    </button>
                </form>
            </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto px-6 py-8 flex gap-6">
                {/* Filters sidebar */}
                <div className="w-64 shrink-0">
                    <JobFilters filters={filters} setFilters={setFilters} categories={categories} />
                </div>

                {/* Results */}
                <div className="flex-1">
                    {isLoading && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse h-48" />
                            ))}
                        </div>
                    )}

                    {isError && (
                        <div className="bg-red-50 text-red-600 p-6 rounded-xl text-center">
                            Failed to load jobs. Check your Adzuna API keys.
                        </div>
                    )}

                    {jobs && (
                        <>
                            <p className="text-sm text-gray-500 mb-4">
                                {jobs.count?.toLocaleString()} jobs found for "<span className="font-medium text-gray-700">{query}</span>"
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {jobs.results?.map(job => (
                                    <JobCard
                                        key={job.id}
                                        job={job}
                                        savedJobIds={savedIds}
                                        onSaveToggle={handleSaveToggle}
                                    />
                                ))}
                            </div>

                            {/* Pagination */}
                            <div className="flex justify-center gap-2 mt-8">
                                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                                    className="px-4 py-2 rounded-lg border border-gray-200 text-sm disabled:opacity-40 hover:bg-gray-100 transition">
                                    Previous
                                </button>
                                <span className="px-4 py-2 text-sm text-gray-600">Page {page}</span>
                                <button onClick={() => setPage(p => p + 1)}
                                    className="px-4 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-100 transition">
                                    Next
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}