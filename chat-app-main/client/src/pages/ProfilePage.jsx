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
      {/* Background - Fixed to match Theme */}
      <div className="fixed inset-0 bg-[#0f0c29] -z-20"></div>
      <div className="fixed inset-0 bg-gradient-to-tr from-violet-900/20 via-[#302b63] to-[#24243e] -z-20"></div>

      {/* Animated Orbs */}
      <div className="fixed top-[20%] left-[20%] w-[500px] h-[500px] bg-violet-600/30 rounded-full blur-[120px] -z-10 animate-pulse pointer-events-none mix-blend-screen"></div>
      <div className="fixed bottom-[10%] right-[10%] w-[400px] h-[400px] bg-indigo-600/20 rounded-full blur-[100px] -z-10 animate-pulse pointer-events-none mix-blend-screen" style={{ animationDelay: '2s' }}></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className='w-full max-w-5xl bg-white/5 backdrop-blur-3xl text-white border border-white/10 flex max-md:flex-col-reverse rounded-[2rem] shadow-[0_0_80px_rgba(0,0,0,0.6)] overflow-hidden relative z-10'
      >
        {/* Decorative Grid/Glass-shine */}
        <div className="absolute inset-0 bg-[url('/bg-stars.png')] opacity-10 pointer-events-none mix-blend-overlay"></div>
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className='flex flex-col gap-6 p-8 md:p-14 flex-1 relative bg-gradient-to-br from-white/[0.02] to-transparent'>

          <div className='flex items-center justify-between mb-2'>
            <h3 className='text-3xl font-bold text-white tracking-tight flex items-center gap-2'>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Edit Profile</span>
            </h3>
            <button onClick={() => navigate('/')} type="button" className='text-gray-400 hover:text-white text-sm font-medium transition-colors px-4 py-2 hover:bg-white/5 rounded-lg'>
              Cancel
            </button>
          </div>

          <div className='space-y-6'>
            <div className='flex flex-col gap-2'>
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Display Name</label>
              <div className='flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl focus-within:border-violet-500/50 focus-within:bg-white/10 focus-within:shadow-[0_0_30px_rgba(124,58,237,0.1)] transition-all duration-300 group'>
                <div className="p-2 bg-white/5 rounded-lg group-focus-within:bg-violet-500/20 transition-colors">
                  <img src={assets.logo_icon} className='w-4 h-4 opacity-70 group-focus-within:opacity-100' alt="User" />
                </div>
                <input
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  type="text"
                  required
                  placeholder='Your display name'
                  className='bg-transparent border-none outline-none flex-1 text-white placeholder-gray-500 text-lg font-medium'
                />
              </div>
            </div>

            <div className='flex flex-col gap-2'>
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Bio</label>
              <div className="relative group">
                <textarea
                  onChange={(e) => setBio(e.target.value)}
                  value={bio}
                  placeholder='Write something about yourself...'
                  required
                  rows={5}
                  className='w-full p-5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-violet-500/50 focus:bg-white/10 focus:shadow-[0_0_30px_rgba(124,58,237,0.1)] transition-all duration-300 text-base font-medium resize-none placeholder-gray-500 text-gray-200 leading-relaxed custom-scrollbar'
                ></textarea>
                <div className="absolute bottom-4 right-4 text-[10px] text-gray-600 font-mono opacity-0 group-focus-within:opacity-100 transition-opacity">
                  {bio.length} chars
                </div>
              </div>
            </div>
          </div>

          <button type='submit' className='mt-8 bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-bold shadow-[0_10px_40px_-10px_rgba(124,58,237,0.5)] hover:shadow-[0_0_50px_rgba(124,58,237,0.6)] hover:scale-[1.01] active:scale-[0.98] transition-all duration-300 uppercase tracking-wide text-sm flex items-center justify-center gap-2 group border border-white/10'>
            <span>Save Changes</span>
            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse group-hover:scale-150 transition-transform"></div>
          </button>
        </form>

        {/* Image Preview Section */}
        <div className="flex flex-col items-center justify-center gap-8 p-12 bg-black/40 border-l border-white/10 relative overflow-hidden min-w-[380px] backdrop-blur-md">
          {/* Neon Ring Effect */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] border border-violet-500/20 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] border border-indigo-500/10 rounded-full"></div>

          <div className="relative group z-10 cursor-pointer" onClick={() => document.getElementById('avatar').click()}>

            {/* The Glowing Ring */}
            <div className="absolute inset-[-10px] rounded-full border-2 border-transparent bg-gradient-to-b from-violet-500 to-indigo-500 opacity-60 blur-[1px] mask-gradient"></div>
            <div className="absolute inset-[-4px] rounded-full bg-[#1a1a1a] z-0"></div>

            {/* Glow behind image */}
            <div className="absolute inset-0 bg-violet-500 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>

            <img
              className={`w-40 h-40 md:w-48 md:h-48 rounded-full object-cover border-[3px] border-[#1a1a1a] relative z-10 transition-transform duration-500 group-hover:scale-105`}
              src={selectedImg ? URL.createObjectURL(selectedImg) : authUser?.profilePic || assets.avatar_icon}
              alt=""
            />

            <div className='absolute bottom-2 right-2 p-3 bg-white text-violet-600 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all transform group-hover:scale-110 group-hover:rotate-12 z-20'>
              <img src={assets.logo_icon} className="w-5 h-5" alt="Edit" />
            </div>

            <input onChange={(e) => setSelectedImg(e.target.files[0])} type="file" id='avatar' accept='.png, .jpg, .jpeg' hidden />
          </div>

          <div className='flex flex-col items-center gap-2 z-10 text-center'>
            <h2 className='text-3xl font-bold text-white tracking-wide'>{name || authUser.fullName}</h2>
            <div className="flex flex-col items-center gap-0.5">
              <p className='text-sm text-violet-300 font-medium tracking-wide'>@{authUser.username || 'username'}</p>
              <p className='text-xs text-gray-500 font-mono'>{authUser.email}</p>
            </div>
          </div>

          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
                deleteAccount();
              }
            }}
            className='mt-auto text-red-500/70 hover:text-red-400 text-[10px] font-bold flex items-center gap-2 px-6 py-3 rounded-xl transition-all z-10 uppercase tracking-[0.2em] hover:bg-red-500/10'
          >
            Delete Account
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default ProfilePage
