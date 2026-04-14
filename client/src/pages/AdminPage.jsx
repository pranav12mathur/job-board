import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAllUsers, deleteUser, updateUserRole } from '../services/jobsApi'

export default function AdminPage() {
    const queryClient = useQueryClient()

    const { data: users, isLoading } = useQuery({
        queryKey: ['users'],
        queryFn: getAllUsers,
    })

    const { mutate: removeUser } = useMutation({
        mutationFn: deleteUser,
        onSuccess: () => queryClient.invalidateQueries(['users']),
    })

    const { mutate: changeRole } = useMutation({
        mutationFn: ({ id, role }) => updateUserRole(id, role),
        onSuccess: () => queryClient.invalidateQueries(['users']),
    })

    return (
        <div className="min-h-screen bg-gray-50 px-6 py-10">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Panel</h1>
                <p className="text-gray-500 text-sm mb-8">Manage all registered users</p>

                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                    <div className="grid grid-cols-5 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-medium text-gray-500 uppercase">
                        <span className="col-span-2">User</span>
                        <span>Role</span>
                        <span>Joined</span>
                        <span>Actions</span>
                    </div>

                    {isLoading && (
                        <div className="p-6 text-center text-gray-400 text-sm">Loading users...</div>
                    )}

                    {users?.map(user => (
                        <div key={user._id} className="grid grid-cols-5 gap-4 px-6 py-4 border-b border-gray-50 items-center hover:bg-gray-50 transition">
                            <div className="col-span-2">
                                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                <p className="text-xs text-gray-400">{user.email}</p>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full w-fit font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
                                }`}>
                                {user.role}
                            </span>
                            <span className="text-xs text-gray-400">
                                {new Date(user.createdAt).toLocaleDateString()}
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => changeRole({ id: user._id, role: user.role === 'admin' ? 'user' : 'admin' })}
                                    className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition"
                                >
                                    {user.role === 'admin' ? 'Make User' : 'Make Admin'}
                                </button>
                                <button
                                    onClick={() => { if (confirm(`Delete ${user.name}?`)) removeUser(user._id) }}
                                    className="text-xs bg-red-50 text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-100 transition"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}