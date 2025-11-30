import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { userAPI, uploadAPI } from '../../utils/api';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const ShopkeeperProfile = () => {
  const { user: authUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(null); // 'profileImage' or 'upiQrCode' or null
  const [activeTab, setActiveTab] = useState('details'); // details, security, payment
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    profileImage: '',
    upiQrCode: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await userAPI.getProfile();
      const userData = response.data.data.user;
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        address: userData.address || '',
        profileImage: userData.profileImage || '',
        upiQrCode: userData.upiQrCode || '',
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size too large. Max 5MB allowed.');
      return;
    }

    const uploadData = new FormData();
    uploadData.append('image', file);

    setUploading(field);
    try {
      const response = await uploadAPI.uploadImage(uploadData);
      setFormData(prev => ({ ...prev, [field]: response.data.data.imageUrl }));
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(null);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await userAPI.updateProfile(formData);
      toast.success('Profile updated successfully');
      
      // Update user in context and localStorage
      if (response.data?.data?.user) {
        const updatedUser = response.data.data.user;
        // Update localStorage
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        const mergedUser = { ...currentUser, ...updatedUser };
        localStorage.setItem('user', JSON.stringify(mergedUser));
        
        // Optionally refresh the profile data
        await fetchProfile();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    try {
      await userAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success('Password changed successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Password change failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">My Shop Profile</h1>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b overflow-x-auto">
            <button
              className={`flex-1 py-4 px-6 text-center font-medium transition whitespace-nowrap ${
                activeTab === 'details'
                  ? 'text-gold-600 border-b-2 border-gold-500 bg-gold-50'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('details')}
            >
              Shop Details
            </button>
            <button
              className={`flex-1 py-4 px-6 text-center font-medium transition whitespace-nowrap ${
                activeTab === 'payment'
                  ? 'text-gold-600 border-b-2 border-gold-500 bg-gold-50'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('payment')}
            >
              Payment Settings
            </button>
            <button
              className={`flex-1 py-4 px-6 text-center font-medium transition whitespace-nowrap ${
                activeTab === 'security'
                  ? 'text-gold-600 border-b-2 border-gold-500 bg-gold-50'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('security')}
            >
              Security
            </button>
          </div>

          <div className="p-8">
            {activeTab === 'details' && (
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                {/* Profile Image */}
                <div className="flex items-center space-x-6 mb-6">
                  <div className="h-24 w-24 rounded-full bg-gray-200 overflow-hidden border-2 border-gray-100 relative group">
                    {formData.profileImage ? (
                      <img src={formData.profileImage} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-400 text-3xl">
                        🏪
                      </div>
                    )}
                    {uploading === 'profileImage' && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Profile Photo
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'profileImage')}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-gold-50 file:text-gold-700
                        hover:file:bg-gold-100"
                    />
                    <p className="text-xs text-gray-500 mt-1">Upload a new profile photo (Max 5MB)</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Shop Name / Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Shop Address
                    </label>
                    <textarea
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                      rows="3"
                      placeholder="123 Market St, City, Country"
                    ></textarea>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button type="submit" className="btn-primary px-8 py-3">
                    Save Changes
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'payment' && (
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
                  <h3 className="font-bold text-blue-800 mb-2">Payment Configuration</h3>
                  <p className="text-sm text-blue-600">
                    Upload your UPI QR Code here. Customers will scan this code to make payments directly to you.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload UPI QR Code
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'upiQrCode')}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Upload your QR code image (Max 5MB).
                    </p>
                  </div>

                  <div className="flex justify-center">
                    <div className="w-64 h-64 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-gray-50 overflow-hidden relative">
                      {formData.upiQrCode ? (
                        <img src={formData.upiQrCode} alt="QR Code" className="w-full h-full object-contain" />
                      ) : (
                        <div className="text-center p-4">
                          <div className="text-4xl mb-2">📱</div>
                          <p className="text-sm text-gray-500">QR Code Preview</p>
                        </div>
                      )}
                      {uploading === 'upiQrCode' && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button type="submit" className="btn-primary px-8 py-3">
                    Save Payment Settings
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'security' && (
              <form onSubmit={handlePasswordChange} className="max-w-md mx-auto space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                    required
                    minLength={6}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <button type="submit" className="btn-primary px-8 py-3 w-full">
                    Update Password
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopkeeperProfile;
