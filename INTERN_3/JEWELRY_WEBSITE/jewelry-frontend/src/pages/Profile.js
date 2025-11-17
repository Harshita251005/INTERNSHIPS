import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Orders.css';

export default function Profile() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [avatarFile, setAvatarFile] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '', address: {} });
  const [pwd, setPwd] = useState({ currentPassword: '', newPassword: '' });

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/users/profile', {
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed');
      setUser(data);
      setForm({ name: data.name || '', phone: data.phone || '', address: data.address || {} });
    } catch (err) {
      console.error('Profile fetch error', err);
    } finally { setLoading(false); }
  };

  const handleFileChange = (e) => {
    setAvatarFile(e.target.files[0]);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('phone', form.phone);
    formData.append('address', JSON.stringify(form.address || {}));
    if (avatarFile) formData.append('avatar', avatarFile);

    try {
      const res = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Update failed');
      alert('Profile updated');
      fetchProfile();
    } catch (err) {
      console.error(err);
      alert('Could not update profile: ' + err.message);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/users/profile/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify(pwd)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Password change failed');
      alert('Password updated');
      setPwd({ currentPassword: '', newPassword: '' });
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  if (loading) return <div className="orders-loading">Loading profile...</div>;

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h1>👤 My Profile</h1>
        <p>Manage your account details</p>
      </div>

      <div className="order-card">
        <div style={{ padding: 20 }}>
          <form onSubmit={handleUpdate}>
            <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <label>Name</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />

                <label>Phone</label>
                <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />

                <label>Address - line</label>
                <input value={form.address.address || ''} onChange={e => setForm({ ...form, address: { ...form.address, address: e.target.value } })} />

                <label>City</label>
                <input value={form.address.city || ''} onChange={e => setForm({ ...form, address: { ...form.address, city: e.target.value } })} />

                <label>Postal Code</label>
                <input value={form.address.postalCode || ''} onChange={e => setForm({ ...form, address: { ...form.address, postalCode: e.target.value } })} />

                <label>Country</label>
                <input value={form.address.country || ''} onChange={e => setForm({ ...form, address: { ...form.address, country: e.target.value } })} />

                <div style={{ marginTop: 10 }}>
                  <button className="btn btn-primary" type="submit">Update Profile</button>
                </div>
              </div>

              <div style={{ width: 260 }}>
                <div style={{ marginBottom: 12 }}>
                  <img src={user.avatarUrl || 'https://via.placeholder.com/200x200?text=Avatar'} alt="avatar" style={{ width: '200px', height: '200px', objectFit: 'cover', borderRadius: 8 }} />
                </div>
                <div>
                  <label>Change Avatar</label>
                  <input type="file" accept="image/*" onChange={handleFileChange} />
                </div>
              </div>
            </div>
          </form>

          <hr />

          <h3>Change Password</h3>
          <form onSubmit={handleChangePassword}>
            <label>Current Password</label>
            <input type="password" value={pwd.currentPassword} onChange={e => setPwd({ ...pwd, currentPassword: e.target.value })} />
            <label>New Password</label>
            <input type="password" value={pwd.newPassword} onChange={e => setPwd({ ...pwd, newPassword: e.target.value })} />
            <div style={{ marginTop: 10 }}>
              <button className="btn btn-primary" type="submit">Change Password</button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
