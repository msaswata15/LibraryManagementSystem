// --- Professional CSS Styles ---
const styles = {
    container: {
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px',
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
        color: '#1e293b'
    },
    header: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '24px',
        borderRadius: '12px',
        marginBottom: '24px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
    },
    title: {
        fontSize: '2rem',
        fontWeight: '700',
        margin: '0 0 8px 0',
        textAlign: 'center'
    },
    subtitle: {
        fontSize: '1rem',
        opacity: '0.9',
        textAlign: 'center',
        margin: 0
    },
    card: {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e2e8f0'
    },
    sectionTitle: {
        fontSize: '1.5rem',
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: '16px',
        paddingBottom: '8px',
        borderBottom: '2px solid #e2e8f0'
    },
    button: {
        backgroundColor: '#3b82f6',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        padding: '10px 16px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px'
    },
    buttonSecondary: {
        backgroundColor: '#64748b',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        padding: '8px 12px',
        fontSize: '13px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
    },
    buttonDanger: {
        backgroundColor: '#ef4444',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        padding: '8px 12px',
        fontSize: '13px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
    },
    input: {
        width: '100%',
        padding: '12px 16px',
        border: '1px solid #d1d5db',
        borderRadius: '8px',
        fontSize: '14px',
        transition: 'border-color 0.2s ease',
        backgroundColor: 'white'
    },
    select: {
        width: '100%',
        padding: '12px 16px',
        border: '1px solid #d1d5db',
        borderRadius: '8px',
        fontSize: '14px',
        backgroundColor: 'white',
        cursor: 'pointer'
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        backgroundColor: 'white',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    },
    th: {
        backgroundColor: '#f8fafc',
        padding: '12px 16px',
        textAlign: 'left',
        fontWeight: '600',
        fontSize: '14px',
        color: '#374151',
        borderBottom: '1px solid #e2e8f0'
    },
    td: {
        padding: '12px 16px',
        borderBottom: '1px solid #f1f5f9',
        fontSize: '14px'
    },
    form: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '20px'
    },
    userNav: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: '16px 24px',
        borderRadius: '8px',
        marginBottom: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    },
    alert: {
        padding: '12px 16px',
        borderRadius: '8px',
        marginBottom: '16px',
        fontWeight: '500'
    },
    alertSuccess: {
        backgroundColor: '#dcfce7',
        color: '#166534',
        border: '1px solid #bbf7d0'
    },
    alertError: {
        backgroundColor: '#fef2f2',
        color: '#dc2626',
        border: '1px solid #fecaca'
    },
    pagination: {
        display: 'flex',
        justifyContent: 'center',
        gap: '8px',
        marginTop: '20px',
        alignItems: 'center'
    },
    pageButton: {
        padding: '8px 12px',
        border: '1px solid #d1d5db',
        backgroundColor: 'white',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
        transition: 'all 0.2s ease'
    },
    activePageButton: {
        backgroundColor: '#3b82f6',
        color: 'white',
        border: '1px solid #3b82f6'
    },
    searchInput: {
        width: '100%',
        maxWidth: '400px',
        padding: '12px 16px',
        border: '1px solid #d1d5db',
        borderRadius: '8px',
        fontSize: '14px',
        marginBottom: '16px'
    },
    badge: {
        display: 'inline-block',
        padding: '4px 8px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '500'
    },
    badgeSuccess: {
        backgroundColor: '#dcfce7',
        color: '#166534'
    },
    badgePending: {
        backgroundColor: '#fef3c7',
        color: '#92400e'
    },
    badgeOverdue: {
        backgroundColor: '#fef2f2',
        color: '#dc2626'
    }
};

// --- OfflineIssueForm component ---
function OfflineIssueForm({ users, books, onIssue }) {
    // Helper to check if user already has an active borrowing for the selected book
    const [activeBorrowings, setActiveBorrowings] = React.useState([]);
    React.useEffect(() => {
        // Fetch all borrowings and filter for active ones
        axiosAuth.get(`${API}/borrowings`).then(r => {
            setActiveBorrowings(r.data.filter(b => !b.returnDate));
        }).catch(() => setActiveBorrowings([]));
    }, []);

    const userHasActiveBorrowing = (userId, bookId) => {
        return activeBorrowings.some(b => String(b.memberId) === String(userId) && String(b.bookId) === String(bookId));
    };
    const [userQuery, setUserQuery] = React.useState('');
    const [bookQuery, setBookQuery] = React.useState('');
    const [userId, setUserId] = React.useState('');
    const [bookId, setBookId] = React.useState('');
    const [showUserSuggestions, setShowUserSuggestions] = React.useState(false);
    const [showBookSuggestions, setShowBookSuggestions] = React.useState(false);

    const filteredUsers = users.filter(u => u.role === 'USER' && (
        u.username.toLowerCase().includes(userQuery.toLowerCase()) ||
        (u.name && u.name.toLowerCase().includes(userQuery.toLowerCase()))
    ));
    const filteredBooks = books.filter(b =>
        b.title.toLowerCase().includes(bookQuery.toLowerCase()) ||
        b.author.toLowerCase().includes(bookQuery.toLowerCase())
    );

    return (
        <form onSubmit={e => {
            e.preventDefault();
            if (userId && bookId) onIssue(userId, bookId);
        }} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '16px', alignItems: 'end', marginBottom: '20px' }} autoComplete="off">
            <div style={{ position: 'relative' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>Select User:</label>
                <input
                    type="text"
                    value={userQuery}
                    onChange={e => {
                        setUserQuery(e.target.value);
                        setShowUserSuggestions(true);
                        setUserId('');
                    }}
                    onFocus={() => setShowUserSuggestions(true)}
                    placeholder="Search user..."
                    required
                    style={styles.input}
                />
                {showUserSuggestions && userQuery && (
                    <ul style={{
                        position: 'absolute',
                        zIndex: 10,
                        background: 'white',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        width: '100%',
                        maxHeight: '200px',
                        overflowY: 'auto',
                        listStyle: 'none',
                        margin: '4px 0 0 0',
                        padding: 0,
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}>
                        {filteredUsers.map(u => (
                            <li key={u.id} style={{
                                padding: '12px 16px',
                                cursor: 'pointer',
                                borderBottom: '1px solid #f1f5f9',
                                transition: 'background-color 0.2s ease'
                            }}
                                onMouseDown={() => {
                                    setUserQuery(u.username + (u.name ? ` (${u.name})` : ''));
                                    setUserId(u.id);
                                    setShowUserSuggestions(false);
                                }}
                                onMouseEnter={e => e.target.style.backgroundColor = '#f8fafc'}
                                onMouseLeave={e => e.target.style.backgroundColor = 'white'}>
                                <div style={{ fontWeight: '500' }}>{u.username}</div>
                                {u.name && <div style={{ fontSize: '12px', color: '#64748b' }}>{u.name}</div>}
                            </li>
                        ))}
                        {filteredUsers.length === 0 && (
                            <li style={{ padding: '12px 16px', color: '#64748b', fontStyle: 'italic' }}>
                                No users found
                            </li>
                        )}
                    </ul>
                )}
            </div>
            <div style={{ position: 'relative' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>Select Book:</label>
                <input
                    type="text"
                    value={bookQuery}
                    onChange={e => {
                        setBookQuery(e.target.value);
                        setShowBookSuggestions(true);
                        setBookId('');
                    }}
                    onFocus={() => setShowBookSuggestions(true)}
                    placeholder="Search book..."
                    required
                    style={styles.input}
                />
                {showBookSuggestions && bookQuery && (
                    <ul style={{
                        position: 'absolute',
                        zIndex: 10,
                        background: 'white',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        width: '100%',
                        maxHeight: '200px',
                        overflowY: 'auto',
                        listStyle: 'none',
                        margin: '4px 0 0 0',
                        padding: 0,
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}>
                        {filteredBooks.map(b => (
                            <li key={b.id} style={{
                                padding: '12px 16px',
                                cursor: 'pointer',
                                borderBottom: '1px solid #f1f5f9',
                                transition: 'background-color 0.2s ease'
                            }}
                                onMouseDown={() => {
                                    setBookQuery(b.title + (b.author ? ` by ${b.author}` : ''));
                                    setBookId(b.id);
                                    setShowBookSuggestions(false);
                                }}
                                onMouseEnter={e => e.target.style.backgroundColor = '#f8fafc'}
                                onMouseLeave={e => e.target.style.backgroundColor = 'white'}>
                                <div style={{ fontWeight: '500' }}>{b.title}</div>
                                {b.author && <div style={{ fontSize: '12px', color: '#64748b' }}>by {b.author}</div>}
                            </li>
                        ))}
                        {filteredBooks.length === 0 && (
                            <li style={{ padding: '12px 16px', color: '#64748b', fontStyle: 'italic' }}>
                                No books found
                            </li>
                        )}
                    </ul>
                )}
            </div>
            <button
                type="submit"
                disabled={!userId || !bookId || userHasActiveBorrowing(userId, bookId)}
                style={{
                    ...styles.button,
                    opacity: (!userId || !bookId || userHasActiveBorrowing(userId, bookId)) ? 0.5 : 1,
                    cursor: (!userId || !bookId || userHasActiveBorrowing(userId, bookId)) ? 'not-allowed' : 'pointer'
                }}
                onMouseEnter={e => !e.target.disabled && (e.target.style.backgroundColor = '#2563eb')}
                onMouseLeave={e => !e.target.disabled && (e.target.style.backgroundColor = '#3b82f6')}
            >
                {userHasActiveBorrowing(userId, bookId) ? 'Already Issued' : '📚 Issue Book'}
            </button>
        </form>
    );
}

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:8080';
const axiosAuth = axios.create();
axiosAuth.interceptors.request.use(config => {
    const token = window.localStorage.getItem('jwt_token');
    if (token) config.headers['Authorization'] = 'Bearer ' + token;
    return config;
});

export default function App() {
    // Project summary for display
    const projectSummary = `Advanced Library Management System with role-based access control, 
    borrowing/return processes, overdue tracking, fine calculation, book recommendations, and comprehensive audit trails.`;

    const [users, setUsers] = useState([]);
    const [books, setBooks] = useState([]);
    const [requests, setRequests] = useState([]);
    const [search, setSearch] = useState('');
    const [editBook, setEditBook] = useState(null);
    const [loading, setLoading] = useState(false);

    // Pagination state for books
    const [currentPage, setCurrentPage] = useState(1);
    const booksPerPage = 8;
    const [bookForm, setBookForm] = useState({ title: '', author: '', publicationYear: '', genre: '', isbn: '', availableCopies: 1 });
    const [borrowings, setBorrowings] = useState([]);
    const [overdues, setOverdues] = useState([]);
    const [fines, setFines] = useState({});
    const [recommendations, setRecommendations] = useState({ popularRecommendations: [], genreRecommendations: [] });
    const [auditLogs, setAuditLogs] = useState([]);
    const [form, setForm] = useState({
        name: '', username: '', password: '', role: 'USER', email: '', phoneNumber: ''
    });
    const [loginForm, setLoginForm] = useState({ username: '', password: '' });
    const [bookRequest, setBookRequest] = useState({ bookId: '', username: '' });
    const [message, setMessage] = useState('');
    const [user, setUser] = useState(() => {
        // Try to restore user from localStorage
        const savedUser = window.localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [token, setToken] = useState(() => window.localStorage.getItem('jwt_token') || '');

    // State for OfflineReturnForm to persist across re-renders
    const [offlineReturnUserQuery, setOfflineReturnUserQuery] = useState('');
    const [offlineReturnSelectedUser, setOfflineReturnSelectedUser] = useState(null);

    // Persist user and token to localStorage on change
    useEffect(() => {
        if (user && token) {
            window.localStorage.setItem('user', JSON.stringify(user));
            window.localStorage.setItem('jwt_token', token);
        } else {
            window.localStorage.removeItem('user');
            window.localStorage.removeItem('jwt_token');
        }
    }, [user, token]);

    useEffect(() => {
        if (user && token) {
            axiosAuth.get(`${API}/users`).then(r => setUsers(r.data)).catch(() => { });
            axiosAuth.get(`${API}/books`).then(r => setBooks(r.data)).catch(() => { });

            // Only fetch user-specific data for USER role
            if (user.role === 'USER') {
                axiosAuth.get(`${API}/users/${user.id || 1}/overdue-notifications`).then(r => setOverdues(r.data)).catch(() => { });
                axiosAuth.get(`${API}/books/recommended?userId=${user.id || 1}`).then(r => setRecommendations(r.data)).catch(() => { });
                axiosAuth.get(`${API}/audit-logs/user/${user.id || 1}`).then(r => setAuditLogs(r.data)).catch(() => { });
            }
            // Fetch all pending book requests for librarians
            if (user.role === 'LIBRARIAN') {
                axiosAuth.get(`${API}/api/request-book`).then(r => setRequests(r.data)).catch(() => { });
            }
            // Fetch borrowings for both roles
            axiosAuth.get(`${API}/borrowings`).then(r => setBorrowings(r.data)).catch(() => { });
            // Fines for each borrowing
            borrowings.forEach(b => {
                axiosAuth.get(`${API}/users/borrowing/${b.id}/fine`).then(r => setFines(f => ({ ...f, [b.id]: r.data }))).catch(() => { });
            });
        }
    }, [user, token, borrowings.length]);
    // Book management handlers (librarian)
    const addBook = async e => {
        e.preventDefault();
        setMessage('');
        setLoading(true);
        try {
            if (editBook) {
                // Update existing book
                await axiosAuth.put(`${API}/books/${editBook.id}`, bookForm);
                setMessage('✅ Book updated successfully!');
            } else {
                // Add new book
                // For new book, backend expects availableCopies, but UI uses 'copies' field for input
                const payload = { ...bookForm, availableCopies: bookForm.availableCopies };
                await axiosAuth.post(`${API}/books`, payload);
                setMessage('✅ Book added successfully!');
            }
            setBookForm({ title: '', author: '', publicationYear: '', genre: '', isbn: '', availableCopies: 1 });
            setEditBook(null);
            const r = await axiosAuth.get(`${API}/books`);
            setBooks(r.data);
        } catch (err) {
            setMessage('❌ Add/update book failed');
        } finally {
            setLoading(false);
        }
    };

    const handleEditBook = (book) => {
        setEditBook(book);
        setBookForm({
            title: book.title || '',
            author: book.author || '',
            publicationYear: book.publicationYear || '',
            genre: book.genre || '',
            isbn: book.isbn || '',
            availableCopies: Number(book.availableCopies ?? 1)
        });
    };

    const handleDeleteBook = async (bookId) => {
        if (!window.confirm('Are you sure you want to delete this book?')) return;
        setMessage('');
        setLoading(true);
        try {
            await axiosAuth.delete(`${API}/books/${bookId}`);
            setMessage('✅ Book deleted successfully!');
            const r = await axiosAuth.get(`${API}/books`);
            setBooks(r.data);
        } catch (err) {
            setMessage('❌ Delete book failed');
        } finally {
            setLoading(false);
        }
    };
    const returnBook = async recordId => {
        setMessage('');
        setLoading(true);
        try {
            // Fetch the borrowing record to get current details
            const recordResp = await axiosAuth.get(`${API}/borrowings/${recordId}`);
            const record = recordResp.data;
            // Set returnDate to today
            const today = new Date().toISOString().slice(0, 10);
            const updated = { ...record, returnDate: today };
            await axiosAuth.put(`${API}/borrowings/${recordId}`, updated);
            setMessage('✅ Book returned successfully!');
            const r = await axiosAuth.get(`${API}/borrowings`);
            setBorrowings(r.data);
        } catch {
            setMessage('❌ Return failed');
        } finally {
            setLoading(false);
        }
    };

    const register = async e => {
        e.preventDefault();
        setMessage('');
        setLoading(true);
        try {
            await axios.post(`${API}/auth/register`, form);
            setMessage('✅ Registration successful! Logging you in...');
            // Auto-login after registration
            await login({ username: form.username, password: form.password, role: form.role });
        } catch (err) {
            setMessage('❌ Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const login = async (creds = loginForm) => {
        setMessage('');
        setLoading(true);
        try {
            const res = await axios.post(`${API}/auth/login`, creds);
            setToken(res.data.token);
            setUser({
                id: res.data.id,
                username: res.data.username || creds.username,
                role: res.data.role || creds.role || form.role
            });
            setMessage('✅ Login successful!');
        } catch (err) {
            setMessage('❌ Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        setToken('');
        setMessage('👋 Logged out successfully');
    };

    // --- OfflineReturnForm component ---
    function OfflineReturnForm({
        users,
        borrowings,
        onReturn,
        userQuery: controlledUserQuery,
        setUserQuery: controlledSetUserQuery,
        selectedUser: controlledSelectedUser,
        setSelectedUser: controlledSetSelectedUser
    }) {
        const [borrowId, setBorrowId] = React.useState('');
        const [showUserSuggestions, setShowUserSuggestions] = React.useState(false);
        const [userBorrowings, setUserBorrowings] = React.useState([]);
        const [returning, setReturning] = React.useState(false);
        // Fallback to internal state if not controlled
        const [internalUserQuery, setInternalUserQuery] = React.useState('');
        const [internalSelectedUser, setInternalSelectedUser] = React.useState(null);
        const userQuery = controlledUserQuery !== undefined ? controlledUserQuery : internalUserQuery;
        const setUserQuery = controlledSetUserQuery !== undefined ? controlledSetUserQuery : setInternalUserQuery;
        const selectedUser = controlledSelectedUser !== undefined ? controlledSelectedUser : internalSelectedUser;
        const setSelectedUser = controlledSetSelectedUser !== undefined ? controlledSetSelectedUser : setInternalSelectedUser;

        // Find user by username
        const safeQuery = (userQuery || '').toLowerCase();
        const filteredUsers = users.filter(u =>
            (u.username && u.username.toLowerCase().includes(safeQuery)) ||
            (u.name && u.name.toLowerCase().includes(safeQuery))
        );

        React.useEffect(() => {
            if (selectedUser) {
                setUserBorrowings(borrowings.filter(b => String(b.memberId) === String(selectedUser.id) && !b.returnDate));
            } else {
                setUserBorrowings([]);
            }
        }, [selectedUser, borrowings]);

        return (
            <div style={{ marginBottom: 24 }}>
                <form onSubmit={async e => {
                    e.preventDefault();
                    if (!borrowId || returning) return;
                    setReturning(true);
                    await onReturn(borrowId);
                    setBorrowId(''); // Only clear the borrowId field
                    setReturning(false);
                }} style={{ display: 'flex', gap: 16, alignItems: 'end', marginBottom: 12 }} autoComplete="off">
                    <div>
                        <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, color: '#374151' }}>Return by Borrow ID:</label>
                        <input
                            type="number"
                            value={borrowId}
                            onChange={e => setBorrowId(e.target.value)}
                            placeholder="Enter Borrowing ID..."
                            style={styles.input}
                        />
                    </div>
                    <button type="submit" style={{ ...styles.button, minWidth: 120 }} disabled={!borrowId || returning}>Return</button>
                </form>
                <div style={{ margin: '16px 0', fontWeight: 500, color: '#374151' }}>OR</div>
                <div style={{ position: 'relative', marginBottom: 12 }}>
                    <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, color: '#374151' }}>Return by Username:</label>
                    <input
                        type="text"
                        value={userQuery}
                        onChange={e => {
                            setUserQuery(e.target.value);
                            setShowUserSuggestions(true);
                            setSelectedUser(null);
                        }}
                        onFocus={() => setShowUserSuggestions(true)}
                        placeholder="Search user..."
                        style={styles.input}
                        autoComplete="off"
                    />
                    {showUserSuggestions && userQuery && (
                        <ul style={{
                            position: 'absolute',
                            zIndex: 10,
                            background: 'white',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px',
                            width: '100%',
                            maxHeight: '200px',
                            overflowY: 'auto',
                            listStyle: 'none',
                            margin: '4px 0 0 0',
                            padding: 0,
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}>
                            {filteredUsers.map(u => (
                                <li key={u.id} style={{ padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid #f1f5f9' }}
                                    onMouseDown={() => {
                                        setUserQuery(u.username + (u.name ? ` (${u.name})` : ''));
                                        setSelectedUser(u);
                                        setShowUserSuggestions(false);
                                    }}
                                    onMouseEnter={e => e.target.style.backgroundColor = '#f8fafc'}
                                    onMouseLeave={e => e.target.style.backgroundColor = 'white'}>
                                    <div style={{ fontWeight: 500 }}>{u.username}</div>
                                    {u.name && <div style={{ fontSize: 12, color: '#64748b' }}>{u.name}</div>}
                                </li>
                            ))}
                            {filteredUsers.length === 0 && (
                                <li style={{ padding: '12px 16px', color: '#64748b', fontStyle: 'italic' }}>No users found</li>
                            )}
                        </ul>
                    )}
                </div>
                {selectedUser && userBorrowings.length > 0 && (
                    <div style={{ marginTop: 8 }}>
                        <div style={{ fontWeight: 500, marginBottom: 6 }}>Active Borrowings for {selectedUser.username}:</div>
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 8 }}>
                            <thead>
                                <tr style={{ background: '#f1f5f9' }}>
                                    <th style={{ padding: 8, border: '1px solid #e2e8f0' }}>Borrow ID</th>
                                    <th style={{ padding: 8, border: '1px solid #e2e8f0' }}>Book</th>
                                    <th style={{ padding: 8, border: '1px solid #e2e8f0' }}>Borrow Date</th>
                                    <th style={{ padding: 8, border: '1px solid #e2e8f0' }}>Due Date</th>
                                    <th style={{ padding: 8, border: '1px solid #e2e8f0' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userBorrowings.map(b => (
                                    <tr key={b.id}>
                                        <td style={{ padding: 8, border: '1px solid #e2e8f0' }}>{b.id}</td>
                                        <td style={{ padding: 8, border: '1px solid #e2e8f0' }}>{b.bookTitle || b.book?.title || b.bookId}</td>
                                        <td style={{ padding: 8, border: '1px solid #e2e8f0' }}>{b.borrowDate}</td>
                                        <td style={{ padding: 8, border: '1px solid #e2e8f0' }}>{b.dueDate}</td>
                                        <td style={{ padding: 8, border: '1px solid #e2e8f0' }}>
                                            <button style={styles.button} disabled={returning} onClick={async () => {
                                                if (returning) return;
                                                setReturning(true);
                                                await onReturn(b.id);
                                                setReturning(false);
                                            }}>Return</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {selectedUser && userBorrowings.length === 0 && (
                    <div style={{ color: '#64748b', fontStyle: 'italic', marginTop: 8 }}>No active borrowings for this user.</div>
                )}
            </div>
        );
    }

    // Handler for direct book request from table
    const handleRequestBook = async (bookId) => {
        setMessage('');
        setLoading(true);
        try {
            await axiosAuth.post(`${API}/api/request-book`, { bookId, username: user.username });
            setMessage('✅ Book request submitted successfully!');
            // No GET call, backend does not support GET /api/request-book
        } catch (err) {
            setMessage('❌ Request failed');
        } finally {
            setLoading(false);
        }
    };

    // Handler for borrowing approved books
    const borrowBook = async (bookId) => {
        setMessage('');
        setLoading(true);
        try {
            // Create borrowing record
            await axiosAuth.post(`${API}/borrowings`, { userId: user.id, bookId });
            setMessage('✅ Book borrowed successfully!');
            // Refresh borrowings
            const r = await axiosAuth.get(`${API}/borrowings`);
            setBorrowings(r.data);
        } catch (err) {
            if (err?.response?.status === 409 && err?.response?.data?.message?.includes('already borrowed')) {
                setMessage('❌ You have already borrowed this book. Please return it before borrowing again.');
            } else if (err?.response?.data?.message) {
                setMessage('❌ ' + err.response.data.message);
            } else {
                setMessage('❌ Borrowing failed');
            }
        } finally {
            setLoading(false);
        }
    };

    // UI logic for role-based dashboards
    const isLibrarian = user && user.role === 'LIBRARIAN';
    const isUser = user && user.role === 'USER';

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>📚 Library Management System</h1>
                <p style={styles.subtitle}>{projectSummary}</p>
            </div>

            {message && (
                <div style={{
                    ...styles.alert,
                    ...(message.includes('❌') || message.includes('fail') ? styles.alertError : styles.alertSuccess)
                }}>
                    {message}
                </div>
            )}

            {loading && (
                <div style={{
                    ...styles.alert,
                    backgroundColor: '#eff6ff',
                    color: '#1d4ed8',
                    border: '1px solid #bfdbfe'
                }}>
                    ⏳ Loading...
                </div>
            )}

            {!user ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
                    {/* Registration Card */}
                    <div style={styles.card}>
                        <h2 style={styles.sectionTitle}>👤 Create Account</h2>
                        <form onSubmit={register}>
                            <div style={styles.form}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>Full Name</label>
                                    <input
                                        required
                                        placeholder="Enter your full name"
                                        value={form.name}
                                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                        style={styles.input}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>Username</label>
                                    <input
                                        required
                                        placeholder="Choose a username"
                                        value={form.username}
                                        onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                                        style={styles.input}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>Password</label>
                                    <input
                                        required
                                        placeholder="Create a password"
                                        type="password"
                                        value={form.password}
                                        onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                                        style={styles.input}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>Email</label>
                                    <input
                                        required
                                        placeholder="Enter your email"
                                        type="email"
                                        value={form.email}
                                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                        style={styles.input}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>Phone Number</label>
                                    <input
                                        required
                                        placeholder="Enter your phone number"
                                        value={form.phoneNumber}
                                        onChange={e => setForm(f => ({ ...f, phoneNumber: e.target.value }))}
                                        style={styles.input}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>Role</label>
                                    <select
                                        value={form.role}
                                        onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                                        style={styles.select}
                                    >
                                        <option value="USER">📖 Library Member</option>
                                        <option value="LIBRARIAN">👨‍💼 Librarian</option>
                                    </select>
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    ...styles.button,
                                    width: '100%',
                                    marginTop: '16px',
                                    opacity: loading ? 0.7 : 1
                                }}
                                onMouseEnter={e => !loading && (e.target.style.backgroundColor = '#2563eb')}
                                onMouseLeave={e => !loading && (e.target.style.backgroundColor = '#3b82f6')}
                            >
                                {loading ? '⏳ Creating Account...' : '✨ Create Account'}
                            </button>
                        </form>
                    </div>

                    {/* Login Card */}
                    <div style={styles.card}>
                        <h2 style={styles.sectionTitle}>🔐 Sign In</h2>
                        <form onSubmit={e => { e.preventDefault(); login(); }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>Username</label>
                                    <input
                                        required
                                        placeholder="Enter your username"
                                        value={loginForm.username}
                                        onChange={e => setLoginForm(f => ({ ...f, username: e.target.value }))}
                                        style={styles.input}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>Password</label>
                                    <input
                                        required
                                        placeholder="Enter your password"
                                        type="password"
                                        value={loginForm.password}
                                        onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
                                        style={styles.input}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    style={{
                                        ...styles.button,
                                        width: '100%',
                                        marginTop: '8px',
                                        opacity: loading ? 0.7 : 1
                                    }}
                                    onMouseEnter={e => !loading && (e.target.style.backgroundColor = '#2563eb')}
                                    onMouseLeave={e => !loading && (e.target.style.backgroundColor = '#3b82f6')}
                                >
                                    {loading ? '⏳ Signing In...' : '🚀 Sign In'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : (
                <>
                    <div style={styles.userNav}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                                backgroundColor: user.role === 'LIBRARIAN' ? '#7c3aed' : '#059669',
                                color: 'white',
                                padding: '6px 12px',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: '600'
                            }}>
                                {user.role === 'LIBRARIAN' ? '👨‍💼 LIBRARIAN' : '📖 MEMBER'}
                            </div>
                            <div>
                                <div style={{ fontWeight: '600', fontSize: '16px' }}>Welcome, {user.username}!</div>
                                <div style={{ fontSize: '14px', color: '#64748b' }}>Manage your library activities</div>
                            </div>
                        </div>
                        <button
                            onClick={logout}
                            style={styles.buttonSecondary}
                            onMouseEnter={e => e.target.style.backgroundColor = '#475569'}
                            onMouseLeave={e => e.target.style.backgroundColor = '#64748b'}
                        >
                            🚪 Logout
                        </button>
                    </div>
                    {/* USER DASHBOARD */}
                    {isUser && (
                        <>
                            <div style={styles.card}>
                                <h2 style={styles.sectionTitle}>📚 Available Books</h2>
                                <input
                                    placeholder="🔍 Search books by title or author..."
                                    value={search}
                                    onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                                    style={styles.searchInput}
                                />
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={styles.table}>
                                        <thead>
                                            <tr>
                                                <th style={styles.th}>ID</th>
                                                <th style={styles.th}>Title</th>
                                                <th style={styles.th}>Author</th>
                                                <th style={styles.th}>Year</th>
                                                <th style={styles.th}>Genre</th>
                                                <th style={styles.th}>ISBN</th>
                                                <th style={styles.th}>Available</th>
                                                <th style={styles.th}>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(() => {
                                                const filtered = books.filter(b =>
                                                    b.title.toLowerCase().includes(search.toLowerCase()) ||
                                                    b.author.toLowerCase().includes(search.toLowerCase())
                                                );
                                                const start = (currentPage - 1) * booksPerPage;
                                                const end = start + booksPerPage;
                                                return filtered.slice(start, end).map(b => {
                                                    const userRequest = requests.find(r => r.bookId === b.id && r.username === user.username && r.status === 'PENDING');
                                                    const approvedRequest = requests.find(r => r.bookId === b.id && r.username === user.username && r.status === 'APPROVED');
                                                    const alreadyBorrowed = borrowings.some(br => br.bookId === b.id && br.userId === user.id && !br.returnDate);
                                                    return (
                                                        <tr key={b.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                                            <td style={styles.td}>{b.id}</td>
                                                            <td style={{ ...styles.td, fontWeight: '500' }}>{b.title}</td>
                                                            <td style={styles.td}>{b.author}</td>
                                                            <td style={styles.td}>{b.publicationYear}</td>
                                                            <td style={styles.td}>
                                                                <span style={{
                                                                    backgroundColor: '#f0f9ff',
                                                                    color: '#0369a1',
                                                                    padding: '2px 8px',
                                                                    borderRadius: '12px',
                                                                    fontSize: '12px'
                                                                }}>
                                                                    {b.genre}
                                                                </span>
                                                            </td>
                                                            <td style={styles.td}>{b.isbn}</td>
                                                            <td style={styles.td}>
                                                                <span style={{
                                                                    fontWeight: '600',
                                                                    color: (b.availableCopies ?? b.copies ?? 0) > 0 ? '#059669' : '#dc2626'
                                                                }}>
                                                                    {b.availableCopies ?? b.copies ?? 0}
                                                                </span>
                                                            </td>
                                                            <td style={styles.td}>
                                                                {!userRequest && !approvedRequest && !alreadyBorrowed && (
                                                                    <button
                                                                        onClick={() => handleRequestBook(b.id)}
                                                                        disabled={loading}
                                                                        style={styles.button}
                                                                        onMouseEnter={e => !loading && (e.target.style.backgroundColor = '#2563eb')}
                                                                        onMouseLeave={e => !loading && (e.target.style.backgroundColor = '#3b82f6')}
                                                                    >
                                                                        📝 Request
                                                                    </button>
                                                                )}
                                                                {userRequest && (
                                                                    <span style={{ ...styles.badge, ...styles.badgePending }}>
                                                                        ⏳ Requested
                                                                    </span>
                                                                )}
                                                                {approvedRequest && !alreadyBorrowed && (
                                                                    <button
                                                                        onClick={() => borrowBook(b.id)}
                                                                        style={{ ...styles.button, backgroundColor: '#059669' }}
                                                                        onMouseEnter={e => e.target.style.backgroundColor = '#047857'}
                                                                        onMouseLeave={e => e.target.style.backgroundColor = '#059669'}
                                                                    >
                                                                        📖 Borrow
                                                                    </button>
                                                                )}
                                                                {alreadyBorrowed && (
                                                                    <span style={{ ...styles.badge, ...styles.badgeSuccess }}>
                                                                        ✅ Borrowed
                                                                    </span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    );
                                                });
                                            })()}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                <div style={styles.pagination}>
                                    {(() => {
                                        const filteredCount = books.filter(b =>
                                            b.title.toLowerCase().includes(search.toLowerCase()) ||
                                            b.author.toLowerCase().includes(search.toLowerCase())
                                        ).length;
                                        const totalPages = Math.ceil(filteredCount / booksPerPage);
                                        const maxButtons = 10;
                                        let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
                                        let endPage = Math.min(totalPages, startPage + maxButtons - 1);
                                        if (endPage - startPage < maxButtons - 1) {
                                            startPage = Math.max(1, endPage - maxButtons + 1);
                                        }
                                        const buttons = [];
                                        if (startPage > 1) {
                                            buttons.push(<span key="start-ellipsis" style={{ color: '#64748b' }}>...</span>);
                                        }
                                        for (let i = startPage; i <= endPage; i++) {
                                            buttons.push(
                                                <button
                                                    key={i}
                                                    onClick={() => setCurrentPage(i)}
                                                    style={currentPage === i ? styles.activePageButton : styles.pageButton}
                                                >
                                                    {i}
                                                </button>
                                            );
                                        }
                                        if (endPage < totalPages) {
                                            buttons.push(<span key="end-ellipsis" style={{ color: '#64748b' }}>...</span>);
                                        }
                                        return buttons;
                                    })()}
                                </div>
                            </div>

                            {/* User Borrowings */}
                            <div style={styles.card}>
                                <h2 style={styles.sectionTitle}>📖 Your Borrowings</h2>
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={styles.table}>
                                        <thead>
                                            <tr>
                                                <th style={styles.th}>Book</th>
                                                <th style={styles.th}>Borrow Date</th>
                                                <th style={styles.th}>Due Date</th>
                                                <th style={styles.th}>Return Date</th>
                                                <th style={styles.th}>Fine (₹5/day)</th>
                                                <th style={styles.th}>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {borrowings.filter(b => (b.userId === user.id || b.memberId === user.id || (b.member && b.member.id === user.id))).map(b => {
                                                let fine = fines[b.id];
                                                let daysOverdue = 0;
                                                if (b.dueDate && !b.returnDate && new Date(b.dueDate) < new Date()) {
                                                    daysOverdue = Math.max(0, Math.floor((new Date() - new Date(b.dueDate)) / (1000 * 60 * 60 * 24)));
                                                    fine = daysOverdue > 0 ? daysOverdue * 5 : 0;
                                                }
                                                return (
                                                    <tr key={b.id} style={{
                                                        backgroundColor: b.returnDate ? '#f8fafc' : (daysOverdue > 0 ? '#fef2f2' : 'white')
                                                    }}>
                                                        <td style={{ ...styles.td, fontWeight: '500' }}>
                                                            {books.find(book => book.id === b.bookId)?.title || `Book #${b.bookId}`}
                                                        </td>
                                                        <td style={styles.td}>{b.borrowDate}</td>
                                                        <td style={styles.td}>{b.dueDate}</td>
                                                        <td style={styles.td}>
                                                            {b.returnDate ? (
                                                                <span style={{ ...styles.badge, ...styles.badgeSuccess }}>
                                                                    ✅ {b.returnDate}
                                                                </span>
                                                            ) : (
                                                                <span style={{ color: '#dc2626', fontWeight: '500' }}>Not returned</span>
                                                            )}
                                                        </td>
                                                        <td style={styles.td}>
                                                            {fine && fine > 0 ? (
                                                                <span style={{ color: '#dc2626', fontWeight: '600' }}>₹{fine}</span>
                                                            ) : '-'}
                                                        </td>
                                                        <td style={styles.td}>
                                                            {!b.returnDate && (
                                                                <button
                                                                    onClick={() => returnBook(b.id)}
                                                                    disabled={loading}
                                                                    style={{ ...styles.button, backgroundColor: '#059669' }}
                                                                    onMouseEnter={e => !loading && (e.target.style.backgroundColor = '#047857')}
                                                                    onMouseLeave={e => !loading && (e.target.style.backgroundColor = '#059669')}
                                                                >
                                                                    📤 Return
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                            {borrowings.filter(b => (b.userId === user.id || b.memberId === user.id || (b.member && b.member.id === user.id))).length === 0 && (
                                                <tr>
                                                    <td colSpan={6} style={{ ...styles.td, textAlign: 'center', color: '#64748b', fontStyle: 'italic' }}>
                                                        No borrowings found
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* User Dashboard Info Cards */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                                {/* Overdue Books */}
                                <div style={styles.card}>
                                    <h3 style={{ ...styles.sectionTitle, fontSize: '1.25rem', marginBottom: '12px' }}>⚠️ Overdue Books</h3>
                                    <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                        {overdues.map((o, i) => {
                                            if (typeof o === 'object' && o !== null && o.book) {
                                                const daysOverdue = o.dueDate && !o.returnDate ? Math.max(0, Math.floor((new Date() - new Date(o.dueDate)) / (1000 * 60 * 60 * 24))) : 0;
                                                const fine = daysOverdue > 0 ? daysOverdue * 5 : 0;
                                                return (
                                                    <div key={i} style={{
                                                        padding: '12px',
                                                        backgroundColor: '#fef2f2',
                                                        borderRadius: '8px',
                                                        marginBottom: '8px',
                                                        border: '1px solid #fecaca'
                                                    }}>
                                                        <div style={{ fontWeight: '600', color: '#dc2626' }}>{o.book.title}</div>
                                                        <div style={{ fontSize: '12px', color: '#7f1d1d' }}>
                                                            Due: {o.dueDate}
                                                            {daysOverdue > 0 && ` • ${daysOverdue} days overdue • Fine: ₹${fine}`}
                                                        </div>
                                                    </div>
                                                );
                                            }
                                            return (
                                                <div key={i} style={{
                                                    padding: '8px 12px',
                                                    backgroundColor: '#f8fafc',
                                                    borderRadius: '6px',
                                                    marginBottom: '4px',
                                                    fontSize: '14px',
                                                    color: '#64748b'
                                                }}>
                                                    {typeof o === 'object' ? JSON.stringify(o) : o}
                                                </div>
                                            );
                                        })}
                                        {overdues.length === 0 && (
                                            <div style={{
                                                textAlign: 'center',
                                                color: '#059669',
                                                fontStyle: 'italic',
                                                padding: '20px'
                                            }}>
                                                ✅ No overdue books!
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Recommendations */}
                                <div style={styles.card}>
                                    <h3 style={{ ...styles.sectionTitle, fontSize: '1.25rem', marginBottom: '12px' }}>💡 Recommended Books</h3>
                                    <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                        {[...(recommendations.popularRecommendations || []), ...(recommendations.genreRecommendations || [])].map((b, i) => (
                                            <div key={b.id || i} style={{
                                                padding: '10px 12px',
                                                backgroundColor: '#eff6ff',
                                                borderRadius: '8px',
                                                marginBottom: '8px',
                                                border: '1px solid #bfdbfe'
                                            }}>
                                                <div style={{ fontWeight: '500', color: '#1d4ed8' }}>{b.title}</div>
                                                <div style={{ fontSize: '12px', color: '#1e40af' }}>by {b.author}</div>
                                            </div>
                                        ))}
                                        {(!recommendations.popularRecommendations?.length && !recommendations.genreRecommendations?.length) && (
                                            <div style={{
                                                textAlign: 'center',
                                                color: '#64748b',
                                                fontStyle: 'italic',
                                                padding: '20px'
                                            }}>
                                                📚 Start borrowing to get personalized recommendations!
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* User Audit Logs */}
                                <div style={styles.card}>
                                    <h3 style={{ ...styles.sectionTitle, fontSize: '1.25rem', marginBottom: '12px' }}>📋 Your Activity Log</h3>
                                    <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                        {auditLogs.map(log => (
                                            <div key={log.id} style={{
                                                padding: '8px 12px',
                                                backgroundColor: '#f8fafc',
                                                borderRadius: '6px',
                                                marginBottom: '6px',
                                                fontSize: '13px',
                                                borderLeft: '3px solid #3b82f6'
                                            }}>
                                                {typeof log === 'object' && log !== null
                                                    ? `${log.action || ''} at ${log.timestamp || ''}`
                                                    : String(log)}
                                            </div>
                                        ))}
                                        {auditLogs.length === 0 && (
                                            <div style={{
                                                textAlign: 'center',
                                                color: '#64748b',
                                                fontStyle: 'italic',
                                                padding: '20px'
                                            }}>
                                                📝 No activity logs yet
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                    {/* LIBRARIAN DASHBOARD */}
                    {isLibrarian && (
                        <>
                            {/* Book Requests Table */}
                            <div style={styles.card}>
                                <h2 style={styles.sectionTitle}>📋 Pending Book Requests</h2>
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={styles.table}>
                                        <thead>
                                            <tr>
                                                <th style={styles.th}>Request ID</th>
                                                <th style={styles.th}>Book ID</th>
                                                <th style={styles.th}>Username</th>
                                                <th style={styles.th}>Status</th>
                                                <th style={styles.th}>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {requests.length === 0 ? (
                                                <tr>
                                                    <td colSpan={5} style={{ ...styles.td, textAlign: 'center', color: '#64748b', fontStyle: 'italic' }}>
                                                        📝 No pending requests
                                                    </td>
                                                </tr>
                                            ) : (
                                                requests.map(r => (
                                                    <tr key={r.id}>
                                                        <td style={styles.td}>{r.id}</td>
                                                        <td style={styles.td}>#{r.bookId}</td>
                                                        <td style={{ ...styles.td, fontWeight: '500' }}>{r.username}</td>
                                                        <td style={styles.td}>
                                                            <span style={{
                                                                ...styles.badge,
                                                                ...(r.status === 'PENDING' ? styles.badgePending : styles.badgeSuccess)
                                                            }}>
                                                                {r.status === 'PENDING' ? '⏳ PENDING' : '✅ ' + r.status}
                                                            </span>
                                                        </td>
                                                        <td style={styles.td}>
                                                            {r.status === 'PENDING' && (
                                                                <button
                                                                    onClick={async () => {
                                                                        setMessage('');
                                                                        setLoading(true);
                                                                        try {
                                                                            // Check if user already has an active borrowing for this book
                                                                            const activeBorrowing = borrowings.some(b =>
                                                                                (String(b.userId) === String(r.userId) || String(b.memberId) === String(r.userId)) &&
                                                                                String(b.bookId) === String(r.bookId) &&
                                                                                !b.returnDate
                                                                            );
                                                                            if (activeBorrowing) {
                                                                                setMessage('❌ This user has already borrowed this book.');
                                                                                setLoading(false);
                                                                                return;
                                                                            }
                                                                            await axiosAuth.put(`${API}/api/request-book/${r.id}/approve`);
                                                                            setMessage('✅ Request approved successfully');
                                                                            // Refresh requests after approval
                                                                            const resp = await axiosAuth.get(`${API}/api/request-book`);
                                                                            setRequests(resp.data);
                                                                            // Reload page to refresh all data
                                                                            setTimeout(() => window.location.reload(), 1000);
                                                                        } catch (err) {
                                                                            if (err.response && err.response.status === 400 && err.response.data && typeof err.response.data === 'string' && err.response.data.includes('No available copies')) {
                                                                                setMessage('❌ Request rejected: No available copies');
                                                                            } else {
                                                                                setMessage('❌ Approval failed');
                                                                            }
                                                                        } finally {
                                                                            setLoading(false);
                                                                        }
                                                                    }}
                                                                    disabled={loading}
                                                                    style={{ ...styles.button, backgroundColor: '#059669' }}
                                                                    onMouseEnter={e => !loading && (e.target.style.backgroundColor = '#047857')}
                                                                    onMouseLeave={e => !loading && (e.target.style.backgroundColor = '#059669')}
                                                                >
                                                                    ✅ Approve
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Offline Issue Interface */}
                            <div style={styles.card}>
                                <h2 style={styles.sectionTitle}>📚 Offline Book Issue</h2>
                                <OfflineIssueForm users={users} books={books} onIssue={async (userId, bookId) => {
                                    setMessage('');
                                    setLoading(true);
                                    const token = window.localStorage.getItem('jwt_token');
                                    console.log('DEBUG: JWT token for offline issue:', token);
                                    try {
                                        // Only send userId and bookId; backend sets borrowDate and dueDate
                                        const resp = await axiosAuth.post(`${API}/borrowings`, { userId, bookId });
                                        console.log('DEBUG: axiosAuth POST /borrowings response', resp);
                                        setMessage('✅ Book issued successfully!');
                                        // Reload page to refresh all data
                                        setTimeout(() => window.location.reload(), 1000);
                                    } catch (err) {
                                        console.error('DEBUG: axiosAuth POST /borrowings error', err);
                                        if (err?.response?.status === 409 && err?.response?.data?.message?.includes('already borrowed')) {
                                            setMessage('❌ This user has already borrowed this book.');
                                        } else if (err?.response?.data?.message) {
                                            setMessage('❌ ' + err.response.data.message);
                                        } else {
                                            setMessage('❌ Offline issue failed');
                                        }
                                    } finally {
                                        setLoading(false);
                                    }
                                }} />
                            </div>

                            <div style={styles.card}>
                                <h2 style={styles.sectionTitle}>📖 Book Management</h2>
                                <form onSubmit={addBook}>
                                    <div style={styles.form}>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>Title *</label>
                                            <input
                                                required
                                                placeholder="Enter book title"
                                                value={bookForm.title}
                                                onChange={e => setBookForm(f => ({ ...f, title: e.target.value }))}
                                                style={styles.input}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>Author *</label>
                                            <input
                                                required
                                                placeholder="Enter author name"
                                                value={bookForm.author}
                                                onChange={e => setBookForm(f => ({ ...f, author: e.target.value }))}
                                                style={styles.input}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>Year *</label>
                                            <input
                                                required
                                                type="number"
                                                min={1000}
                                                max={3000}
                                                placeholder="Publication year"
                                                value={bookForm.publicationYear || ''}
                                                onChange={e => setBookForm(f => ({ ...f, publicationYear: parseInt(e.target.value) }))}
                                                style={styles.input}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>Genre *</label>
                                            <input
                                                required
                                                placeholder="Enter genre"
                                                value={bookForm.genre || ''}
                                                onChange={e => setBookForm(f => ({ ...f, genre: e.target.value }))}
                                                style={styles.input}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>ISBN *</label>
                                            <input
                                                required
                                                placeholder="Enter ISBN"
                                                value={bookForm.isbn}
                                                onChange={e => setBookForm(f => ({ ...f, isbn: e.target.value }))}
                                                style={styles.input}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>Available Copies *</label>
                                            <input
                                                required
                                                type="number"
                                                min={1}
                                                placeholder="Number of copies"
                                                value={bookForm.availableCopies}
                                                onChange={e => setBookForm(f => ({ ...f, availableCopies: parseInt(e.target.value) }))}
                                                style={styles.input}
                                            />
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            style={{
                                                ...styles.button,
                                                backgroundColor: editBook ? '#7c3aed' : '#3b82f6',
                                                opacity: loading ? 0.7 : 1
                                            }}
                                            onMouseEnter={e => !loading && (e.target.style.backgroundColor = editBook ? '#6d28d9' : '#2563eb')}
                                            onMouseLeave={e => !loading && (e.target.style.backgroundColor = editBook ? '#7c3aed' : '#3b82f6')}
                                        >
                                            {loading ? '⏳ Processing...' : (editBook ? '✏️ Update Book' : '➕ Add Book')}
                                        </button>
                                        {editBook && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setEditBook(null);
                                                    setBookForm({ title: '', author: '', publicationYear: '', genre: '', isbn: '', availableCopies: 1 });
                                                }}
                                                style={styles.buttonSecondary}
                                            >
                                                ❌ Cancel
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </div>
                            {/* Book Table for Librarian */}
                            <div style={styles.card}>
                                <h2 style={styles.sectionTitle}>📚 Book Inventory</h2>
                                <input
                                    placeholder="🔍 Search books by title or author..."
                                    value={search}
                                    onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                                    style={styles.searchInput}
                                />
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={styles.table}>
                                        <thead>
                                            <tr>
                                                <th style={styles.th}>ID</th>
                                                <th style={styles.th}>Title</th>
                                                <th style={styles.th}>Author</th>
                                                <th style={styles.th}>Year</th>
                                                <th style={styles.th}>Genre</th>
                                                <th style={styles.th}>ISBN</th>
                                                <th style={styles.th}>Available</th>
                                                <th style={styles.th}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(() => {
                                                const filtered = books.filter(b =>
                                                    b.title.toLowerCase().includes(search.toLowerCase()) ||
                                                    b.author.toLowerCase().includes(search.toLowerCase())
                                                );
                                                const start = (currentPage - 1) * booksPerPage;
                                                const end = start + booksPerPage;
                                                return filtered.slice(start, end).map(b => (
                                                    <tr key={b.id}>
                                                        <td style={styles.td}>{b.id}</td>
                                                        <td style={{ ...styles.td, fontWeight: '500' }}>{b.title}</td>
                                                        <td style={styles.td}>{b.author}</td>
                                                        <td style={styles.td}>{b.publicationYear}</td>
                                                        <td style={styles.td}>
                                                            <span style={{
                                                                backgroundColor: '#f0f9ff',
                                                                color: '#0369a1',
                                                                padding: '2px 8px',
                                                                borderRadius: '12px',
                                                                fontSize: '12px'
                                                            }}>
                                                                {b.genre}
                                                            </span>
                                                        </td>
                                                        <td style={styles.td}>{b.isbn}</td>
                                                        <td style={styles.td}>
                                                            <span style={{
                                                                fontWeight: '600',
                                                                color: (b.availableCopies ?? b.copies ?? 0) > 0 ? '#059669' : '#dc2626'
                                                            }}>
                                                                {b.availableCopies ?? b.copies ?? 0}
                                                            </span>
                                                        </td>
                                                        <td style={styles.td}>
                                                            <div style={{ display: 'flex', gap: '6px' }}>
                                                                <button
                                                                    onClick={() => handleEditBook(b)}
                                                                    style={{ ...styles.buttonSecondary, backgroundColor: '#7c3aed' }}
                                                                    onMouseEnter={e => e.target.style.backgroundColor = '#6d28d9'}
                                                                    onMouseLeave={e => e.target.style.backgroundColor = '#7c3aed'}
                                                                >
                                                                    ✏️ Edit
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteBook(b.id)}
                                                                    disabled={loading}
                                                                    style={styles.buttonDanger}
                                                                    onMouseEnter={e => !loading && (e.target.style.backgroundColor = '#dc2626')}
                                                                    onMouseLeave={e => !loading && (e.target.style.backgroundColor = '#ef4444')}
                                                                >
                                                                    🗑️ Delete
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ));
                                            })()}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                <div style={styles.pagination}>
                                    {(() => {
                                        const filteredCount = books.filter(b =>
                                            b.title.toLowerCase().includes(search.toLowerCase()) ||
                                            b.author.toLowerCase().includes(search.toLowerCase())
                                        ).length;
                                        const totalPages = Math.ceil(filteredCount / booksPerPage);
                                        const maxButtons = 10;
                                        let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
                                        let endPage = Math.min(totalPages, startPage + maxButtons - 1);
                                        if (endPage - startPage < maxButtons - 1) {
                                            startPage = Math.max(1, endPage - maxButtons + 1);
                                        }
                                        const buttons = [];
                                        if (startPage > 1) {
                                            buttons.push(<span key="start-ellipsis" style={{ color: '#64748b' }}>...</span>);
                                        }
                                        for (let i = startPage; i <= endPage; i++) {
                                            buttons.push(
                                                <button
                                                    key={i}
                                                    onClick={() => setCurrentPage(i)}
                                                    style={currentPage === i ? styles.activePageButton : styles.pageButton}
                                                >
                                                    {i}
                                                </button>
                                            );
                                        }
                                        if (endPage < totalPages) {
                                            buttons.push(<span key="end-ellipsis" style={{ color: '#64748b' }}>...</span>);
                                        }
                                        return buttons;
                                    })()}
                                </div>
                            </div>

                            {/* All Members */}
                            <div style={styles.card}>
                                <h2 style={styles.sectionTitle}>👥 Library Members</h2>
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={styles.table}>
                                        <thead>
                                            <tr>
                                                <th style={styles.th}>ID</th>
                                                <th style={styles.th}>Name</th>
                                                <th style={styles.th}>Username</th>
                                                <th style={styles.th}>Email</th>
                                                <th style={styles.th}>Phone</th>
                                                <th style={styles.th}>Role</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.map(u => (
                                                <tr key={u.id}>
                                                    <td style={styles.td}>{u.id}</td>
                                                    <td style={{ ...styles.td, fontWeight: '500' }}>{u.name}</td>
                                                    <td style={styles.td}>{u.username}</td>
                                                    <td style={styles.td}>{u.email}</td>
                                                    <td style={styles.td}>{u.phoneNumber}</td>
                                                    <td style={styles.td}>
                                                        <span style={{
                                                            ...styles.badge,
                                                            backgroundColor: u.role === 'LIBRARIAN' ? '#ede9fe' : '#dcfce7',
                                                            color: u.role === 'LIBRARIAN' ? '#7c3aed' : '#166534'
                                                        }}>
                                                            {u.role === 'LIBRARIAN' ? '👨‍💼 LIBRARIAN' : '📖 MEMBER'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* All Borrowings */}
                            <div style={styles.card}>
                                <h2 style={styles.sectionTitle}>📚 All Borrowings</h2>
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={styles.table}>
                                        <thead>
                                            <tr>
                                                <th style={styles.th}>ID</th>
                                                <th style={styles.th}>Member</th>
                                                <th style={styles.th}>Member ID</th>
                                                <th style={styles.th}>Book</th>
                                                <th style={styles.th}>Borrow Date</th>
                                                <th style={styles.th}>Due Date</th>
                                                <th style={styles.th}>Return Date</th>
                                                <th style={styles.th}>Fine (₹5/day)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {borrowings.map(b => {
                                                // Prefer b.member if present, else fallback to userId
                                                const memberObj = b.member || users.find(u => u.id === b.userId);
                                                const memberName = memberObj ? (memberObj.username || memberObj.name || memberObj.email || memberObj.id) : (b.userId || b.memberId || '-');
                                                const memberId = memberObj ? memberObj.id : (b.userId || b.memberId || '-');
                                                let fine = fines[b.id];
                                                let daysOverdue = 0;
                                                if (b.dueDate && !b.returnDate && new Date(b.dueDate) < new Date()) {
                                                    daysOverdue = Math.max(0, Math.floor((new Date() - new Date(b.dueDate)) / (1000 * 60 * 60 * 24)));
                                                    fine = daysOverdue > 0 ? daysOverdue * 5 : 0;
                                                }
                                                return (
                                                    <tr key={b.id} style={{
                                                        backgroundColor: b.returnDate ? '#f8fafc' : (daysOverdue > 0 ? '#fef2f2' : 'white')
                                                    }}>
                                                        <td style={styles.td}>{b.id}</td>
                                                        <td style={{ ...styles.td, fontWeight: '500' }}>{memberName}</td>
                                                        <td style={styles.td}>#{memberId}</td>
                                                        <td style={styles.td}>{books.find(book => book.id === b.bookId)?.title || `Book #${b.bookId}`}</td>
                                                        <td style={styles.td}>{b.borrowDate}</td>
                                                        <td style={styles.td}>{b.dueDate}</td>
                                                        <td style={styles.td}>
                                                            {b.returnDate ? (
                                                                <span style={{ ...styles.badge, ...styles.badgeSuccess }}>
                                                                    ✅ {b.returnDate}
                                                                </span>
                                                            ) : (
                                                                <span style={{ ...styles.badge, ...styles.badgeOverdue }}>
                                                                    ⏳ Not returned
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td style={styles.td}>
                                                            {fine && fine > 0 ? (
                                                                <span style={{ color: '#dc2626', fontWeight: '600' }}>₹{fine}</span>
                                                            ) : '-'}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* All Audit Logs */}
                            <div style={styles.card}>
                                <h2 style={styles.sectionTitle}>📋 System Audit Trail</h2>
                                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                    {auditLogs.map(log => (
                                        <div key={log.id} style={{
                                            padding: '12px 16px',
                                            backgroundColor: '#f8fafc',
                                            borderRadius: '8px',
                                            marginBottom: '8px',
                                            fontSize: '14px',
                                            borderLeft: '3px solid #3b82f6'
                                        }}>
                                            <div style={{ fontWeight: '500' }}>{log.action} by user #{log.userId}</div>
                                            <div style={{ fontSize: '12px', color: '#64748b' }}>at {log.timestamp}</div>
                                        </div>
                                    ))}
                                    {auditLogs.length === 0 && (
                                        <div style={{
                                            textAlign: 'center',
                                            color: '#64748b',
                                            fontStyle: 'italic',
                                            padding: '40px'
                                        }}>
                                            📝 No audit logs available
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Offline Return Interface */}
                            <div style={styles.card}>
                                <h2 style={styles.sectionTitle}>📤 Offline Book Return</h2>
                                <OfflineReturnForm
                                    users={users}
                                    borrowings={borrowings}
                                    onReturn={async (borrowId) => {
                                        setMessage('');
                                        setLoading(true);
                                        try {
                                            await returnBook(borrowId);
                                        } catch {
                                            setMessage('❌ Return failed');
                                        } finally {
                                            setLoading(false);
                                        }
                                    }}
                                    userQuery={offlineReturnUserQuery}
                                    setUserQuery={setOfflineReturnUserQuery}
                                    selectedUser={offlineReturnSelectedUser}
                                    setSelectedUser={setOfflineReturnSelectedUser}
                                />
                            </div>
                        </>
                    )}
                </>
            )}

            {/* Footer */}
            <div style={{
                marginTop: '40px',
                padding: '20px',
                textAlign: 'center',
                color: '#64748b',
                fontSize: '14px',
                borderTop: '1px solid #e2e8f0'
            }}>
                <p style={{ margin: 0 }}>
                    📚 Library Management System • Built with React & Spring Boot •
                    <span style={{ fontWeight: '500' }}> Professional Edition</span>
                </p>
            </div>
        </div>
    );
}
