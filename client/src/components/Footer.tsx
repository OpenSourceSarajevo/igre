import { Github } from 'lucide-react';
import './Footer.css';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <p>
          &copy; {currentYear} &nbsp;
          <a
            href="https://github.com/OpenSourceSarajevo"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open Source Sarajevo
          </a>
        </p>
        
        <div className="footer-links">
          <a
            href="https://github.com/OpenSourceSarajevo/igre"
            target="_blank"
            rel="noopener noreferrer"
            className="github-link"
          >
            <Github size={16} />
            GitHub
          </a>
          
        </div>
      </div>
    </footer>
  );
}