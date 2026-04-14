export default function JobFilters({ filters, setFilters, categories }) {
    const handle = (e) => setFilters(f => ({ ...f, [e.target.name]: e.target.value }))

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-4">
            <h2 className="font-semibold text-gray-800">Filters</h2>

            <div>
                <label className="text-xs text-gray-500 mb-1 block">Location</label>
                <input
                    name="location"
                    value={filters.location}
                    onChange={handle}
                    placeholder="e.g. London"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
            </div>

            <div>
                <label className="text-xs text-gray-500 mb-1 block">Sort by</label>
                <select
                    name="sort_by"
                    value={filters.sort_by}
                    onChange={handle}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                    <option value="relevance">Relevance</option>
                    <option value="date">Date</option>
                    <option value="salary">Salary</option>
                </select>
            </div>

            <div>
                <label className="text-xs text-gray-500 mb-1 block">Contract type</label>
                <select
                    name="contract_type"
                    value={filters.contract_type}
                    onChange={handle}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                    <option value="">All</option>
                    <option value="permanent">Permanent</option>
                    <option value="contract">Contract</option>
                </select>
            </div>

            <div>
                <label className="text-xs text-gray-500 mb-1 block">Min salary (£)</label>
                <input
                    name="salary_min"
                    type="number"
                    value={filters.salary_min}
                    onChange={handle}
                    placeholder="e.g. 30000"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
            </div>

            <div>
                <label className="text-xs text-gray-500 mb-1 block">Category</label>
                <select
                    name="category"
                    value={filters.category}
                    onChange={handle}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                    <option value="">All categories</option>
                    {categories?.map(cat => (
                        <option key={cat.tag} value={cat.tag}>{cat.label}</option>
                    ))}
                </select>
            </div>
        </div>
    )
}