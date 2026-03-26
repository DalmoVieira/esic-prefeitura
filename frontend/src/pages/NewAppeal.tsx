import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Gavel, Send, Info } from 'lucide-react';

const NewAppeal: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  console.log('Appealing for request:', id);
  const navigate = useNavigate();
  const [justification, setJustification] = useState('');
  const [instance, setInstance] = useState('1st'); // 1st, 2nd, 3rd
  console.log('Current instance:', instance, setInstance);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Recurso de ${instance} instância interposto com sucesso!`);
    navigate('/dashboard');
  };

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <button 
        onClick={() => navigate('/dashboard')} 
        className="btn" 
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', padding: '0.5rem 0' }}
      >
        <ArrowLeft size={18} />
        Voltar ao Painel
      </button>

      <div className="card">
        <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Gavel size={28} color="var(--primary)" />
          Interpor Recurso
        </h2>
        
        <div style={{ backgroundColor: '#fff8e1', padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem', border: '1px solid #ffe082' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <Info size={24} color="#f57f17" />
            <div>
              <h4 style={{ color: '#f57f17', margin: 0 }}>Atenção</h4>
              <p style={{ fontSize: '0.9rem', color: '#7f5f00', marginTop: '0.25rem' }}>
                Você tem o direito de recorrer caso sua solicitação tenha sido negada ou você considere a resposta insatisfatória. O prazo para recorrer é de 10 dias após a ciência da decisão.
              </p>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: '#f9f9f9', padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem' }}>
          <div><strong>Protocolo Original:</strong> ESIC-A1B2C3D4E</div>
          <div><strong>Instância:</strong> {instance === '1st' ? '1ª Instância (Autoridade Hierárquica)' : instance === '2nd' ? '2ª Instância (Controladoria)' : '1ª Instância'}</div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Justificativa do Recurso</label>
            <textarea 
              className="form-control" 
              rows={8} 
              placeholder="Explique detalhadamente os motivos pelos quais você não concorda com a resposta recebida..."
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <Send size={20} />
              Enviar Recurso
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewAppeal;
