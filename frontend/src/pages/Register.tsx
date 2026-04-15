import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, User, Mail, Lock, ShieldCheck, Check, Eye, EyeOff } from 'lucide-react';
import { api } from '../services/api';
import { validateCPF, validateCNPJ } from '../utils/validators';

interface PasswordStrength {
  score: number; // 0-4
  label: string;
  color: string;
  rules: { label: string; ok: boolean }[];
}

function checkPasswordStrength(password: string): PasswordStrength {
  const rules = [
    { label: 'Mínimo de 8 caracteres',             ok: password.length >= 8 },
    { label: 'Pelo menos uma letra maiúscula (A-Z)', ok: /[A-Z]/.test(password) },
    { label: 'Pelo menos uma letra minúscula (a-z)', ok: /[a-z]/.test(password) },
    { label: 'Pelo menos um número (0-9)',           ok: /[0-9]/.test(password) },
    { label: 'Pelo menos um caractere especial (!@#$...)', ok: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = rules.filter(r => r.ok).length;
  const labels = ['Muito fraca', 'Fraca', 'Razoável', 'Boa', 'Forte'];
  const colors = ['#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#27ae60'];
  return { score, label: password ? labels[score - 1] || labels[0] : '', color: colors[score - 1] || colors[0], rules };
}

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem!');
      return;
    }

    const strength = checkPasswordStrength(formData.password);
    if (strength.score < 4) {
      setError('A senha não atende aos requisitos mínimos de segurança. Verifique as dicas abaixo.');
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
                type={showPassword ? 'text' : 'password'}
                name="password"
                className="form-control" 
                placeholder="Crie uma senha segura"
                value={formData.password}
                onChange={handleChange}
                required
                style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
              />
              <Lock size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <button type="button" onClick={() => setShowPassword(v => !v)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0 }}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Medidor de força */}
            {formData.password && (() => {
              const strength = checkPasswordStrength(formData.password);
              return (
                <div style={{ marginTop: '0.75rem' }}>
                  {/* Barra */}
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '0.4rem' }}>
                    {[1,2,3,4,5].map(i => (
                      <div key={i} style={{ flex: 1, height: '5px', borderRadius: '3px', backgroundColor: i <= strength.score ? strength.color : '#e0e0e0', transition: 'background-color 0.3s' }} />
                    ))}
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: '600', color: strength.color, marginBottom: '0.5rem' }}>
                    Força da senha: {strength.label}
                  </div>
                  {/* Requisitos */}
                  <div style={{ backgroundColor: '#f9f9f9', border: '1px solid #eee', borderRadius: 'var(--radius-md)', padding: '0.75rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.35rem' }}>
                    {strength.rules.map(rule => (
                      <div key={rule.label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: rule.ok ? '#27ae60' : '#999' }}>
                        <span style={{ fontSize: '0.85rem' }}>{rule.ok ? '✓' : '○'}</span>
                        {rule.label}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>

          <div className="form-group">
            <label className="form-label">Confirmar Senha</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                className="form-control" 
                placeholder="Repita sua senha"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
              />
              <Lock size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <button type="button" onClick={() => setShowConfirmPassword(v => !v)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0 }}>
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              {formData.confirmPassword && (
                <span style={{ position: 'absolute', right: '2.5rem', top: '50%', transform: 'translateY(-50%)', fontSize: '0.8rem', color: formData.password === formData.confirmPassword ? '#27ae60' : '#e74c3c' }}>
                  {formData.password === formData.confirmPassword ? '✓' : '✗'}
                </span>
              )}
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
