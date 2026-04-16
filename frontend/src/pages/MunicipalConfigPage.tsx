import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Building2, Upload, RefreshCw } from 'lucide-react';
import { useConfig } from '../contexts/ConfigContext';
import { API_URL, UPLOADS_URL } from '../services/api';

const MunicipalConfigPage: React.FC = () => {
  const navigate = useNavigate();
  const { config, refreshConfig } = useConfig();

  const [form, setForm] = useState({
    cityName: '',
    state: '',
    cnpj: '',
    slogan: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    primaryColor: '',
  });

  const [coatOfArmsFile, setCoatOfArmsFile] = useState<File | null>(null);
  const [coatOfArmsPreview, setCoatOfArmsPreview] = useState<string>('');
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setForm({
      cityName: config.cityName || '',
      state: config.state || '',
      cnpj: config.cnpj || '',
      slogan: config.slogan || '',
      address: config.address || '',
      phone: config.phone || '',
      email: config.email || '',
      website: config.website || '',
      primaryColor: config.primaryColor || '#1a5276',
    });
    if (config.coatOfArmsFile) {
      setCoatOfArmsPreview(`${UPLOADS_URL}/${config.coatOfArmsFile}`);
    }
    if (config.faviconFile) {
      setFaviconPreview(`${UPLOADS_URL}/${config.faviconFile}`);
    }
  }, [config]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoatOfArmsFile(file);
    setCoatOfArmsPreview(URL.createObjectURL(file));
  };

  const handleFaviconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFaviconFile(file);
    setFaviconPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      if (coatOfArmsFile) {
        formData.append('coatOfArms', coatOfArmsFile);
      }
      if (faviconFile) {
        formData.append('favicon', faviconFile);
      }

      const res = await fetch(`${API_URL}/config`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erro ao salvar configurações');
      }

      await refreshConfig();
      setSuccess('Configurações salvas com sucesso!');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar configurações');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.6rem 0.9rem',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-md)',
    fontSize: '1rem',
    outline: 'none',
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '0.4rem',
    fontWeight: '600',
    fontSize: '0.9rem',
  };

  return (
    <div className="container">
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <button
            onClick={() => navigate('/admin')}
            className="btn"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', padding: '0' }}
          >
            <ArrowLeft size={18} />
            Voltar ao Painel
          </button>
          <h1 style={{ marginBottom: '0.25rem' }}>Configurações do Município</h1>
          <p style={{ color: 'var(--text-muted)' }}>Personalize o sistema para a sua prefeitura.</p>
        </div>
      </div>

      {error && (
        <div style={{ backgroundColor: '#fff2f0', color: 'var(--danger)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', border: '1px solid #ffccc7' }}>
          {error}
        </div>
      )}
      {success && (
        <div style={{ backgroundColor: '#f6ffed', color: '#389e0d', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', border: '1px solid #b7eb8f' }}>
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>

          {/* Coluna Esquerda */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Identidade */}
            <div className="card">
              <h3 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Building2 size={20} color="var(--primary)" />
                Identidade Municipal
              </h3>

              <div className="form-group">
                <label style={labelStyle}>Nome da Cidade *</label>
                <input
                  type="text" style={inputStyle} required
                  placeholder="Ex: Rio Claro"
                  value={form.cityName}
                  onChange={e => setForm({ ...form, cityName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label style={labelStyle}>Estado (UF) *</label>
                <input
                  type="text" style={{ ...inputStyle, maxWidth: '100px' }} required maxLength={2}
                  placeholder="Ex: RJ"
                  value={form.state}
                  onChange={e => setForm({ ...form, state: e.target.value.toUpperCase() })}
                />
              </div>

              <div className="form-group">
                <label style={labelStyle}>CNPJ</label>
                <input
                  type="text" style={inputStyle}
                  placeholder="Ex: 00.000.000/0001-00"
                  value={form.cnpj}
                  onChange={e => setForm({ ...form, cnpj: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label style={labelStyle}>Slogan / Mensagem Institucional</label>
                <textarea
                  rows={3} style={{ ...inputStyle, resize: 'vertical' }}
                  placeholder="Ex: Transparência e acesso à informação para todos os cidadãos."
                  value={form.slogan}
                  onChange={e => setForm({ ...form, slogan: e.target.value })}
                />
              </div>
            </div>

            {/* Brasão */}
            <div className="card">
              <h3 style={{ marginTop: 0 }}>Brasão / Logotipo</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                Formatos aceitos: PNG, JPG, SVG, WebP. Máximo 2MB.
              </p>

              {coatOfArmsPreview && (
                <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
                  <img
                    src={coatOfArmsPreview}
                    alt="Brasão"
                    style={{ maxHeight: '120px', maxWidth: '120px', objectFit: 'contain', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '0.5rem' }}
                  />
                </div>
              )}

              <label style={{ cursor: 'pointer' }}>
                <div className="btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '2px dashed var(--border-color)', backgroundColor: '#fafafa', width: '100%', justifyContent: 'center', padding: '1rem' }}>
                  <Upload size={20} />
                  {coatOfArmsFile ? coatOfArmsFile.name : 'Selecionar imagem do brasão'}
                </div>
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
              </label>
            </div>

            {/* Favicon */}
            <div className="card">
              <h3 style={{ marginTop: 0 }}>Favicon</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                Ícone exibido na aba do navegador. Recomendado: PNG ou ICO quadrado (32×32 px). Máximo 2MB.
              </p>

              {faviconPreview && (
                <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <img
                    src={faviconPreview}
                    alt="Favicon"
                    style={{ width: '32px', height: '32px', objectFit: 'contain', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '2px' }}
                  />
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Prévia (tamanho real)</span>
                </div>
              )}

              <label style={{ cursor: 'pointer' }}>
                <div className="btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '2px dashed var(--border-color)', backgroundColor: '#fafafa', width: '100%', justifyContent: 'center', padding: '1rem' }}>
                  <Upload size={20} />
                  {faviconFile ? faviconFile.name : 'Selecionar imagem do favicon'}
                </div>
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFaviconChange} />
              </label>
            </div>

          </div>

          {/* Coluna Direita */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Contato */}
            <div className="card">
              <h3 style={{ marginTop: 0 }}>Contato e Endereço</h3>

              <div className="form-group">
                <label style={labelStyle}>Endereço Completo</label>
                <input
                  type="text" style={inputStyle}
                  placeholder="Ex: Av. Central, 100 - Centro, CEP: 00000-000"
                  value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label style={labelStyle}>Telefone / Ouvidoria</label>
                <input
                  type="tel" style={inputStyle}
                  placeholder="Ex: (00) 3000-0000"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label style={labelStyle}>E-mail institucional do e-SIC</label>
                <input
                  type="email" style={inputStyle}
                  placeholder="Ex: esic@municipio.gov.br"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label style={labelStyle}>Site da Prefeitura</label>
                <input
                  type="url" style={inputStyle}
                  placeholder="Ex: https://municipio.gov.br"
                  value={form.website}
                  onChange={e => setForm({ ...form, website: e.target.value })}
                />
              </div>
            </div>

            {/* Aparência */}
            <div className="card">
              <h3 style={{ marginTop: 0 }}>Aparência</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                Cor primária utilizada nos botões, links e destaques do sistema.
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <input
                  type="color"
                  value={form.primaryColor}
                  onChange={e => setForm({ ...form, primaryColor: e.target.value })}
                  style={{ width: '60px', height: '44px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', cursor: 'pointer', padding: '4px' }}
                />
                <input
                  type="text" style={{ ...inputStyle, flex: 1 }}
                  placeholder="#1a5276"
                  value={form.primaryColor}
                  onChange={e => setForm({ ...form, primaryColor: e.target.value })}
                />
                <div
                  style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', backgroundColor: form.primaryColor, border: '1px solid var(--border-color)', flexShrink: 0 }}
                />
              </div>
            </div>

            {/* Preview */}
            <div className="card" style={{ backgroundColor: 'var(--primary)', color: '#fff' }}>
              <h3 style={{ margin: '0 0 0.5rem', color: '#fff', fontSize: '1.1rem' }}>e-SIC</h3>
              <p style={{ margin: 0, opacity: 0.85, fontSize: '0.85rem' }}>{form.cityName || 'Nome da Cidade'} - {form.state || 'UF'}</p>
              {form.slogan && <p style={{ margin: '0.75rem 0 0', opacity: 0.75, fontSize: '0.8rem', fontStyle: 'italic' }}>"{form.slogan}"</p>}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
          <button type="button" onClick={() => navigate('/admin')} className="btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ArrowLeft size={18} />
            Cancelar
          </button>
          <button type="submit" disabled={loading} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '160px', justifyContent: 'center' }}>
            {loading ? <RefreshCw size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={18} />}
            {loading ? 'Salvando...' : 'Salvar Configurações'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MunicipalConfigPage;
