import React, { useContext, useState } from 'react'
import { motion } from 'framer-motion'
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
    <div className='min-h-screen flex items-center justify-center p-4 relative overflow-hidden font-outfit'>
      {/* Background Glow - Fixed to match Login */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] -z-10 animate-pulse pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className='w-full max-w-4xl bg-white/5 backdrop-blur-2xl text-white border border-white/10 flex max-md:flex-col-reverse rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden relative z-10 transition-all duration-500 hover:shadow-[0_0_80px_rgba(124,58,237,0.15)]'
      >

        {/* Form Section */}
        <form onSubmit={handleSubmit} className='flex flex-col gap-6 p-8 md:p-12 flex-1 relative'>
          {/* Subtle texture overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>

          <div className='relative flex items-center justify-between mb-4 z-10'>
            <h3 className='text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-200 to-indigo-200 tracking-tight'>Edit Profile</h3>
            <div onClick={() => navigate('/')} className='text-gray-400 hover:text-white cursor-pointer text-sm font-medium transition-colors px-3 py-1 hover:bg-white/10 rounded-full'>Cancel</div>
          </div>

          <div className='space-y-5 relative z-10'>
            <div className='flex flex-col gap-2'>
              <label className="text-xs font-bold text-gray-400 ml-1 uppercase tracking-widest">Display Name</label>
              <div className='flex items-center gap-3 p-4 bg-black/20 border border-white/5 rounded-2xl focus-within:border-violet-500/50 focus-within:bg-black/40 focus-within:shadow-[0_0_20px_rgba(124,58,237,0.1)] transition-all duration-300'>
                <img src={assets.logo_icon} className='w-5 h-5 opacity-50' alt="User" />
                <input
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  type="text"
                  required
                  placeholder='Your name'
                  className='bg-transparent border-none outline-none flex-1 text-white placeholder-gray-500 text-base font-medium'
                />
              </div>
            </div>

            <div className='flex flex-col gap-2'>
              <label className="text-xs font-bold text-gray-400 ml-1 uppercase tracking-widest">Bio</label>
              <textarea
                onChange={(e) => setBio(e.target.value)}
                value={bio}
                placeholder='Tell us about yourself...'
                required
                rows={4}
                className='w-full p-4 bg-black/20 border border-white/5 rounded-2xl focus:outline-none focus:ring-1 focus:ring-violet-500/50 focus:bg-black/40 transition-all duration-300 text-base font-medium resize-none placeholder-gray-500 text-white leading-relaxed custom-scrollbar'
              ></textarea>
            </div>
          </div>

          <button type='submit' className='relative z-10 mt-6 bg-gradient-to-r from-violet-600 to-indigo-600 text-white p-4 rounded-xl font-bold shadow-lg hover:shadow-[0_0_30px_rgba(124,58,237,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 uppercase tracking-wide text-sm'>
            Save Changes
          </button>
        </form>

        {/* Image Section */}
        <div className="flex flex-col items-center justify-center gap-6 p-8 md:p-12 bg-black/20 border-l border-white/5 relative overflow-hidden min-w-[320px]">
          {/* Decorative bg element */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-900/10 to-transparent pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/20 blur-[60px] rounded-full pointer-events-none"></div>

          <div className="relative group z-10">
            <div className="absolute inset-0 bg-violet-500 rounded-full blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
            <img
              className={`w-40 h-40 md:w-48 md:h-48 rounded-full object-cover border-4 border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.3)] transition-all duration-500 group-hover:scale-105 group-hover:border-violet-500/40 relative z-10`}
              src={selectedImg ? URL.createObjectURL(selectedImg) : authUser?.profilePic || assets.avatar_icon}
              alt=""
            />
            <label htmlFor='avatar' className='absolute bottom-2 right-2 p-3.5 bg-violet-600 hover:bg-violet-500 rounded-full cursor-pointer shadow-lg transition-all hover:scale-110 active:scale-90 z-20 border-4 border-[#1a1a1a]'>
              <img src={assets.logo_icon} className="w-5 h-5 filter brightness-0 invert" alt="Upload" />
              <input onChange={(e) => setSelectedImg(e.target.files[0])} type="file" id='avatar' accept='.png, .jpg, .jpeg' hidden />
            </label>
          </div>

          <div className='flex flex-col items-center gap-1.5 z-10 text-center'>
            <p className='text-xl font-bold text-white'>{authUser.fullName}</p>
            <p className='text-sm text-violet-300 bg-violet-500/10 px-4 py-1.5 rounded-full border border-violet-500/20 font-medium tracking-wide'>@{authUser.username || 'user'}</p>
            <p className='text-xs text-gray-400 mt-2 font-mono'>{authUser.email}</p>
          </div>

          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
                deleteAccount();
              }
            }}
            className='mt-auto text-red-400 hover:text-red-300 text-xs font-bold flex items-center gap-2 px-5 py-2.5 hover:bg-red-500/10 rounded-xl transition-all z-10 uppercase tracking-widest'
          >
            <span>Delete Account</span>
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default ProfilePage
