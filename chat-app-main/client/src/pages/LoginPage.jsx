import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import assets from '../assets/assets'
import { AuthContext } from "../../context/AuthContext.jsx"
import { motion } from 'framer-motion'
import AnimatedBackground from '../components/AnimatedBackground'

const LoginPage = () => {

  const [currState, setCurrState] = useState("Sign up")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [bio, setBio] = useState("")

  const { login } = useContext(AuthContext);

  const onSubmitHandler = (e) => {
    e.preventDefault();
    login(currState === "Sign up" ? 'signup' : 'login', { fullName, email, password, bio })
  }

  return (
    <div className='min-h-screen flex items-center justify-center p-6 sm:p-12 relative overflow-hidden font-outfit'>
      <AnimatedBackground />

      <div className="flex items-center justify-center gap-16 xl:gap-32 w-full max-w-7xl z-10">

        {/* ------------ Left Side: 3D Branding (Hidden on mobile) --------------- */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className='hidden lg:flex flex-col items-start gap-6 max-w-md'
        >
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-[2rem] blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl border border-white/20 p-8 rounded-[2.5rem] shadow-2xl"
            >
              <img src={assets.logo_icon} alt="QuickChat Logo" className='w-32 h-32 object-contain drop-shadow-[0_0_25px_rgba(139,92,246,0.5)]' />
            </motion.div>
          </div>

          <div className="space-y-2">
            <h1 className='text-6xl font-extrabold text-white tracking-tight leading-tight'>
              Quick<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">Chat</span>
            </h1>
            <p className="text-xl text-gray-400 font-medium tracking-wide">Connect effortlessly. Experience the future of messaging.</p>
          </div>

          {/* Decorative elements */}
          <div className="flex gap-3 mt-4">
            <div className="w-12 h-1.5 rounded-full bg-violet-600/50"></div>
            <div className="w-4 h-1.5 rounded-full bg-indigo-600/50"></div>
            <div className="w-2 h-1.5 rounded-full bg-white/20"></div>
          </div>
        </motion.div>

        {/* ------------ Right Side: Glassmorphism Form --------------- */}
        <motion.form
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          onSubmit={onSubmitHandler}
          className='w-full max-w-[440px] bg-[#1a1a1a]/60 backdrop-blur-3xl border border-white/10 p-8 sm:p-10 flex flex-col gap-6 rounded-[2.5rem] shadow-[0_0_60px_-15px_rgba(0,0,0,0.6)] relative overflow-hidden'
        >
          {/* Neon Glow Lines */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent"></div>
          <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>

          <div className='flex flex-col gap-1 mb-2'>
            <h2 className='font-bold text-3xl tracking-tight text-white'>
              {currState === "Sign up" ? "Create Account" : "Welcome Back"}
            </h2>
            <p className='text-gray-400 text-sm font-medium'>
              {currState === "Sign up" ? "Join our community today" : "Login to stay connected"}
            </p>
          </div>

          {currState === "Sign up" && (
            <div className='flex flex-col gap-1.5'>
              <label className='text-[11px] font-bold text-gray-400 ml-1 uppercase tracking-widest'>Full Name</label>
              <div className="relative group">
                <input
                  onChange={(e) => setFullName(e.target.value)}
                  value={fullName}
                  type="text"
                  className='w-full p-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-violet-500/50 focus:bg-white/10 focus:shadow-[0_0_20px_rgba(124,58,237,0.15)] transition-all placeholder:text-gray-600 text-white font-medium'
                  placeholder='Enter your name'
                  required
                />
              </div>
            </div>
          )}

          <div className='flex flex-col gap-1.5'>
            <label className='text-[11px] font-bold text-gray-400 ml-1 uppercase tracking-widest'>Email Address</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder='name@example.com'
              required
              className='w-full p-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-violet-500/50 focus:bg-white/10 focus:shadow-[0_0_20px_rgba(124,58,237,0.15)] transition-all placeholder:text-gray-600 text-white font-medium'
            />
          </div>

          <div className='flex flex-col gap-1.5'>
            <label className='text-[11px] font-bold text-gray-400 ml-1 uppercase tracking-widest'>Password</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder='••••••••'
              required
              className='w-full p-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-violet-500/50 focus:bg-white/10 focus:shadow-[0_0_20px_rgba(124,58,237,0.15)] transition-all placeholder:text-gray-600 text-white font-medium'
            />
          </div>

          {currState === "Sign up" && (
            <div className='flex flex-col gap-1.5'>
              <label className='text-[11px] font-bold text-gray-400 ml-1 uppercase tracking-widest'>Short Bio</label>
              <div className="relative">
                <textarea
                  onChange={(e) => setBio(e.target.value)}
                  value={bio}
                  rows={2}
                  className='w-full p-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-violet-500/50 focus:bg-white/10 focus:shadow-[0_0_20px_rgba(124,58,237,0.15)] transition-all placeholder:text-gray-600 text-white font-medium resize-none custom-scrollbar'
                  placeholder="Tell us a bit about yourself..."
                ></textarea>
              </div>
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(124, 58, 237, 0.5)" }}
            whileTap={{ scale: 0.98 }}
            type='submit'
            className='mt-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-none text-sm font-bold py-4 rounded-xl cursor-pointer transition-all duration-300 shadow-xl uppercase tracking-wide'
          >
            {currState === 'Sign up' ? 'Sign Up' : "Sign In"}
          </motion.button>

          <div className='flex items-start gap-2.5 px-1'>
            <input
              type="checkbox"
              className='mt-0.5 w-4 h-4 rounded border-white/20 bg-white/5 text-violet-600 focus:ring-violet-500 cursor-pointer accent-violet-600'
              id="terms"
              required
            />
            <label htmlFor="terms" className='text-xs text-gray-400 leading-snug cursor-pointer select-none'>
              I agree to the <span className='text-violet-400 hover:text-violet-300 underline underline-offset-2'>Terms of Use</span> & <span className='text-violet-400 hover:text-violet-300 underline underline-offset-2'>Privacy Policy</span>
            </label>
          </div>

          <div className='text-center border-t border-white/5 pt-6 mt-2'>
            {currState === 'Sign up' ? (
              <p className='text-sm text-gray-400'>Already have an account? <span onClick={() => setCurrState("Login")} className='font-bold text-violet-400 hover:text-white cursor-pointer transition-colors ml-1'>Sign In</span></p>
            ) : (
              <p className='text-sm text-gray-400'>Don't have an account? <span onClick={() => setCurrState("Sign up")} className='font-bold text-violet-400 hover:text-white cursor-pointer transition-colors ml-1'>Join Now</span></p>
            )}
          </div>
        </motion.form>
      </div>
    </div>
  )
}

export default LoginPage
