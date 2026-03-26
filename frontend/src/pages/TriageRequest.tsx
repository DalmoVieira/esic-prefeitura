import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Forward } from 'lucide-react';

const TriageRequest: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  console.log('Triaging request:', id);
  const navigate = useNavigate();
  const [department, setDepartment] = useState('');
  const [secrecyLevel, setSecrecyLevel] = useState('PUBLICO');
  const [observation, setObservation] = useState('');

  const handleTriage = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Pedido encaminhado com sucesso para: ${department}`);
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
        <h2 style={{ marginBottom: '1.5rem' }}>Triagem de Pedido</h2>
        
        <div style={{ backgroundColor: '#f9f9f9', padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem' }}>
          <div style={{ marginBottom: '0.5rem' }}>
            <strong>Protocolo:</strong> <span style={{ color: 'var(--primary)' }}>ESIC-A1B2C3D4E</span>
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            <strong>Requerente:</strong> Dalmo Vieira
          </div>
          <div>
            <strong>Descrição do Pedido:</strong>
            <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>
              Solicitação de cópia do contrato de pavimentação da Rua das Flores e lista de materiais utilizados na obra.
            </p>
          </div>
        </div>

        <form onSubmit={handleTriage}>
          <div className="form-group">
            <label className="form-label">Encaminhar para Departamento</label>
            <select 
              className="form-control" 
              value={department} 
              onChange={(e) => setDepartment(e.target.value)}
              required
            >
              <option value="">Selecione um departamento...</option>
              <option value="OBRAS">Secretaria de Obras e Urbanismo</option>
              <option value="SAUDE">Secretaria de Saúde</option>
              <option value="EDUCACAO">Secretaria de Educação</option>
              <option value="FAZENDA">Secretaria da Fazenda</option>
              <option value="ADMIN">Secretaria de Administração</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Classificação de Sigilo</label>
            <select 
              className="form-control" 
              value={secrecyLevel} 
              onChange={(e) => setSecrecyLevel(e.target.value)}
              required
            >
              <option value="PUBLICO">Público (Acesso Irrestrito)</option>
              <option value="RESERVADO">Reservado (5 anos)</option>
              <option value="SECRETO">Secreto (15 anos)</option>
              <option value="ULTRA_SECRETO">Ultrassecreto (25 anos)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Observações Internas (Opcional)</label>
            <textarea 
              className="form-control" 
              rows={4} 
              placeholder="Adicione instruções adicionais para o setor responsável..."
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <Forward size={20} />
              Confirmar Encaminhamento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TriageRequest;
