import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Send, Paperclip, MessageSquare, MessageCircle } from 'lucide-react';
import { api } from '../services/api';

const RespondRequest: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [request, setRequest] = useState<any>(null);
  const [response, setResponse] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [whatsappLink, setWhatsappLink] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    api.get(`/requests/${id}`).then(setRequest).catch(() => {});
  }, [id]);

  const handleResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    try {
      setLoading(true);
      setError('');
      const result = await api.put(`/requests/${id}/respond`, { response });

      // Upload attachments if any
      if (selectedFiles.length > 0) {
        const formData = new FormData();
        selectedFiles.forEach((f) => formData.append('files', f));
        await api.upload(`/requests/${id}/attachments`, formData);
      }

      setWhatsappLink(result.whatsappLink || '');
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Erro ao enviar resposta');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <MessageSquare size={48} color="var(--success)" style={{ marginBottom: '1rem' }} />
          <h2 style={{ marginBottom: '0.5rem' }}>Resposta enviada com sucesso!</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            O cidadão foi notificado por e-mail.
          </p>
          {whatsappLink && (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="btn"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#25D366', color: '#fff', border: 'none', marginBottom: '1rem', padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)', textDecoration: 'none' }}
            >
              <MessageCircle size={20} />
              Notificar via WhatsApp
            </a>
          )}
          <br />
          <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => navigate('/admin')}>
            Voltar ao Painel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <button onClick={() => navigate('/admin')} className="btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', padding: '0.5rem 0' }}>
        <ArrowLeft size={18} />
        Voltar ao Painel
      </button>

      <div className="card">
        <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <MessageSquare size={28} color="var(--primary)" />
          Responder Pedido
        </h2>

        {error && (
          <div style={{ backgroundColor: '#fff2f0', color: 'var(--danger)', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.9rem', border: '1px solid #ffccc7' }}>
            {error}
          </div>
        )}

        <div style={{ backgroundColor: '#f9f9f9', padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem' }}>
          <div style={{ marginBottom: '0.5rem' }}>
            <strong>Protocolo:</strong> <span style={{ color: 'var(--primary)' }}>{request?.protocol || '...'}</span>
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            <strong>Requerente:</strong> {request?.user?.name || '...'}
          </div>
          {request?.department && (
            <div style={{ marginBottom: '0.5rem' }}>
              <strong>Setor:</strong> {request.department.name}
            </div>
          )}
          <div style={{ borderTop: '1px solid #eee', marginTop: '1rem', paddingTop: '1rem' }}>
            <strong>Descrição do Pedido:</strong>
            <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>{request?.description || '...'}</p>
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
            <div
              style={{ border: '2px dashed var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.5rem', textAlign: 'center', cursor: 'pointer' }}
              onClick={() => document.getElementById('respond-file-upload')?.click()}
            >
              <Paperclip size={24} color="var(--text-muted)" style={{ marginBottom: '0.5rem' }} />
              {selectedFiles.length === 0 ? (
                <p style={{ fontSize: '0.9rem' }}>Arraste relatórios, contratos ou tabelas para anexar à resposta</p>
              ) : (
                <p style={{ fontSize: '0.9rem', color: 'var(--primary)' }}>
                  {selectedFiles.length} arquivo(s) selecionado(s): {selectedFiles.map(f => f.name).join(', ')}
                </p>
              )}
              <input
                type="file"
                id="respond-file-upload"
                multiple
                style={{ display: 'none' }}
                onChange={(e) => setSelectedFiles(Array.from(e.target.files || []))}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <Send size={20} />
              {loading ? 'Enviando...' : 'Finalizar e Enviar Resposta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RespondRequest;
