import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
            role: 'user'
        }
      }
    });

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage('Cek email kamu untuk konfirmasi pendaftaran!');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-auto">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Trainlytic
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Buat akun baru untuk sistem palang
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-200">
          <form className="space-y-6" onSubmit={handleRegister}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                {loading ? 'Processing...' : 'Daftar Sekarang'}
              </button>
            </div>
          </form>

          {message && (
            <div className={`mt-4 text-center text-sm ${message.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
              {message}
            </div>
          )}

          <div className="mt-6 text-center">
            <Link href="/login" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              Sudah punya akun? Login di sini
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}