import { X } from 'lucide-react';
import './RulesModal.css';

interface RulesModalProps {
  onClose: () => void;
}

export function RulesModal({ onClose }: RulesModalProps) {
  return (
    <div className="rules-overlay" onClick={onClose}>
      <div className="rules-modal" onClick={(e) => e.stopPropagation()}>
        <button className="rules-close" onClick={onClose}>
          <X size={24} />
        </button>
        
        <div className="rules-content">
          <h2>Kako igrati?</h2>
          <p className="subtitle">Pronađite grupe od četiri pojma koji imaju nešto zajedničko.</p>
          
          <ul className="rules-list">
            <li>Odaberite četiri stavke i pritisnite <strong>'Provjeri'</strong> da vidite je li vaš pogodak tačan.</li>
            <li>Pronađite sve grupe bez više od <strong>4 greške!</strong></li>
          </ul>

          <h3>Primjeri kategorija</h3>
          <div className="example-item">
            <p><strong>STVARI KOJE SE MOGU IZVUĆI:</strong> Pouka, Korist, Deblji kraj, Živa glava  </p>
          </div>
          <div className="example-item">
            <p><strong>HOROSKOPSKI ZNAKOVI + DODATNA SLOVA:</strong> Rakija, Lavanda, Ribar, Vaganje</p>
          </div>

          <p className="rules-note">
            Kategorije će uvijek biti specifičnije od "RIJEČI OD 5 SLOVA", "IMENA" ili "GLAGOLI".
          </p>
          <p className="rules-note">
            Svaka zagonetka ima tačno jedno rješenje. Čuvajte se riječi koje se čine kao da pripadaju u više kategorija!
          </p>

          <div className="difficulty-legend">
            <p>Svaka grupa ima boju koja se otkriva rješavanjem:</p>
            <div className="difficulty-row">
              <span className="dot yellow"></span> Jednostavno
            </div>
            <div className="difficulty-row">
              <span className="dot green"></span> Srednje
            </div>
            <div className="difficulty-row">
              <span className="dot blue"></span> Teško
            </div>
            <div className="difficulty-row">
              <span className="dot purple"></span> Vrlo teško
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}