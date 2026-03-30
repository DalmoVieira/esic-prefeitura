import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, User, Mail, Lock, ShieldCheck, Check } from 'lucide-react';
import { api } from '../services/api';
import { validateCPF, validateCNPJ } from '../utils/validators';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userType, setUserType] = useState<'PF' | 'PJ'>('PF');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cpfCnpj: '',
    password: '',
    confirmPassword: '',
    website: '' // Honeypot field
  });
  const [captcha, setCaptcha] = useState({ a: Math.floor(Math.random() * 10), b: Math.floor(Math.random() * 10) });
  const [captchaAnswer, setCaptchaAnswer] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem!');
      return;
    }

    if (parseInt(captchaAnswer) !== captcha.a + captcha.b) {
      setError('A resposta do desafio matemático está incorreta.');
      // Update numbers to avoid spamming the same
      setCaptcha({ a: Math.floor(Math.random() * 10), b: Math.floor(Math.random() * 10) });
      setCaptchaAnswer('');
      return;
    }

    if (formData.website) {
      // Bot detected!
      console.warn('Bot detected via honeypot');
      return;
    }

    // Limpeza e validação matemática do CPF/CNPJ
    const cleanedIdentifier = formData.cpfCnpj.replace(/\D/g, '');
    if (userType === 'PF') {
      if (cleanedIdentifier.length !== 11) {
        setError('CPF deve ter 11 dígitos.');
        return;
      }
      if (!validateCPF(cleanedIdentifier)) {
        setError('CPF inválido. Verifique o número informado.');
        return;
      }
    }
    if (userType === 'PJ') {
      if (cleanedIdentifier.length !== 14) {
        setError('CNPJ deve ter 14 dígitos.');
        return;
      }
      if (!validateCNPJ(cleanedIdentifier)) {
        setError('CNPJ inválido. Verifique o número informado.');
        return;
      }
    }

    setLoading(true);
    setError('');

    try {
      await api.post('/citizens', {
        name: formData.name,
        email: formData.email,
        cpfCnpj: cleanedIdentifier,
        password: formData.password,
      });

      alert('Cadastro realizado com sucesso! Você já pode entrar no sistema.');
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'Erro ao realizar cadastro.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="container" style={{ maxWidth: '600px', margin: '3rem auto' }}>
      <button 
        onClick={() => navigate('/login')} 
        className="btn" 
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', padding: '0' }}
      >
        <ArrowLeft size={18} />
        Voltar ao Login
      </button>

      <div className="card">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <ShieldCheck size={48} color="var(--primary)" style={{ marginBottom: '1rem' }} />
          <h2>Criar Conta e-SIC</h2>
          <p style={{ color: 'var(--text-muted)' }}>
            Cadastre-se para solicitar informações e acompanhar seus pedidos
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', padding: '0.25rem', backgroundColor: '#f0f0f0', borderRadius: 'var(--radius-md)' }}>
          <button 
            onClick={() => { setUserType('PF'); setFormData({...formData, cpfCnpj: ''}); }}
            style={{ 
              flex: 1, padding: '0.75rem', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
              fontWeight: '600', transition: 'all 0.2s',
              backgroundColor: userType === 'PF' ? 'var(--white)' : 'transparent',
              boxShadow: userType === 'PF' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
              color: userType === 'PF' ? 'var(--primary)' : 'var(--text-muted)'
            }}
          >
            Pessoa Física
          </button>
          <button 
            onClick={() => { setUserType('PJ'); setFormData({...formData, cpfCnpj: ''}); }}
            style={{ 
              flex: 1, padding: '0.75rem', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
              fontWeight: '600', transition: 'all 0.2s',
              backgroundColor: userType === 'PJ' ? 'var(--white)' : 'transparent',
              boxShadow: userType === 'PJ' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
              color: userType === 'PJ' ? 'var(--primary)' : 'var(--text-muted)'
            }}
          >
            Pessoa Jurídica
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{ backgroundColor: '#fff2f0', color: 'var(--danger)', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.9rem', border: '1px solid #ffccc7' }}>
              {error}
            </div>
          )}
          <div className="form-group">
            <label className="form-label">{userType === 'PF' ? 'Nome Completo' : 'Razão Social / Nome da Entidade'}</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                name="name"
                className="form-control" 
                placeholder={userType === 'PF' ? 'Ex: João Silva' : 'Ex: Empresa de Tecnologia LTDA'}
                value={formData.name}
                onChange={handleChange}
                required
                style={{ paddingLeft: '2.5rem' }}
              />
              <User size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">{userType === 'PF' ? 'CPF' : 'CNPJ'}</label>
              <input 
                type="text" 
                name="cpfCnpj"
                className="form-control" 
                placeholder={userType === 'PF' ? '000.000.000-00' : '00.000.000/0000-00'}
                value={formData.cpfCnpj}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">E-mail</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="email" 
                  name="email"
                  className="form-control" 
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{ paddingLeft: '2.5rem' }}
                />
                <Mail size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Senha</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="password" 
                name="password"
                className="form-control" 
                placeholder="Mínimo 8 caracteres"
                value={formData.password}
                onChange={handleChange}
                required
                style={{ paddingLeft: '2.5rem' }}
              />
              <Lock size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Confirmar Senha</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="password" 
                name="confirmPassword"
                className="form-control" 
                placeholder="Repita sua senha"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                style={{ paddingLeft: '2.5rem' }}
              />
              <Lock size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          {/* Honeypot field - hidden from humans */}
          <div style={{ position: 'absolute', left: '-5000px', opacity: 0, height: 0, overflow: 'hidden' }}>
            <input 
              type="text" 
              name="website" 
              value={formData.website} 
              onChange={handleChange} 
              tabIndex={-1} 
              autoComplete="off" 
            />
          </div>

          <div style={{ backgroundColor: '#fff', border: '1px solid #ddd', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
            <div>
              <label className="form-label" style={{ marginBottom: '0.25rem' }}>Desafio Anti-robo</label>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Quanto é <strong>{captcha.a} + {captcha.b}</strong>?</p>
            </div>
            <input 
              type="number" 
              className="form-control" 
              style={{ width: '80px', textAlign: 'center' }}
              value={captchaAnswer}
              onChange={(e) => setCaptchaAnswer(e.target.value)}
              required
              placeholder="?"
            />
          </div>

          <div style={{ backgroundColor: '#f9f9f9', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <label style={{ display: 'flex', gap: '0.75rem', cursor: 'pointer' }}>
              <input type="checkbox" required style={{ marginTop: '0.2rem' }} />
              <span>
                Li e concordo com os <strong>Termos de Uso</strong> e a <strong>Política de Privacidade</strong> em conformidade com a LGPD.
              </span>
            </label>
          </div>

          <button 
            type="submit"
            className="btn btn-primary" 
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '1rem', 
              fontSize: '1.1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            <Check size={20} />
            {loading ? 'Cadastrando...' : 'Finalizar Cadastro'}
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Já tem uma conta?</span>{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>Fazer Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
