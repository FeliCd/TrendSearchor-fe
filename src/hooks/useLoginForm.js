import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getDashboardPath } from '@/utils/roleUtils';

export function useLoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const resolvedValue = type === 'checkbox' ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: resolvedValue }));
    setErrors((prev) => {
      const next = { ...prev };
      if (next[name]) delete next[name];
      return next;
    });
    if (name === 'username' || name === 'password') setGlobalError('');
  };

  const validate = () => {
    const errs = {};
    if (!formData.username.trim()) errs.username = 'Username is required.';
    if (!formData.password) errs.password = 'Password is required.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setGlobalError('');
    setIsLoading(true);
    try {
      const data = await login(formData);
      const role = data?.user?.role || data?.role;
      navigate(getDashboardPath(role));
    } catch (err) {
      setGlobalError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Login failed. Please check your credentials.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return { formData, errors, globalError, isLoading, rememberMe, setRememberMe, handleChange, handleSubmit };
}
