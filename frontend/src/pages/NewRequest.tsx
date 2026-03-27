import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Paperclip } from 'lucide-react';
import { api } from '../services/api';

const NewRequest: React.FC = () => {
  console.log('Rendering NewRequest component');
  const navigate = useNavigate();
  const [description, setDescription] = useState('');
  const [format, setFormat] = useState('SYSTEM'); // SYSTEM, EMAIL, PHYSICAL
  const [honeypot, setHoneypot] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (honeypot) {
      // Bot detected!
      console.warn('Bot detected via honeypot');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await api.post('/requests', {
        description,
        format,
        website: honeypot // Send honeypot field (should be empty)
      });
      
      alert(`Pedido enviado com sucesso! Protocolo: ${response.protocol}`);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Erro ao enviar pedido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <div className="card">
        <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Send size={28} color="var(--primary)" />
          Nova Solicitação de Informação
        </h2>

        {error && (
          <div style={{ backgroundColor: '#fff2f0', color: 'var(--danger)', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.9rem', border: '1px solid #ffccc7' }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Descrição do Pedido</label>
            <textarea 
              className="form-control" 
              rows={6} 
              placeholder="Descreva aqui de forma clara e objetiva a informação que você deseja solicitar..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              style={{ resize: 'vertical' }}
            />
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              Dica: Seja específico para facilitar a localização da informação pelo órgão.
            </p>
          </div>

          <div className="form-group">
            <label className="form-label">Anexos (Opcional)</label>
            <div style={{
              border: '2px dashed var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '2rem',
              textAlign: 'center',
              backgroundColor: 'rgba(0,0,0,0.02)'
            }}>
              <Paperclip size={32} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
              <p>Clique ou arraste arquivos para anexar</p>
              <input type="file" multiple style={{ display: 'none' }} id="file-upload" />
              <button type="button" className="btn" style={{ marginTop: '1rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--white)' }} onClick={() => document.getElementById('file-upload')?.click()}>
                Selecionar Arquivos
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Como deseja receber a resposta?</label>
            <div style={{ display: 'flex', gap: '2rem', marginTop: '0.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="radio" name="format" value="SYSTEM" checked={format === 'SYSTEM'} onChange={() => setFormat('SYSTEM')} />
                Pelo Sistema (e-SIC)
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="radio" name="format" value="EMAIL" checked={format === 'EMAIL'} onChange={() => setFormat('EMAIL')} />
                E-mail
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="radio" name="format" value="PHYSICAL" checked={format === 'PHYSICAL'} onChange={() => setFormat('PHYSICAL')} />
                Busca no Local
              </label>
            </div>
          </div>

          {/* Honeypot field - hidden from humans */}
          <div style={{ position: 'absolute', left: '-5000px', opacity: 0, height: 0, overflow: 'hidden' }}>
            <input 
              type="text" 
              name="website" 
              value={honeypot} 
              onChange={(e) => setHoneypot(e.target.value)} 
              tabIndex={-1} 
              autoComplete="off" 
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ flex: 1 }}>
              {loading ? 'Enviando...' : 'Enviar Solicitação'}
            </button>
            <button type="button" className="btn" style={{ flex: 1, border: '1px solid var(--border-color)', backgroundColor: 'var(--white)' }} onClick={() => navigate('/dashboard')}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewRequest;
