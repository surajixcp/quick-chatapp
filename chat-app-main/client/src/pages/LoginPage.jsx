import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import assets from '../assets/assets'
import { AuthContext } from "../../context/AuthContext.jsx"


const LoginPage = () => {

  const [currState, setCurrState] = useState("Sign up")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [bio, setBio] = useState("")
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const { login } = useContext(AuthContext);


  const onSubmitHandler = (e) => {
    e.preventDefault();
    login(currState === "Sign up" ? 'signup' : 'login', { fullName, email, password, bio })
  }
  return (
    <div className='min-h-screen flex items-center justify-center p-4 gap-8 lg:gap-32 max-lg:flex-col relative overflow-hidden'>
      {/* Background Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[100px] -z-10 animate-pulse"></div>

      {/* ------------left--------------- */}
      <div className='flex flex-col items-center gap-4 animate-float z-10'>
        <img src={assets.logo_icon} alt="QuickChat Logo" className='w-24 h-24 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]' />
        <h1 className='text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-tight drop-shadow-sm'>QuickChat</h1>
      </div>
      {/* ------------right--------------- */}

      <form onSubmit={onSubmitHandler} className='w-full max-w-[420px] bg-black/20 backdrop-blur-3xl text-white border border-white/10 p-10 flex flex-col gap-5 rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] relative z-10 animate-fade-in-up'>
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
            <label className='text-xs font-medium text-gray-400 ml-1'>Full Name</label>
            <input
              onChange={(e) => setFullName(e.target.value)}
              value={fullName}
              type="text"
              className='p-4 bg-black/30 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:bg-black/50 transition-all placeholder:text-gray-500 outline-none'
              placeholder='Enter your name'
              required
            />
          </div>
        )}

        <div className='flex flex-col gap-1'>
          <label className='text-xs font-medium text-gray-400 ml-1'>Email Address</label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            placeholder='name@example.com'
            required
            className='p-4 bg-black/30 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:bg-black/50 transition-all placeholder:text-gray-500 outline-none'
          />
        </div>

        <div className='flex flex-col gap-1'>
          <label className='text-xs font-medium text-gray-400 ml-1'>Password</label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            placeholder='••••••••'
            required
            className='p-4 bg-black/30 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:bg-black/50 transition-all placeholder:text-gray-500 outline-none'
          />
        </div>

        {currState === "Sign up" && (
          <div className='flex flex-col gap-1'>
            <label className='text-xs font-medium text-gray-400 ml-1'>Short Bio</label>
            <textarea
              onChange={(e) => setBio(e.target.value)}
              value={bio}
              rows={3}
              className='p-4 bg-black/30 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:bg-black/50 transition-all placeholder:text-gray-500 outline-none resize-none'
              placeholder="Tell us a bit about yourself..."
            ></textarea>
          </div>
        )}

        <button
          type='submit'
          className='mt-2 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-white border-none text-base font-semibold py-4 rounded-2xl cursor-pointer hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300'
        >
          {currState === 'Sign up' ? 'Sign Up' : "Sign In"}
        </button>

        <div className='flex items-center gap-2 px-1'>
          <input
            type="checkbox"
            className='w-4 h-4 rounded border-gray-700 bg-gray-800 text-purple-600 focus:ring-purple-500 focus:ring-offset-gray-900'
            id="terms"
            required
          />
          <label htmlFor="terms" className='text-[11px] text-gray-400 leading-tight'>
            I agree to the <span className='text-purple-400 cursor-pointer hover:underline'>Terms of Use</span> & <span className='text-purple-400 cursor-pointer hover:underline'>Privacy Policy</span>
          </label>
        </div>

        <div className='text-center border-t border-white/5 pt-4 mt-2'>
          {currState === 'Sign up' ? (
            <p className='text-sm text-gray-400'>Already have an account? <span onClick={() => setCurrState("Login")} className='font-semibold text-purple-400 hover:text-purple-300 cursor-pointer transition-colors'>Sign In</span></p>
          ) : (
            <p className='text-sm text-gray-400'>Don't have an account? <span onClick={() => setCurrState("Sign up")} className='font-semibold text-purple-400 hover:text-purple-300 cursor-pointer transition-colors'>Join Now</span></p>
          )}
        </div>
      </form>
    </div>
  )
}

export default LoginPage
