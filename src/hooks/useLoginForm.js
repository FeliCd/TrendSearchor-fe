import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/authService';

export function useLoginForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await authService.login(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.message || err.response?.data?.error || 'Login failed. Please check your credentials.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return { formData, error, isLoading, handleChange, handleSubmit };
}
