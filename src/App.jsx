import { useState } from 'react'
import { supabase } from './supabaseClient'

export default function App() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()

    const { error } = await supabase
      .from('users')
      .insert([{ username, password }])

    if (error) {
      console.error(error)
      setMessage('Error: ' + error.message)
    } else {
      setMessage('User saved!')
      setUsername('')
      setPassword('')
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Register</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit">Submit</button>
      </form>

      <p>{message}</p>
    </div>
  )
}