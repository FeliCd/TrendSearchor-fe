import { useState } from 'react';
import { authService } from '@/services/authService';

export function useForgotPasswordForm() {
  const [formData, setFormData] = useState({ emailOrUsername: '' });
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
    setIsLoading(true);

    try {
      await authService.requestPasswordReset(formData.emailOrUsername);
      setSuccess(true);
    } catch (err) {
      setError(
        err.response?.data?.message || err.response?.data?.error || 'Failed to send reset link. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return { formData, error, success, isLoading, handleChange, handleSubmit };
}
