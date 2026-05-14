import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/authService';

export function useRegisterForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    dob: '',
    mail: '',
    phone: '',
    gender: 'MALE',
    workplace: '',
  });
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setGlobalError('');
    setSuccessMsg('');
    setIsLoading(true);
    
    try {
      await authService.register(formData);
      setSuccessMsg('Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      if (err.response?.status === 400 && typeof err.response.data === 'object') {
        // Validation errors from backend
        setErrors(err.response.data);
      } else if (err.response?.data && typeof err.response.data === 'string') {
        // String error message (e.g., Username already taken)
        setGlobalError(err.response.data);
      } else {
        setGlobalError('Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return {
    formData,
    errors,
    globalError,
    successMsg,
    isLoading,
    handleChange,
    handleSubmit
  };
}
