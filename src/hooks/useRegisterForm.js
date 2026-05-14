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
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setGlobalError('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      await authService.register(formData);
      setSuccessMsg('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      if (err.response?.status === 400 && typeof err.response.data === 'object') {
        setErrors(err.response.data);
      } else {
        setGlobalError(
          typeof err.response?.data === 'string'
            ? err.response.data
            : 'Registration failed. Please try again.'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { formData, errors, globalError, successMsg, isLoading, handleChange, handleSubmit };
}
