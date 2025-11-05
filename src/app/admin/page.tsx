'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const API_BASE_URL = 'http://localhost:8080'

interface Article {
  id: number
  title: string
  category: string
  date: string
  image_url: string | null
  content: string | null
  author_id: number | null
  is_published: boolean
  created_at: string
}

interface User {
  id: number
  email: string
  name: string | null
  picture: string | null
  role: string
  is_active: boolean
  created_at: string
  updated_at: string | null
}

interface UserStatistics {
  total_users: number
  active_users: number
  google_users: number
  email_users: number
  admin_users: number
  regular_users: number
}

export default function AdminPanel() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [articles, setArticles] = useState<Article[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)
  const [categories, setCategories] = useState<string[]>([])
  
  // Users state
  const [activeTab, setActiveTab] = useState<'articles' | 'users'>('articles')
  const [users, setUsers] = useState<User[]>([])
  const [userStatistics, setUserStatistics] = useState<UserStatistics | null>(null)
  const [userSearch, setUserSearch] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showUserModal, setShowUserModal] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    content: '',
    image: null as File | null
  })

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('access_token')
      if (!token) {
        router.push('/admin/login')
        return
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.user && data.user.role === 'admin') {
          setIsAuthenticated(true)
          loadArticles()
          loadCategories()
          loadUsers()
        } else {
          localStorage.removeItem('access_token')
          router.push('/admin/login')
        }
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('Auth check failed:', response.status, errorData)
        localStorage.removeItem('access_token')
        router.push('/admin/login')
      }
    } catch (error) {
      console.error('Auth check error:', error)
      localStorage.removeItem('access_token')
      router.push('/admin/login')
    } finally {
      setLoading(false)
    }
  }

  const loadArticles = async () => {
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(`${API_BASE_URL}/api/admin/articles`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setArticles(data.articles)
      }
    } catch (error) {
      console.error('Error loading articles:', error)
    }
  }

  const loadCategories = async () => {
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(`${API_BASE_URL}/api/admin/categories`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories)
      }
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  const loadUsers = async () => {
    try {
      const token = localStorage.getItem('access_token')
      const searchParam = userSearch ? `&search=${encodeURIComponent(userSearch)}` : ''
      const response = await fetch(`${API_BASE_URL}/api/admin/users?per_page=100${searchParam}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
        setUserStatistics(data.statistics)
      }
    } catch (error) {
      console.error('Error loading users:', error)
    }
  }

  useEffect(() => {
    if (isAuthenticated && activeTab === 'users') {
      loadUsers()
    }
  }, [isAuthenticated, activeTab, userSearch])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const token = localStorage.getItem('access_token')
      const formDataToSend = new FormData()
      
      formDataToSend.append('title', formData.title)
      formDataToSend.append('category', formData.category)
      formDataToSend.append('date', formData.date)
      formDataToSend.append('content', formData.content)
      
      if (formData.image) {
        formDataToSend.append('image', formData.image)
      }

      const url = editingArticle 
        ? `${API_BASE_URL}/api/admin/articles/${editingArticle.id}`
        : `${API_BASE_URL}/api/admin/articles`
      
      const method = editingArticle ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      })

      if (response.ok) {
        setShowAddModal(false)
        setEditingArticle(null)
        resetForm()
        loadArticles()
      } else {
        const error = await response.json()
        alert(`Error: ${error.error || 'Failed to save article'}`)
      }
    } catch (error) {
      console.error('Error saving article:', error)
      alert('Error saving article')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this article?')) return

    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(`${API_BASE_URL}/api/admin/articles/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        loadArticles()
      } else {
        alert('Error deleting article')
      }
    } catch (error) {
      console.error('Error deleting article:', error)
      alert('Error deleting article')
    }
  }

  const handleEdit = (article: Article) => {
    setEditingArticle(article)
    setFormData({
      title: article.title,
      category: article.category,
      date: article.date,
      content: article.content || '',
      image: null
    })
    setShowAddModal(true)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      category: '',
      date: new Date().toISOString().split('T')[0],
      content: '',
      image: null
    })
    setEditingArticle(null)
  }

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    router.push('/admin/login')
  }

  const getImageUrl = (imageUrl: string | null) => {
    if (!imageUrl) return null
    if (imageUrl.startsWith('http')) return imageUrl
    return `${API_BASE_URL}${imageUrl}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Flow  Admin
              </Link>
              <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
                View Site
              </Link>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('articles')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'articles'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Articles
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Users
            </button>
          </nav>
        </div>

        {activeTab === 'articles' ? (
          <>
            <div className="mb-6 flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900">Articles Management</h1>
              <button
                onClick={() => {
                  resetForm()
                  setShowAddModal(true)
                }}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition-all shadow-lg"
              >
                + Add New Article
              </button>
            </div>

            {/* Articles Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {articles.map((article) => (
                    <tr key={article.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getImageUrl(article.image_url) ? (
                          <img
                            src={getImageUrl(article.image_url)!}
                            alt={article.title}
                            className="w-20 h-16 object-cover rounded"
                          />
                        ) : (
                          <div className="w-20 h-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                            No Image
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{article.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                          {article.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(article.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(article)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(article.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {articles.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No articles yet. Create your first article!</p>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Users Section */}
            <div className="mb-6 flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
            </div>

            {/* User Statistics */}
            {userStatistics && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
                  <div className="text-sm font-medium text-gray-600">Total Users</div>
                  <div className="text-2xl font-bold text-gray-900 mt-1">{userStatistics.total_users}</div>
                </div>
                <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
                  <div className="text-sm font-medium text-gray-600">Active Users</div>
                  <div className="text-2xl font-bold text-gray-900 mt-1">{userStatistics.active_users}</div>
                </div>
                <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
                  <div className="text-sm font-medium text-gray-600">Google Users</div>
                  <div className="text-2xl font-bold text-gray-900 mt-1">{userStatistics.google_users}</div>
                </div>
                <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
                  <div className="text-sm font-medium text-gray-600">Email Users</div>
                  <div className="text-2xl font-bold text-gray-900 mt-1">{userStatistics.email_users}</div>
                </div>
              </div>
            )}

            {/* Search Bar */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search users by email or name..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder:text-gray-400 bg-white"
              />
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {user.picture ? (
                            <img
                              src={user.picture}
                              alt={user.name || user.email}
                              className="w-10 h-10 rounded-full mr-3"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold mr-3">
                              {(user.name || user.email).charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {user.name || user.email.split('@')[0] || 'User'}
                            </div>
                            <div className="text-xs text-gray-500">
                              {user.name ? user.email : `ID: ${user.id}`}
                              {user.name && <span className="ml-2">ID: {user.id}</span>}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          user.role === 'admin' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          user.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => {
                            setSelectedUser(user)
                            setShowUserModal(true)
                          }}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {users.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No users found.</p>
              </div>
            )}
          </>
        )}
      </main>

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">User Details</h2>
                <button
                  onClick={() => {
                    setShowUserModal(false)
                    setSelectedUser(null)
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  {selectedUser.picture ? (
                    <img
                      src={selectedUser.picture}
                      alt={selectedUser.name || selectedUser.email}
                      className="w-20 h-20 rounded-full"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-2xl">
                      {(selectedUser.name || selectedUser.email).charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {selectedUser.name || selectedUser.email.split('@')[0] || 'User'}
                    </h3>
                    <p className="text-gray-600">{selectedUser.email}</p>
                    {selectedUser.name && (
                      <p className="text-sm text-gray-500 mt-1">Full name: {selectedUser.name}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-gray-600">User ID</div>
                    <div className="text-lg font-semibold text-gray-900">{selectedUser.id}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-gray-600">Role</div>
                    <div className="text-lg font-semibold text-gray-900 capitalize">{selectedUser.role}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-gray-600">Status</div>
                    <div className={`text-lg font-semibold ${selectedUser.is_active ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedUser.is_active ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-gray-600">Joined</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {new Date(selectedUser.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Additional Information</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Email:</span> <span className="text-gray-900">{selectedUser.email}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Display Name:</span>{' '}
                      <span className="text-gray-900">
                        {selectedUser.name || selectedUser.email.split('@')[0] || 'User'}
                      </span>
                      {selectedUser.name && (
                        <span className="text-gray-500 ml-2">({selectedUser.email.split('@')[0]})</span>
                      )}
                    </div>
                    {selectedUser.name && (
                      <div>
                        <span className="text-gray-600">Full Name:</span>{' '}
                        <span className="text-gray-900">{selectedUser.name}</span>
                      </div>
                    )}
                    {selectedUser.updated_at && (
                      <div>
                        <span className="text-gray-600">Last Updated:</span>{' '}
                        <span className="text-gray-900">{new Date(selectedUser.updated_at).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => {
                    setShowUserModal(false)
                    setSelectedUser(null)
                  }}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingArticle ? 'Edit Article' : 'Add New Article'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false)
                    resetForm()
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder:text-gray-400 bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                    <input
                      type="text"
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      list="categories"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder:text-gray-400 bg-white"
                    />
                    <datalist id="categories">
                      {categories.map((cat) => (
                        <option key={cat} value={cat} />
                      ))}
                    </datalist>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        setFormData({ ...formData, image: file })
                      }
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                  />
                  {formData.image && (
                    <p className="mt-2 text-sm text-gray-500">Selected: {formData.image.name}</p>
                  )}
                  {editingArticle && editingArticle.image_url && !formData.image && (
                    <img
                      src={getImageUrl(editingArticle.image_url)!}
                      alt="Current image"
                      className="mt-2 w-32 h-24 object-cover rounded-lg"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content <span className="text-gray-500 font-normal">(HTML supported)</span>
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={12}
                    placeholder="You can use HTML tags to format your content. Examples:&#10;&#10;&lt;p&gt;Your paragraph text here&lt;/p&gt;&#10;&lt;h2&gt;Heading 2&lt;/h2&gt;&#10;&lt;h3&gt;Heading 3&lt;/h3&gt;&#10;&lt;ul&gt;&#10;  &lt;li&gt;List item 1&lt;/li&gt;&#10;  &lt;li&gt;List item 2&lt;/li&gt;&#10;&lt;/ul&gt;&#10;&lt;strong&gt;Bold text&lt;/strong&gt;&#10;&lt;em&gt;Italic text&lt;/em&gt;"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder:text-gray-400 bg-white font-mono text-sm"
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    <strong>Tip:</strong> You can paste plain text here! The system will automatically detect headings (short lines, ALL CAPS, or lines ending with :), convert paragraphs, format lists (starting with - or *), and style bold (**text**) and italic (*text*). Or use HTML tags for full control.
                  </p>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false)
                      resetForm()
                    }}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition-all"
                  >
                    {editingArticle ? 'Update Article' : 'Create Article'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

