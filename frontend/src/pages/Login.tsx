import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, User, Lock, LogIn } from 'lucide-react';
import { api } from '../services/api';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await api.post('/login', {
        email: identifier, // Currently backend expects email
        password,
      });

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      if (data.user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Credenciais inválidas. Verifique seu e-mail e senha.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{
      maxWidth: '450px',
      margin: '4rem auto',
    }}>
      <div className="card">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <ShieldCheck size={56} color="var(--primary)" style={{ marginBottom: '1rem' }} />
          <h2>Acesse sua Conta</h2>
          <p style={{ color: 'var(--text-muted)' }}>
            Entre com seus dados para acessar o sistema e-SIC
          </p>
        </div>

        <form onSubmit={handleLogin}>
          {error && (
            <div style={{ backgroundColor: '#fff2f0', color: 'var(--danger)', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.9rem', border: '1px solid #ffccc7' }}>
              {error}
            </div>
          )}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={16} /> E-mail
            </label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Digite seu e-mail"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Lock size={16} /> Senha
            </label>
            <input 
              type="password" 
              className="form-control" 
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
              <input type="checkbox" /> Lembrar de mim
            </label>
            <Link to="/esqueci-senha" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Esqueceu a senha?</Link>
          </div>

          <button 
            type="submit"
            className="btn btn-primary" 
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '0.8rem', 
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              opacity: loading ? 0.7 : 1
            }}
          >
            <LogIn size={20} />
            {loading ? 'Entrando...' : 'Entrar no Sistema'}
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Não possui conta?</span>{' '}
          <Link to="/cadastro" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>Cadastre-se agora</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
