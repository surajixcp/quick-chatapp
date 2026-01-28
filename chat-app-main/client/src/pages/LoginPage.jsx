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

    if (currState === 'Sign up' && !isDataSubmitted) {
      setIsDataSubmitted(true);
      return;
    }
    login(currState === "Sign up" ? 'signup' : 'login', { fullName, email, password, bio })

  }
  return (
    <div className='min-h-screen flex items-center justify-center p-4 gap-8 lg:gap-32 max-lg:flex-col'>
      {/* ------------left--------------- */}
      <div className='flex flex-col items-center gap-2 animate-float'>
        <img src={assets.logo_big} alt="QuickChat Logo" className='w-[min(40vw,280px)]' />
        <h1 className='text-4xl font-bold text-white tracking-tight'>QuickChat</h1>
      </div>
      {/* ------------right--------------- */}

      <form onSubmit={onSubmitHandler} className='w-full max-w-[400px] bg-[#1c1c1c]/40 backdrop-blur-xl text-white border border-white/10 p-8 flex flex-col gap-6 rounded-2xl shadow-2xl relative z-10'>
        <h2 className='font-medium text-2xl flex justify-between items-center'>
          {currState}
          {isDataSubmitted && <img onClick={() => setIsDataSubmitted(false)} src={assets.arrow_icon} alt="" className='w-5 cursor-pointer' />}
        </h2>

        {currState === "Sign up" && !isDataSubmitted && (
          <input onChange={(e) => setFullName(e.target.value)} value={fullName} type="text" className='p-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all placeholder:text-gray-500' placeholder='Full Name' />
        )}

        {!isDataSubmitted && (
          <>
            <input onChange={(e) => setEmail(e.target.value)} value={email}
              type="email" placeholder='Email Address' required
              className='p-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all placeholder:text-gray-500' />

            <input onChange={(e) => setPassword(e.target.value)} value={password}
              type="password" placeholder='Password' required
              className='p-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all placeholder:text-gray-500' />
          </>
        )}

        {
          currState === "Sign up" && !isDataSubmitted && (
            <textarea onChange={(e) => setBio(e.target.value)} value={bio} rows={4} className='p-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all placeholder:text-gray-500' placeholder="Tell us about yourself..."></textarea>
          )
        }

        <button type='submit' className='bg-gradient-to-r from-purple-400 to-violet-600 text-white border-none text-sm font-light py-2 px-10 md:px-20 rounded-full cursor-pointer'>
          {currState === 'Sign up' ? 'Create Account' : "Login"}
        </button>

        <div className='flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5'>
          <input type="checkbox" className='w-4 h-4 rounded border-gray-600 bg-gray-700 text-violet-600 focus:ring-violet-500' id="terms" required />
          <label htmlFor="terms" className='text-xs text-gray-400 cursor-pointer'>Agree to the terms of use & privacy policy.</label>
        </div>

        <div className='text-center mt-2'>
          {currState === 'Sign up' ? (
            <p className='text-sm text-gray-400'>Already have an account? <span onClick={() => { setCurrState("Login"); setIsDataSubmitted(false) }} className='font-medium text-violet-400 hover:text-violet-300 cursor-pointer transition-colors'>Login here</span></p>
          ) : (
            <p className='text-sm text-gray-400'>New to QuickChat? <span onClick={() => { setCurrState("Sign up"); setIsDataSubmitted(false) }} className='font-medium text-violet-400 hover:text-violet-300 cursor-pointer transition-colors'>Create an account</span></p>
          )}
        </div>
      </form>
    </div>
  )
}

export default LoginPage
