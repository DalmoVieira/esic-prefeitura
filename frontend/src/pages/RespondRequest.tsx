import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Send, Paperclip, MessageSquare } from 'lucide-react';

const RespondRequest: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  console.log('Responding to request:', id);
  const navigate = useNavigate();
  const [response, setResponse] = useState('');

  const handleResponse = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Resposta enviada com sucesso para o protocolo.`);
    navigate('/admin');
  };

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <button 
        onClick={() => navigate('/admin')} 
        className="btn" 
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', padding: '0.5rem 0' }}
      >
        <ArrowLeft size={18} />
        Voltar ao Painel
      </button>

      <div className="card">
        <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <MessageSquare size={28} color="var(--primary)" />
          Responder Pedido
        </h2>
        
        <div style={{ backgroundColor: '#f9f9f9', padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem' }}>
          <div style={{ marginBottom: '0.5rem' }}>
            <strong>Protocolo:</strong> <span style={{ color: 'var(--primary)' }}>ESIC-A1B2C3D4E</span>
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            <strong>Requisição:</strong> Dalmo Vieira (Secretaria de Obras)
          </div>
          <div style={{ borderTop: '1px solid #eee', marginTop: '1rem', paddingTop: '1rem' }}>
            <strong>Descrição do Pedido:</strong>
            <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>
              Solicitação de cópia do contrato de pavimentação da Rua das Flores e lista de materiais utilizados na obra.
            </p>
          </div>
        </div>

        <form onSubmit={handleResponse}>
          <div className="form-group">
            <label className="form-label">Resposta ao Cidadão</label>
            <textarea 
              className="form-control" 
              rows={10} 
              placeholder="Digite aqui a resposta oficial que será enviada ao cidadão..."
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Anexar Documentos de Resposta</label>
            <div style={{
              border: '2px dashed var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '1.5rem',
              textAlign: 'center'
            }}>
              <Paperclip size={24} color="var(--text-muted)" style={{ marginBottom: '0.5rem' }} />
              <p style={{ fontSize: '0.9rem' }}>Arraste relatórios, contratos ou tabelas para anexar à resposta</p>
              <button type="button" className="btn" style={{ marginTop: '0.5rem', fontSize: '0.85rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--white)' }}>
                Selecionar Arquivos
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <Send size={20} />
              Finalizar e Enviar Resposta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RespondRequest;
