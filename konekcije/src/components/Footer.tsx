import './Footer.css';

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>
          Napravio{' '}
          <a
            href="https://github.com/OpenSourceSarajevo"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open Source Sarajevo
          </a>
        </p>
        <p className="footer-links">
          <a
            href="https://github.com/OpenSourceSarajevo/igre"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </p>
      </div>
    </footer>
  );
}
