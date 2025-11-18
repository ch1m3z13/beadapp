'use client';

import React, { useState } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface UserProfileData {
  name: string;
  email: string;
  profileImage: string;
  profileImageAlt: string;
}

interface UserProfileSectionProps {
  userData: UserProfileData;
}

const UserProfileSection = ({ userData }: UserProfileSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: userData.name,
    email: userData.email,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // Mock save functionality
    setIsEditing(false);
    setShowPasswordChange(false);
    setFormData(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));
  };

  const handleImageUpload = () => {
    setIsUploading(true);
    // Mock upload delay
    setTimeout(() => {
      setIsUploading(false);
    }, 2000);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">User Profile</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-primary hover:bg-primary/10 rounded-md transition-smooth"
        >
          <Icon name={isEditing ? "XMarkIcon" : "PencilIcon"} size={16} />
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      <div className="space-y-6">
        {/* Profile Image */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-muted">
              <AppImage
                src={userData.profileImage}
                alt={userData.profileImageAlt}
                className="w-full h-full object-cover"
              />
            </div>
            {isUploading && (
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                <Icon name="ArrowPathIcon" size={20} className="text-white animate-spin" />
              </div>
            )}
          </div>
          {isEditing && (
            <button
              onClick={handleImageUpload}
              disabled={isUploading}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-smooth disabled:opacity-50"
            >
              <Icon name="PhotoIcon" size={16} />
              {isUploading ? 'Uploading...' : 'Change Photo'}
            </button>
          )}
        </div>

        {/* Name Field */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Full Name</label>
          {isEditing ? (
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
              placeholder="Enter your full name"
            />
          ) : (
            <p className="text-foreground">{userData.name}</p>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Email Address</label>
          {isEditing ? (
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full px-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
              placeholder="Enter your email"
            />
          ) : (
            <p className="text-foreground">{userData.email}</p>
          )}
        </div>

        {/* Password Change Section */}
        {isEditing && (
          <div className="space-y-4 pt-4 border-t border-border">
            <button
              onClick={() => setShowPasswordChange(!showPasswordChange)}
              className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-smooth"
            >
              <Icon name={showPasswordChange ? "ChevronUpIcon" : "ChevronDownIcon"} size={16} />
              Change Password
            </button>

            {showPasswordChange && (
              <div className="space-y-4 pl-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Current Password</label>
                  <input
                    type="password"
                    value={formData.currentPassword}
                    onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                    className="w-full px-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                    placeholder="Enter current password"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">New Password</label>
                  <input
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) => handleInputChange('newPassword', e.target.value)}
                    className="w-full px-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                    placeholder="Enter new password"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Confirm New Password</label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="w-full px-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Save Button */}
        {isEditing && (
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-smooth"
            >
              Save Changes
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-6 py-2 bg-muted text-muted-foreground rounded-md hover:bg-muted/80 transition-smooth"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfileSection;