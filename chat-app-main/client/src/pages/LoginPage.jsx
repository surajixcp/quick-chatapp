import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import assets from '../assets/assets'
import { AuthContext } from "../../context/AuthContext.jsx"
import { motion } from 'framer-motion'

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
    <div className='min-h-screen flex items-center justify-center p-6 sm:p-12 relative overflow-hidden'>
      {/* Background Glow Effect */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[100px] -z-10 pointer-events-none"
      />

      <div className="flex items-center justify-center gap-10 lg:gap-32 max-lg:flex-col w-full z-10">
        {/* ------------left--------------- */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className='flex flex-col items-center gap-4'
        >
          <motion.img
            animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            src={assets.logo_icon}
            alt="QuickChat Logo"
            className='w-24 h-24 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]'
          />
          <h1 className='text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-tight drop-shadow-sm text-center'>QuickChat</h1>
          <p className="text-gray-400 text-lg font-medium tracking-wide">Connect effortlessly.</p>
        </motion.div>

        {/* ------------right--------------- */}
        <motion.form
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          onSubmit={onSubmitHandler}
          className='w-full max-w-[420px] bg-black/30 backdrop-blur-3xl text-white border border-white/10 p-8 sm:p-10 flex flex-col gap-6 rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]'
        >
          <div className='flex flex-col gap-1 mb-2'>
            <h2 className='font-bold text-3xl tracking-tight'>
              {currState === "Sign up" ? "Create Account" : "Welcome Back"}
            </h2>
            <p className='text-gray-400 text-sm'>
              {currState === "Sign up" ? "Join our community today" : "Login to stay connected"}
            </p>
          </div>

          {currState === "Sign up" && (
            <div className='flex flex-col gap-1'>
              <label className='text-xs font-bold text-gray-400 ml-1 uppercase tracking-wider'>Full Name</label>
              <input
                onChange={(e) => setFullName(e.target.value)}
                value={fullName}
                type="text"
                className='p-4 bg-black/40 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:bg-black/60 transition-all placeholder:text-gray-600 outline-none text-white'
                placeholder='Enter your name'
                required
              />
            </div>
          )}

          <div className='flex flex-col gap-1'>
            <label className='text-xs font-bold text-gray-400 ml-1 uppercase tracking-wider'>Email Address</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder='name@example.com'
              required
              className='p-4 bg-black/40 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:bg-black/60 transition-all placeholder:text-gray-600 outline-none text-white'
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label className='text-xs font-bold text-gray-400 ml-1 uppercase tracking-wider'>Password</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder='••••••••'
              required
              className='p-4 bg-black/40 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:bg-black/60 transition-all placeholder:text-gray-600 outline-none text-white'
            />
          </div>

          {currState === "Sign up" && (
            <div className='flex flex-col gap-1'>
              <label className='text-xs font-bold text-gray-400 ml-1 uppercase tracking-wider'>Short Bio</label>
              <textarea
                onChange={(e) => setBio(e.target.value)}
                value={bio}
                rows={3}
                className='p-4 bg-black/40 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:bg-black/60 transition-all placeholder:text-gray-600 outline-none resize-none text-white'
                placeholder="Tell us a bit about yourself..."
              ></textarea>
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(124, 58, 237, 0.4)" }}
            whileTap={{ scale: 0.98 }}
            type='submit'
            className='mt-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-none text-base font-bold py-4 rounded-2xl cursor-pointer transition-all duration-300 shadow-lg'
          >
            {currState === 'Sign up' ? 'Sign Up' : "Sign In"}
          </motion.button>

          <div className='flex items-center gap-2 px-1'>
            <input
              type="checkbox"
              className='w-4 h-4 rounded border-gray-700 bg-gray-800 text-violet-600 focus:ring-violet-500 focus:ring-offset-gray-900 cursor-pointer'
              id="terms"
              required
            />
            <label htmlFor="terms" className='text-[11px] text-gray-400 leading-tight cursor-pointer'>
              I agree to the <span className='text-violet-400 hover:underline'>Terms of Use</span> & <span className='text-violet-400 hover:underline'>Privacy Policy</span>
            </label>
          </div>

          <div className='text-center border-t border-white/5 pt-4 mt-2'>
            {currState === 'Sign up' ? (
              <p className='text-sm text-gray-400'>Already have an account? <span onClick={() => setCurrState("Login")} className='font-bold text-violet-400 hover:text-violet-300 cursor-pointer transition-colors'>Sign In</span></p>
            ) : (
              <p className='text-sm text-gray-400'>Don't have an account? <span onClick={() => setCurrState("Sign up")} className='font-bold text-violet-400 hover:text-violet-300 cursor-pointer transition-colors'>Join Now</span></p>
            )}
          </div>
        </motion.form>
      </div>
    </div>
  )
}

export default LoginPage
