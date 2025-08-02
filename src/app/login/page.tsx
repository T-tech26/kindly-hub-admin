'use client'

import { signin } from '@/lib/actions';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { toast } from 'sonner';
import z from 'zod';


const formSchema = z.object({
  email: z.string().min(3, 'Invalid email address'),
  password: z.string().min(8, 'Password must be atleast 8 characters')
});


export type LoginFormSchema = z.infer<typeof formSchema>;


const Page = () => {

  const router = useRouter();


  const [data, setData] = useState<LoginFormSchema>({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [fieldError, setFieldErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      setData(prev => ({ ...prev, [name]: value }));
    }


    const handleLogin = async (formData: LoginFormSchema) => {
      setLoading(true);

      const result = formSchema.safeParse(formData);

      if(!result.success) {
        const errorObject: Record<string, string> = {};
        // Handle validation errors
        const fieldErrors = result.error.issues;

        fieldErrors.forEach(issue => {
            errorObject[String(issue.path[0])] = issue.message;
        });

        setFieldErrors(errorObject);
        setLoading(false)
        return;
      }

      setFieldErrors({});

      const data = await signin(result.data.email, result.data.password);

      if(data.status === 'success') {
        toast.success(data.message);

        setData({
          email: '',
          password: ''
        });
        setLoading(false);

        router.push('/');
        return;
      }
      
      if(data.status === 'error') {
        setLoading(false);
        toast.error(data.error);
      }
      return;
    }



  return (
      <section className="container1">
      <div className="login-container">
        <div className="sidebar-section">
            <div className="logo-section">
                <div className="logo">
                    <div className="logo-icon">
                      <Image
                        src="/image-icon.png"
                        width={30}
                        height={30}
                        alt='Logo icon'
                      />
                    </div>
                    <span className="logo-text">Kindly Hub</span>
                </div>
            </div>

            <div className="welcome-content">
                <h2>Admin Dashboard</h2>
                <p>Manage your donation campaigns, track contributions, and view detailed analytics from your secure admin portal.</p>
            </div>

            <ul className="nav-items">
                <li className="nav-item">
                    <div className="nav-icon">📊</div>
                    <span>Dashboard Overview</span>
                </li>
                <li className="nav-item">
                    <div className="nav-icon">💝</div>
                    <span>Donation Management</span>
                </li>
                <li className="nav-item">
                    <div className="nav-icon">📱</div>
                    <span>Campaign Tracking</span>
                </li>
                <li className="nav-item">
                    <div className="nav-icon">👥</div>
                    <span>User Management</span>
                </li>
                <li className="nav-item">
                    <div className="nav-icon">📈</div>
                    <span>Reports & Analytics</span>
                </li>
            </ul>
        </div>

        <div className="login-form-section">
            <div className="form-header mb-[40px]">
                <h1 className="form-title">Sign In</h1>
                <p className="form-subtitle text-[16px]">Welcome back! Please sign in to your account.</p>
            </div>

            <form id="loginForm" onSubmit={e => e.preventDefault()}>
                <div className="form-group">
                    <label className="form-label" htmlFor="email">Email Address</label>
                    <input 
                        type="email" 
                        name="email" 
                        value={data.email}
                        className="form-input bg-[#f8f9fa] focus:bg-white" 
                        placeholder="Enter your email"
                        onChange={handleChange}
                        autoComplete='off'
                    />
                    {fieldError.email && <p className='text-xs text-red-300'>{fieldError.email}</p>}
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="password">Password</label>
                    <input 
                        type="password" 
                        name="password" 
                        value={data.password}
                        className="form-input bg-[#f8f9fa] focus:bg-white" 
                        placeholder="Enter your password"
                        onChange={handleChange}
                        autoComplete='off'
                    />
                     {fieldError.password && <p className='text-xs text-red-300'>{fieldError.password}</p>}
                </div>

                <div className="form-options">
                    <div className="checkbox-group">
                        <input type="checkbox" id="remember" name="remember" className="checkbox" />
                        <label htmlFor="remember" className="checkbox-label">Remember me</label>
                    </div>
                    <a href="#" className="forgot-password">Forgot password?</a>
                </div>

                <button 
                  type="submit" 
                  className="login-button" 
                  disabled={loading}
                  onClick={() => handleLogin(data)}
                >
                    {loading ? 'Loading...' : 'Sign In'}
                </button>
            </form>

            <div className="text-center text-sm text-[#7f8c8d]">
                Need help accessing your account? <a href="#" className="help-link">Contact Support</a>
            </div>
        </div>
      </div>
    </section>
  )
}

export default Page