import React, { useContext, useState } from 'react'
import assets from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const ProfilePage = () => {

  const { authUser, updateProfile, deleteAccount } = useContext(AuthContext)

  const [selectedImg, setSelectedImg] = useState(null)
  const navigate = useNavigate();
  const [name, setName] = useState(authUser.fullName)
  const [bio, setBio] = useState(authUser.bio)

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedImg) {
      await updateProfile({ fullName: name, bio })
      navigate('/');
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(selectedImg);
    reader.onload = async () => {
      const base64Image = reader.result;
      await updateProfile({ profilePic: base64Image, fullName: name, bio });
      navigate('/');
    }
  }


  return (
    <div className='min-h-screen flex items-center justify-center p-4 relative overflow-hidden'>
      {/* Background Glow - Fixed to match Login */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[100px] -z-10 animate-pulse pointer-events-none"></div>

      <div className='w-full max-w-4xl bg-black/40 backdrop-blur-2xl text-white border border-white/10 flex max-md:flex-col-reverse rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden animate-fade-in-up relative z-10'>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className='flex flex-col gap-6 p-8 md:p-12 flex-1'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-purple-400'>Edit Profile</h3>
            <div onClick={() => navigate('/')} className='text-gray-400 hover:text-white cursor-pointer text-sm font-medium transition-colors'>Cancel</div>
          </div>

          <div className='space-y-4'>
            <div className='flex flex-col gap-2'>
              <label className="text-xs font-medium text-gray-400 ml-1 uppercase tracking-wide">Display Name</label>
              <div className='flex items-center gap-3 p-4 bg-black/30 border border-white/10 rounded-2xl focus-within:border-violet-500/50 focus-within:bg-black/50 transition-all'>
                <img src={assets.logo_icon} className='w-5 h-5 opacity-50' alt="User" />
                <input
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  type="text"
                  required
                  placeholder='Your name'
                  className='bg-transparent border-none outline-none flex-1 text-white placeholder-gray-500 text-sm'
                />
              </div>
            </div>

            <div className='flex flex-col gap-2'>
              <label className="text-xs font-medium text-gray-400 ml-1 uppercase tracking-wide">Bio</label>
              <textarea
                onChange={(e) => setBio(e.target.value)}
                value={bio}
                placeholder='Tell us about yourself...'
                required
                rows={4}
                className='w-full p-4 bg-black/30 border border-white/10 rounded-2xl focus:outline-none focus:ring-1 focus:ring-violet-500/50 focus:bg-black/50 transition-all text-sm resize-none placeholder-gray-500 text-white'
              ></textarea>
            </div>
          </div>

          <button type='submit' className='mt-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white p-4 rounded-xl font-semibold shadow-lg hover:shadow-violet-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300'>
            Save Changes
          </button>
        </form>

        {/* Image Section */}
        <div className="flex flex-col items-center justify-center gap-6 p-8 md:p-12 bg-white/5 border-l border-white/5 relative">
          {/* Decorative bg element */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 pointer-events-none"></div>

          <div className="relative group z-10">
            <img
              className={`w-40 h-40 md:w-48 md:h-48 rounded-full object-cover border-4 border-white/10 shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:border-violet-500/30`}
              src={selectedImg ? URL.createObjectURL(selectedImg) : authUser?.profilePic || assets.avatar_icon}
              alt=""
            />
            <label htmlFor='avatar' className='absolute bottom-2 right-2 p-3 bg-violet-600 hover:bg-violet-500 rounded-full cursor-pointer shadow-lg transition-all hover:scale-110 active:scale-90'>
              <img src={assets.logo_icon} className="w-5 h-5 filter brightness-0 invert" alt="Upload" />
              <input onChange={(e) => setSelectedImg(e.target.files[0])} type="file" id='avatar' accept='.png, .jpg, .jpeg' hidden />
            </label>
          </div>

          <div className='flex flex-col items-center gap-1 z-10'>
            <p className='text-lg font-semibold text-white'>{authUser.fullName}</p>
            <p className='text-sm text-violet-300 bg-violet-500/10 px-3 py-1 rounded-full border border-violet-500/20'>@{authUser.username || 'user'}</p>
            <p className='text-xs text-gray-500 mt-1'>{authUser.email}</p>
          </div>

          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
                deleteAccount();
              }
            }}
            className='mt-auto text-red-400 hover:text-red-300 text-xs font-medium flex items-center gap-2 px-4 py-2 hover:bg-red-500/10 rounded-lg transition-all z-10'
          >
            <span>Delete Account</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
