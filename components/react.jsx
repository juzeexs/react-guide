import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';

// ═══════════════════════════════════════════════════════════════
// DADOS
// ═══════════════════════════════════════════════════════════════

const timeline = [
  { year: '2011', title: 'Nasce no Facebook', desc: 'Jordan Walke cria o FaxJS, precursor do React, para resolver problemas de performance no feed de notícias do Facebook.' },
  { year: '2013', title: 'Lançamento Público', desc: 'React é apresentado na JSConf EU. A recepção inicial foi mista devido ao JSX e à abordagem inovadora.' },
  { year: '2015', title: 'React Native', desc: 'A expansão para mobile revoluciona o mercado de apps híbridos, permitindo desenvolvimento nativo com React.' },
  { year: '2016', title: 'React 15.4', desc: 'Melhorias significativas em performance e a introdução de novas ferramentas de desenvolvimento.' },
  { year: '2019', title: 'Revolução dos Hooks', desc: 'useState e useEffect mudam o paradigma de classes para funções, simplificando radicalmente o desenvolvimento.' },
  { year: '2023', title: 'Server Components', desc: 'React Server Components trazem renderização no servidor como padrão, otimizando performance.' },
  { year: '2024+', title: 'Era Moderna', desc: 'Foco total em performance, DX e renderização híbrida com React 19 e além.' },
];

const concepts = {
  componentes: {
    icon: 'C', title: 'Componentes', shortDesc: 'Blocos reutilizáveis de UI.',
    code: `<span class="comment">// Componente funcional moderno</span>
<span class="keyword">function</span> <span class="function">Button</span>({ label, onClick }) {
  <span class="keyword">return</span> (
    &lt;<span class="variable">button</span> onClick={onClick}&gt;
      {label}
    &lt;/<span class="variable">button</span>&gt;
  );
}`
  },
  jsx: {
    icon: 'JS', title: 'JSX', shortDesc: 'JavaScript + Markup.',
    code: `<span class="comment">// JSX é transformado em JavaScript</span>
<span class="keyword">const</span> element = (
  &lt;<span class="variable">div</span> className=<span class="string">"container"</span>&gt;
    &lt;<span class="variable">h1</span>&gt;Olá, Mundo!&lt;/<span class="variable">h1</span>&gt;
    &lt;<span class="variable">p</span>&gt;Bem-vindo ao React&lt;/<span class="variable">p</span>&gt;
  &lt;/<span class="variable">div</span>&gt;
);`
  },
  virtualdom: {
    icon: 'VD', title: 'Virtual DOM', shortDesc: 'Performance otimizada.',
    code: `<span class="comment">// O React faz diffing automático</span>
<span class="comment">// Atualiza apenas o que mudou</span>

<span class="comment">// Antes:</span>
{ count: <span class="variable">0</span> }

<span class="comment">// Depois:</span>
{ count: <span class="variable">1</span> }

<span class="comment">// DOM atualizado minimalmente</span>`
  },
  hooks: {
    icon: 'H', title: 'Hooks', shortDesc: 'Estado em funções.',
    code: `<span class="keyword">import</span> { useState, useEffect } <span class="keyword">from</span> <span class="string">'react'</span>;

<span class="keyword">function</span> <span class="function">Counter</span>() {
  <span class="keyword">const</span> [count, setCount] = <span class="function">useState</span>(<span class="variable">0</span>);
  
  <span class="function">useEffect</span>(() => {
    document.title = <span class="string">\`Count: \${count}\</span>\`;
  }, [count]);
  
  <span class="keyword">return</span> &lt;<span class="variable">button</span> onClick={() => setCount(c => c + 1)}&gt;
    {count}
  &lt;/<span class="variable">button</span>&gt;;
}`
  },
};

const ecosystem = [
  { group: 'Frameworks', items: [
    { icon: 'N', name: 'Next.js', desc: 'Framework full-stack' },
    { icon: 'R', name: 'Remix', desc: 'Web nativa moderna' },
    { icon: 'G', name: 'Gatsby', desc: 'Sites estáticos' },
  ]},
  { group: 'Ferramentas', items: [
    { icon: 'V', name: 'Vite', desc: 'Build ultra-rápido' },
    { icon: 'T', name: 'Turbopack', desc: 'Bundler otimizado' },
    { icon: 'S', name: 'Storybook', desc: 'Documentação de UI' },
  ]},
  { group: 'Estado', items: [
    { icon: 'Z', name: 'Zustand', desc: 'Estado minimalista' },
    { icon: 'J', name: 'Jotai', desc: 'Estado atômico' },
    { icon: 'R', name: 'Redux', desc: 'Estado previsível' },
  ]},
  { group: 'Estilização', items: [
    { icon: 'TW', name: 'Tailwind', desc: 'Utility-first CSS' },
    { icon: 'M', name: 'Framer Motion', desc: 'Animações fluidas' },
    { icon: 'S', name: 'Styled Components', desc: 'CSS-in-JS' },
  ]},
];

// ═══════════════════════════════════════════════════════════════
// COMPONENTES DE UI
// ═══════════════════════════════════════════════════════════════

// Sistema de Partículas
const ParticlesCanvas = () => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: null, y: null });
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.max(1, Math.random() * 2);
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.5 + 0.1;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (mouseRef.current.x !== null) {
          const dx = mouseRef.current.x - this.x;
          const dy = mouseRef.current.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const force = (120 - dist) / 120;
            this.x -= dx * force * 0.02;
            this.y -= dy * force * 0.02;
          }
        }
        if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, Math.max(0.5, this.size), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 212, 170, ${this.opacity})`;
        ctx.fill();
      }
    }

    const initParticles = () => {
      particlesRef.current = [];
      const count = Math.min(80, Math.floor((width * height) / 15000));
      for (let i = 0; i < count; i++) particlesRef.current.push(new Particle());
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      particlesRef.current.forEach(p => { p.update(); p.draw(); });
      
      // Conexões
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const p1 = particlesRef.current[i];
          const p2 = particlesRef.current[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 212, 170, ${0.05 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      width = window.innerWidth; height = window.innerHeight;
      canvas.width = width; canvas.height = height;
      initParticles();
    };

    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: null, y: null };
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    
    initParticles();
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return <canvas ref={canvasRef} id="particles-canvas" />;
};

// Ícone do React
const ReactAtom = () => (
  <div className="react-atom-container">
    <svg className="react-atom" viewBox="0 0 100 100" aria-label="React Atom Logo">
      <ellipse cx="50" cy="50" rx="45" ry="18"/>
      <ellipse cx="50" cy="50" rx="45" ry="18" transform="rotate(60 50 50)"/>
      <ellipse cx="50" cy="50" rx="45" ry="18" transform="rotate(120 50 50)"/>
      <circle cx="50" cy="50" r="8"/>
    </svg>
  </div>
);

// Timeline Item com Intersection Observer
const TimelineItem = ({ data, index }) => {
  const itemRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), index * 100);
        }
      });
    }, { threshold: 0.2 });

    if (itemRef.current) observer.observe(itemRef.current);
    return () => { if (itemRef.current) observer.unobserve(itemRef.current); };
  }, [index]);

  return (
    <div className="timeline-item" ref={itemRef}>
      <div className="timeline-dot" />
      <div className="timeline-year">{data.year}</div>
      <div className="timeline-title">{data.title}</div>
      <div className="timeline-desc">{data.desc}</div>
    </div>
  );
};

// Seções
const TabHistoria = () => (
  <div className="section-content">
    <div className="section-header">
      <h2>A Jornada do React</h2>
      <p>De projeto interno do Facebook a biblioteca mais popular do mundo</p>
    </div>
    <div className="timeline">
      {timeline.map((item, i) => <TimelineItem key={i} data={item} index={i} />)}
    </div>
  </div>
);

const TabConceitos = ({ selected, onSelect }) => {
  const concept = selected ? concepts[selected] : null;

  return (
    <div className="section-content">
      <div className="section-header">
        <h2>Arquitetura React</h2>
        <p>Os pilares que tornam React único</p>
      </div>
      <div className="concept-grid">
        {Object.entries(concepts).map(([key, c]) => (
          <div 
            key={key} 
            className={`concept-card ${selected === key ? 'selected' : ''}`}
            onClick={() => onSelect(key)}
            tabIndex={0}
            role="button"
            aria-pressed={selected === key}
          >
            <div className="concept-icon">{c.icon}</div>
            <div className="concept-title">{c.title}</div>
            <div className="concept-desc">{c.shortDesc}</div>
          </div>
        ))}
      </div>
      {concept && (
        <div className="detail-box" style={{ marginTop: '2rem' }}>
          <div className="code-block">
            <div className="code-dots">
              <div className="code-dot"></div>
              <div className="code-dot"></div>
              <div className="code-dot"></div>
            </div>
            <pre className="code-content" dangerouslySetInnerHTML={{ __html: concept.code }} />
          </div>
        </div>
      )}
    </div>
  );
};

const TabDemo = () => {
  const [count, setCount] = useState(0);
  const [bump, setBump] = useState(false);

  const handleInc = () => {
    setCount(c => c + 1);
    setBump(true);
    setTimeout(() => setBump(false), 150);
  };
  
  const handleDec = () => {
    setCount(c => c - 1);
    setBump(true);
    setTimeout(() => setBump(false), 150);
  };

  return (
    <div className="section-content">
      <div className="section-header">
        <h2>Interatividade</h2>
        <p>Experimente o poder dos hooks</p>
      </div>
      <div className="demo-container">
        <div className="counter-card">
          <div className="counter-label">useState Demo</div>
          <div className={`counter-value ${bump ? 'bump' : ''}`}>{count}</div>
          <div className="counter-btns">
            <button className="btn btn-secondary" onClick={handleDec}>Diminuir</button>
            <button className="btn btn-primary" onClick={handleInc}>Incrementar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TabEcossistema = () => (
  <div className="section-content">
    <div className="section-header">
      <h2>Ecossistema</h2>
      <p>Ferramentas que potencializam seu desenvolvimento</p>
    </div>
    <div className="ecosystem-grid">
      {ecosystem.map(group => (
        <div className="ecosystem-group" key={group.group}>
          <div className="ecosystem-group-title">{group.group}</div>
          {group.items.map(item => (
            <div className="ecosystem-item" key={item.name}>
              <div className="ecosystem-icon">{item.icon}</div>
              <div className="ecosystem-info">
                <h4>{item.name}</h4>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════
// APP PRINCIPAL
// ═══════════════════════════════════════════════════════════════

export default function App() {
  const [activeTab, setActiveTab] = useState('historia');
  const [selectedConcept, setSelectedConcept] = useState(null);

  const renderContent = () => {
    switch(activeTab) {
      case 'historia': return <TabHistoria />;
      case 'conceitos': return <TabConceitos selected={selectedConcept} onSelect={setSelectedConcept} />;
      case 'demo': return <TabDemo />;
      case 'ecossistema': return <TabEcossistema />;
      default: return <TabHistoria />;
    }
  };

  return (
    <>
      {/* Camadas de Background */}
      <div className="aurora-bg" aria-hidden="true">
        <div className="aurora-blob"></div>
        <div className="aurora-blob"></div>
        <div className="aurora-blob"></div>
      </div>
      <div className="grid-pattern" aria-hidden="true"></div>
      <ParticlesCanvas />

      <div className="app">
        {/* Hero Section */}
        <header className="hero">
          <ReactAtom />
          <div className="hero-badge">
            <span className="badge-dot"></span>
            <span>Biblioteca JavaScript</span>
          </div>
          <h1>React</h1>
          <p className="hero-sub">
            A biblioteca que revolucionou o desenvolvimento web com componentização, performance e developer experience incomparáveis.
          </p>
          <div className="hero-stats">
            <div className="stat">
              <div className="stat-value">226M+</div>
              <div className="stat-label">Downloads/semana</div>
            </div>
            <div className="stat">
              <div className="stat-value">230K+</div>
              <div className="stat-label">GitHub Stars</div>
            </div>
            <div className="stat">
              <div className="stat-value">11+</div>
              <div className="stat-label">Anos de história</div>
            </div>
          </div>
        </header>

        {/* Navegação */}
        <nav className="tabs-container">
          <div className="tabs" role="tablist">
            {['historia', 'conceitos', 'demo', 'ecossistema'].map(tab => (
              <button
                key={tab}
                className={`tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => { setActiveTab(tab); if (tab !== 'conceitos') setSelectedConcept(null); }}
                role="tab"
                aria-selected={activeTab === tab}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </nav>

        {/* Conteúdo */}
        <main>
          {renderContent()}
        </main>
      </div>
    </>
  );
}