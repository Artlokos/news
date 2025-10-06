import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials } from './authSlice';
import api from '../../services/api';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.login({ email, password });
      dispatch(setCredentials(response.data));
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (

    <div className="login-container">
      <h1 className={'header1'}>Pulsar</h1>
      <h2 className={'header2'}>пульс этого города</h2>
      <form className={'login-form'} onSubmit={handleSubmit}>
        <div className="input-container">
          <input
              type="email"
              className="custom-input floating-input"
              placeholder=" "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
          />
            <label className="floating-label">E-mail</label>
        </div>

        <div className="input-container">
          <input
              type="password"
              className="custom-input floating-input"
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
          />
          <label className="floating-label">Password</label>
        </div>
        <button className={'submit-button'} type="submit">Войти</button>
      </form>
    </div>
  );
};

export default LoginPage;