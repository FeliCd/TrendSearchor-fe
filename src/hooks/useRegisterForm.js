import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/authService';
import { getDashboardPath } from '@/utils/roleUtils';
import { isValidEmail, isValidPhone, isValidPassword, isValidDob, extractError } from '@/utils/validationUtils';

export function useRegisterForm() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
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
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};

    if (!formData.username.trim()) {
      errs.username = 'Username is required';
    } else if (formData.username.trim().length < 3) {
      errs.username = 'Username must be at least 3 characters';
    }

    if (!formData.mail.trim()) {
      errs.mail = 'Email is required';
    } else if (!isValidEmail(formData.mail)) {
      errs.mail = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errs.password = 'Password is required';
    } else if (!isValidPassword(formData.password)) {
      errs.password = 'Must be ≥9 chars with 1 uppercase, 1 number, 1 special char';
    }

    if (!formData.confirmPassword) {
      errs.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    if (!formData.phone.trim()) {
      errs.phone = 'Phone number is required';
    } else if (!isValidPhone(formData.phone)) {
      errs.phone = 'Phone must be 10 digits starting with 09, 03, 05, 07, or 08';
    }

    if (!isValidDob(formData.dob)) {
      errs.dob = 'Date of birth must be in the past and year ≥ 1920';
    }

    if (!formData.gender) errs.gender = 'Gender is required';
    if (!formData.workplace.trim()) errs.workplace = 'Workplace / University is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setGlobalError('');
    setSuccessMsg('');

    if (!validate()) { setGlobalError('Please fix the errors below.'); return; }

    setIsLoading(true);
    try {
      await authService.register(formData);
      setSuccessMsg('Registration successful! Redirecting...');

      try {
        const data = await login({ username: formData.username, password: formData.password });
        navigate(getDashboardPath(data?.user?.role || data?.role));
      } catch {
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (err) {
      if (err.response?.status === 400 && typeof err.response.data === 'object') {
        setErrors(err.response.data);
        setGlobalError('Please fix the errors below.');
      } else {
        setGlobalError(extractError(err));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { formData, errors, globalError, successMsg, isLoading, handleChange, handleSubmit };
}
