import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Mail, Send } from 'lucide-react';

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Simulate email sending
    console.log('Reset link sent to:', email);
  };

  if (submitted) {
    return (
      <div className="container" style={{ maxWidth: '450px', margin: '4rem auto' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ backgroundColor: 'rgba(40, 167, 69, 0.1)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <Mail size={40} color="var(--success)" />
          </div>
          <h2>E-mail Enviado!</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            Se o e-mail <strong>{email}</strong> estiver cadastrado em nosso sistema, você receberá um link para redefinir sua senha em instantes.
          </p>
          <Link to="/login" className="btn btn-primary" style={{ width: '100%', padding: '0.8rem' }}>
            Voltar ao Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '450px', margin: '4rem auto' }}>
      <button 
        onClick={() => navigate('/login')} 
        className="btn" 
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', padding: '0' }}
      >
        <ArrowLeft size={18} />
        Voltar
      </button>

      <div className="card">
        <h2 style={{ marginBottom: '1rem' }}>Esqueceu a senha?</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Informe seu e-mail cadastrado e enviaremos as instruções para você criar uma nova senha.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">E-mail</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="email" 
                className="form-control" 
                placeholder="seu-email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ paddingLeft: '2.5rem' }}
              />
              <Mail size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
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
              gap: '0.5rem',
              marginTop: '1.5rem'
            }}
          >
            <Send size={18} />
            Enviar Link de Recuperação
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
