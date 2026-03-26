import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, User, Lock, LogIn } from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate authentication
    localStorage.setItem('token', 'mock-jwt-token');
    
    // Check if it's admin or citizen based on identifier
    if (identifier.toLowerCase().includes('admin')) {
      localStorage.setItem('user', JSON.stringify({
        name: 'Administrador SIC',
        role: 'ADMIN',
        email: identifier
      }));
      navigate('/admin');
    } else {
      localStorage.setItem('user', JSON.stringify({
        name: 'Cidadão Exemplo',
        role: 'CITIZEN',
        cpf: identifier
      }));
      navigate('/dashboard');
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
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={16} /> CPF ou E-mail
            </label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Digite seu CPF ou e-mail"
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
            style={{ 
              width: '100%', 
              padding: '0.8rem', 
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <LogIn size={20} />
            Entrar no Sistema
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
