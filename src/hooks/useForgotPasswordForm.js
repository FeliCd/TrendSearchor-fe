import { useState } from 'react';
import { authService } from '@/services/authService';
import { isValidEmail } from '@/utils/validationUtils';

export function useForgotPasswordForm() {
  const [formData, setFormData] = useState({ mail: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isValidEmail(formData.mail)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    try {
      await authService.requestPasswordReset({ mail: formData.mail });
      setSuccess(true);
    } catch (err) {
      const data = err.response?.data;
      if (typeof data === 'string') {
        setError(data);
      } else {
        setError(data?.message || data?.error || 'Failed to send reset password. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { formData, error, success, isLoading, handleChange, handleSubmit };
}
