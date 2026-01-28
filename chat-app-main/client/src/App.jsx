import bgImage from './assets/bgImage.svg'

const App = () => {
  const { authUser, isLoading } = useContext(AuthContext)

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div
        className="bg-contain min-h-screen flex items-center justify-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div
      className="bg-contain min-h-screen"
      style={{ backgroundImage: `url(${bgImage})`, backgroundAttachment: 'fixed' }}
    >
      <Toaster />
      <Routes>
        <Route path='/' element={authUser ? <HomePage /> : <Navigate to={'/login'} replace />} />
        <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to={'/'} replace />} />
        <Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to={'/login'} replace />} />
      </Routes>
    </div>
  )
}

export default App
