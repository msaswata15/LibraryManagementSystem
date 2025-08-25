
// --- OfflineIssueForm component ---
function OfflineIssueForm({ users, books, onIssue }) {
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
    }} style={{display:'flex',gap:8,alignItems:'center',marginBottom:16,position:'relative'}} autoComplete="off">
      <div style={{position:'relative'}}>
        <label>User:<br/>
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
            style={{width:180}}
          />
        </label>
        {showUserSuggestions && userQuery && (
          <ul style={{position:'absolute',zIndex:2,background:'#fff',border:'1px solid #ccc',width:'100%',maxHeight:120,overflowY:'auto',listStyle:'none',margin:0,padding:0}}>
            {filteredUsers.map(u => (
              <li key={u.id} style={{padding:4,cursor:'pointer'}}
                  onMouseDown={() => {
                    setUserQuery(u.username + (u.name ? ` (${u.name})` : ''));
                    setUserId(u.id);
                    setShowUserSuggestions(false);
                  }}>
                {u.username} {u.name && `(${u.name})`}
              </li>
            ))}
            {filteredUsers.length === 0 && <li style={{padding:4}}>No users found</li>}
          </ul>
        )}
      </div>
      <div style={{position:'relative'}}>
        <label>Book:<br/>
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
            style={{width:220}}
          />
        </label>
        {showBookSuggestions && bookQuery && (
          <ul style={{position:'absolute',zIndex:2,background:'#fff',border:'1px solid #ccc',width:'100%',maxHeight:120,overflowY:'auto',listStyle:'none',margin:0,padding:0}}>
            {filteredBooks.map(b => (
              <li key={b.id} style={{padding:4,cursor:'pointer'}}
                  onMouseDown={() => {
                    setBookQuery(b.title + (b.author ? ` (${b.author})` : ''));
                    setBookId(b.id);
                    setShowBookSuggestions(false);
                  }}>
                {b.title} {b.author && `(${b.author})`}
              </li>
            ))}
            {filteredBooks.length === 0 && <li style={{padding:4}}>No books found</li>}
          </ul>
        )}
      </div>
      <button type="submit" disabled={!userId || !bookId}>Issue Book</button>
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
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState('');
  const [editBook, setEditBook] = useState(null);
  // Pagination state for books
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 5;
  const [bookForm, setBookForm] = useState({ title: '', author: '', isbn: '', copies: 1 });
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
      axiosAuth.get(`${API}/users`).then(r => setUsers(r.data)).catch(() => {});
      axiosAuth.get(`${API}/books`).then(r => setBooks(r.data)).catch(() => {});
      
      // Only fetch user-specific data for USER role
      if (user.role === 'USER') {
        axiosAuth.get(`${API}/users/${user.id || 1}/overdue-notifications`).then(r => setOverdues(r.data)).catch(() => {});
        axiosAuth.get(`${API}/books/recommended?userId=${user.id || 1}`).then(r => setRecommendations(r.data)).catch(() => {});
        axiosAuth.get(`${API}/audit-logs/user/${user.id || 1}`).then(r => setAuditLogs(r.data)).catch(() => {});
      }
      // Fetch all pending book requests for librarians
      if (user.role === 'LIBRARIAN') {
        axiosAuth.get(`${API}/api/request-book`).then(r => setRequests(r.data)).catch(() => {});
      }
      // Fetch borrowings for both roles
      axiosAuth.get(`${API}/borrowings`).then(r => setBorrowings(r.data)).catch(() => {});
      // Fines for each borrowing
      borrowings.forEach(b => {
        axiosAuth.get(`${API}/users/borrowing/${b.id}/fine`).then(r => setFines(f => ({ ...f, [b.id]: r.data }))).catch(() => {});
      });
    }
  }, [user, token, borrowings.length]);
  // Book management handlers (librarian)
  const addBook = async e => {
    e.preventDefault();
    setMessage('');
    try {
      await axiosAuth.post(`${API}/books`, bookForm);
      setMessage('Book added!');
      setBookForm({ title: '', author: '', isbn: '', copies: 1 });
      const r = await axiosAuth.get(`${API}/books`);
      setBooks(r.data);
    } catch (err) {
      setMessage('Add book failed');
    }
  };
  const returnBook = async recordId => {
    setMessage('');
    try {
      await axiosAuth.put(`${API}/api/return/${recordId}`);
      setMessage('Book returned!');
      const r = await axiosAuth.get(`${API}/borrowings`);
      setBorrowings(r.data);
    } catch {
      setMessage('Return failed');
    }
  };

  const register = async e => {
    e.preventDefault();
    setMessage('');
    try {
      await axios.post(`${API}/auth/register`, form);
      setMessage('Registered! Logging in...');
      // Auto-login after registration
      await login({ username: form.username, password: form.password, role: form.role });
    } catch (err) {
      setMessage('Registration failed');
    }
  };

  const login = async (creds = loginForm) => {
    setMessage('');
    try {
      const res = await axios.post(`${API}/auth/login`, creds);
      setToken(res.data.token);
      setUser({ 
        id: res.data.id,
        username: res.data.username || creds.username, 
        role: res.data.role || creds.role || form.role 
      });
      setMessage('Logged in!');
    } catch (err) {
      setMessage('Login failed');
    }
  };

  const logout = () => {
    setUser(null);
    setToken('');
    setMessage('Logged out');
  };

  const requestBook = async e => {
    e.preventDefault();
    setMessage('');
    try {
      await axiosAuth.post(`${API}/api/request-book`, bookRequest);
      setMessage('Book requested!');
    } catch (err) {
      setMessage('Request failed');
    }
  };

  const approve = async id => {
    await axiosAuth.put(`${API}/api/request-book/${id}/approve`);
    setMessage('Request approved');
  };
  const reject = async id => {
    await axiosAuth.put(`${API}/api/request-book/${id}/reject`);
    setMessage('Request rejected');
  };


  // Handler for direct book request from table
  const handleRequestBook = async (bookId) => {
    setMessage('');
    try {
      await axiosAuth.post(`${API}/api/request-book`, { bookId, username: user.username });
      setMessage('Book requested!');
  // No GET call, backend does not support GET /api/request-book
    } catch (err) {
      setMessage('Request failed');
    }
  };

  // UI logic for role-based dashboards
  const isLibrarian = user && user.role === 'LIBRARIAN';
  const isUser = user && user.role === 'USER';

  return (
    <div style={{fontFamily:'sans-serif',maxWidth:900,margin:'auto'}}>
      <h1>Library System</h1>
      {message && <div style={{color:message.includes('fail')?'red':'green',marginBottom:8}}>{message}</div>}
      {!user ? (
        <>
          <h2>Register</h2>
          <form onSubmit={register} style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            <input required placeholder="Name" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} />
            <input required placeholder="Username" value={form.username} onChange={e=>setForm(f=>({...f,username:e.target.value}))} />
            <input required placeholder="Password" type="password" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} />
            <input required placeholder="Email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} />
            <input required placeholder="Phone" value={form.phoneNumber} onChange={e=>setForm(f=>({...f,phoneNumber:e.target.value}))} />
            <select value={form.role} onChange={e=>setForm(f=>({...f,role:e.target.value}))}>
              <option value="USER">USER</option>
              <option value="LIBRARIAN">LIBRARIAN</option>
            </select>
            <button type="submit">Register</button>
          </form>
          <h2>Login</h2>
          <form onSubmit={e=>{e.preventDefault();login();}} style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            <input required placeholder="Username" value={loginForm.username} onChange={e=>setLoginForm(f=>({...f,username:e.target.value}))} />
            <input required placeholder="Password" type="password" value={loginForm.password} onChange={e=>setLoginForm(f=>({...f,password:e.target.value}))} />
            <button type="submit">Login</button>
          </form>
        </>
      ) : (
        <>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div>Welcome, {user.username} ({user.role || form.role})</div>
            <button onClick={logout}>Logout</button>
          </div>
          {/* USER DASHBOARD */}
          {isUser && (
            <>
              <h2>Available Books</h2>
              <input placeholder="Search books..." value={search} onChange={e=>{setSearch(e.target.value); setCurrentPage(1);}} style={{marginBottom:8}} />
              <table border="1" cellPadding="4" style={{width:'100%'}}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Available Copies</th>
                    <th>Request</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const filtered = books.filter(b => b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase()));
                    const start = (currentPage - 1) * booksPerPage;
                    const end = start + booksPerPage;
                    return filtered.slice(start, end).map(b => {
                      const userRequest = requests.find(r => r.bookId === b.id && r.username === user.username && r.status === 'PENDING');
                      const approvedRequest = requests.find(r => r.bookId === b.id && r.username === user.username && r.status === 'APPROVED');
                      const alreadyBorrowed = borrowings.some(br => br.bookId === b.id && br.userId === user.id && !br.returnDate);
                      return (
                        <tr key={b.id}>
                          <td>{b.id}</td>
                          <td>{b.title}</td>
                          <td>{b.author}</td>
                          <td>{b.availableCopies ?? b.copies ?? ''}</td>
                          <td>
                            {!userRequest && !approvedRequest && !alreadyBorrowed && (
                              <button onClick={() => handleRequestBook(b.id)}>Request</button>
                            )}
                            {userRequest && <span>Requested</span>}
                            {approvedRequest && !alreadyBorrowed && (
                              <button onClick={() => borrowBook(b.id)}>Borrow</button>
                            )}
                            {alreadyBorrowed && <span>Borrowed</span>}
                          </td>
                        </tr>
                      );
                    });
                  })()}
                </tbody>
              </table>
              {/* Pagination */}
              <div style={{marginTop:8}}>
                {(() => {
                  const filteredCount = books.filter(b => b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase())).length;
                  const totalPages = Math.ceil(filteredCount / booksPerPage);
                  const maxButtons = 10;
                  let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
                  let endPage = Math.min(totalPages, startPage + maxButtons - 1);
                  if (endPage - startPage < maxButtons - 1) {
                    startPage = Math.max(1, endPage - maxButtons + 1);
                  }
                  const buttons = [];
                  if (startPage > 1) {
                    buttons.push(<span key="start-ellipsis">...</span>);
                  }
                  for (let i = startPage; i <= endPage; i++) {
                    buttons.push(
                      <button key={i} onClick={()=>setCurrentPage(i)} style={{fontWeight:currentPage===i?'bold':'normal'}}>{i}</button>
                    );
                  }
                  if (endPage < totalPages) {
                    buttons.push(<span key="end-ellipsis">...</span>);
                  }
                  return buttons;
                })()}
              </div>

              {/* User Borrowings */}
              <h2>Your Borrowings</h2>
              <table border="1" cellPadding="4" style={{width:'100%'}}>
                <thead>
                  <tr>
                    <th>Book</th>
                    <th>Borrow Date</th>
                    <th>Due Date</th>
                    <th>Return Date</th>
                    <th>Fine</th>
                    <th>Return</th>
                  </tr>
                </thead>
                <tbody>
                  {borrowings.filter(b=>(b.userId===user.id || b.memberId===user.id || (b.member && b.member.id===user.id))).map(b=>(
                    <tr key={b.id} style={b.returnDate ? {} : (b.dueDate && new Date(b.dueDate)<new Date() ? {background:'#ffe0e0'} : {})}>
                      <td>{books.find(book=>book.id===b.bookId)?.title || b.bookId}</td>
                      <td>{b.borrowDate}</td>
                      <td>{b.dueDate}</td>
                      <td>{b.returnDate || '-'}</td>
                      <td>{fines[b.id] || '-'}</td>
                      <td>{!b.returnDate && <button onClick={()=>returnBook(b.id)}>Return</button>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Overdue Books */}
              <h3>Overdue Books</h3>
              <ul>
                {overdues.map((o,i)=>(<li key={i}>{o}</li>))}
                {overdues.length===0 && <li>None</li>}
              </ul>

              {/* Recommendations */}
              <h3>Recommended Books</h3>
              <ul>
                {recommendations.popularRecommendations?.map((b,i)=>(<li key={b.id || i}>{b.title} by {b.author}</li>))}
                {recommendations.genreRecommendations?.map((b,i)=>(<li key={b.id || i}>{b.title} by {b.author}</li>))}
                {(!recommendations.popularRecommendations?.length && !recommendations.genreRecommendations?.length) && <li>No recommendations</li>}
              </ul>

              {/* User Audit Logs */}
              <h3>Your Audit Trail</h3>
              <ul>
                {auditLogs.map(log => <li key={log.id}>{log.action} at {log.timestamp}</li>)}
                {auditLogs.length===0 && <li>No audit logs</li>}
              </ul>
            </>
          )}
          {/* LIBRARIAN DASHBOARD */}
          {isLibrarian && (
            <>
              {/* Book Requests Table */}
              <h2>Pending Book Requests</h2>
              <table border="1" cellPadding="4" style={{width:'100%', marginBottom:16}}>
                <thead>
                  <tr>
                    <th>Request ID</th>
                    <th>Book ID</th>
                    <th>Username</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.length === 0 ? (
                    <tr><td colSpan={5}>No pending requests</td></tr>
                  ) : (
                    requests.map(r => (
                      <tr key={r.id}>
                        <td>{r.id}</td>
                        <td>{r.bookId}</td>
                        <td>{r.username}</td>
                        <td>{r.status}</td>
                        <td>
                          {r.status === 'PENDING' && (
                            <button onClick={async () => {
                              setMessage('');
                              try {
                                await axiosAuth.put(`${API}/api/request-book/${r.id}/approve`);
                                setMessage('Request approved');
                                // Refresh requests after approval
                                const resp = await axiosAuth.get(`${API}/api/request-book`);
                                setRequests(resp.data);
                              } catch (err) {
                                setMessage('Approve failed');
                              }
                            }}>Approve</button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* Offline Issue Interface */}
              <h2>Offline Issue Book</h2>
              <OfflineIssueForm users={users} books={books} onIssue={async (userId, bookId) => {
                setMessage('');
                const token = window.localStorage.getItem('jwt_token');
                console.log('DEBUG: JWT token for offline issue:', token);
                try {
                  // Only send userId and bookId; backend sets borrowDate and dueDate
                  const resp = await axiosAuth.post(`${API}/borrowings`, { userId, bookId });
                  console.log('DEBUG: axiosAuth POST /borrowings response', resp);
                  setMessage('Book issued successfully!');
                } catch (err) {
                  console.error('DEBUG: axiosAuth POST /borrowings error', err);
                  setMessage('Offline issue failed');
                }
              }} />

              <h2>Book Management</h2>
              <form onSubmit={addBook} style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:8}}>
                <input required placeholder="Title" value={bookForm.title} onChange={e=>setBookForm(f=>({...f,title:e.target.value}))} />
                <input required placeholder="Author" value={bookForm.author} onChange={e=>setBookForm(f=>({...f,author:e.target.value}))} />
                <input required placeholder="ISBN" value={bookForm.isbn} onChange={e=>setBookForm(f=>({...f,isbn:e.target.value}))} />
                <input required type="number" min={1} placeholder="Copies" value={bookForm.copies} onChange={e=>setBookForm(f=>({...f,copies:parseInt(e.target.value)}))} />
                <button type="submit">Add Book</button>
              </form>
              {/* Book Table for Librarian */}
              <table border="1" cellPadding="4" style={{width:'100%'}}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Available Copies</th>
                    <th>Edit</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const filtered = books.filter(b => b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase()));
                    const start = (currentPage - 1) * booksPerPage;
                    const end = start + booksPerPage;
                    return filtered.slice(start, end).map(b => (
                      <tr key={b.id}>
                        <td>{b.id}</td>
                        <td>{b.title}</td>
                        <td>{b.author}</td>
                        <td>{b.availableCopies ?? b.copies ?? ''}</td>
                        <td><button /* onClick={...} */>Edit</button></td>
                        <td><button /* onClick={...} */>Delete</button></td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
              {/* Pagination */}
              <div style={{marginTop:8}}>
                {(() => {
                  const filteredCount = books.filter(b => b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase())).length;
                  const totalPages = Math.ceil(filteredCount / booksPerPage);
                  const maxButtons = 10;
                  let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
                  let endPage = Math.min(totalPages, startPage + maxButtons - 1);
                  if (endPage - startPage < maxButtons - 1) {
                    startPage = Math.max(1, endPage - maxButtons + 1);
                  }
                  const buttons = [];
                  if (startPage > 1) {
                    buttons.push(<span key="start-ellipsis">...</span>);
                  }
                  for (let i = startPage; i <= endPage; i++) {
                    buttons.push(
                      <button key={i} onClick={()=>setCurrentPage(i)} style={{fontWeight:currentPage===i?'bold':'normal'}}>{i}</button>
                    );
                  }
                  if (endPage < totalPages) {
                    buttons.push(<span key="end-ellipsis">...</span>);
                  }
                  return buttons;
                })()}
              </div>

              {/* All Members */}
              <h2>All Members</h2>
              <table border="1" cellPadding="4" style={{width:'100%'}}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u=>(
                    <tr key={u.id}>
                      <td>{u.id}</td>
                      <td>{u.name}</td>
                      <td>{u.username}</td>
                      <td>{u.email}</td>
                      <td>{u.phoneNumber}</td>
                      <td>{u.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* All Borrowings */}
              <h2>All Borrowings</h2>
              <table border="1" cellPadding="4" style={{width:'100%'}}>
                <thead>
                  <tr>
                    <th>Member</th>
                    <th>Member ID</th>
                    <th>Book</th>
                    <th>Borrow Date</th>
                    <th>Due Date</th>
                    <th>Return Date</th>
                  </tr>
                </thead>
                <tbody>
                  {borrowings.map(b=>{
                    // Prefer b.member if present, else fallback to userId
                    const memberObj = b.member || users.find(u=>u.id===b.userId);
                    const memberName = memberObj ? (memberObj.username || memberObj.name || memberObj.email || memberObj.id) : (b.userId || b.memberId || '-');
                    const memberId = memberObj ? memberObj.id : (b.userId || b.memberId || '-');
                    return (
                      <tr key={b.id}>
                        <td>{memberName}</td>
                        <td>{memberId}</td>
                        <td>{books.find(book=>book.id===b.bookId)?.title || b.bookId}</td>
                        <td>{b.borrowDate}</td>
                        <td>{b.dueDate}</td>
                        <td>{b.returnDate || '-'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* All Audit Logs */}
              <h2>Audit Trail (All Users)</h2>
              <ul>
                {auditLogs.map(log => <li key={log.id}>{log.action} by user {log.userId} at {log.timestamp}</li>)}
                {auditLogs.length===0 && <li>No audit logs</li>}
              </ul>
            </>
          )}
        </>
      )}
    </div>
  );
}
