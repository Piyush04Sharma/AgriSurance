import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const FEATURES = [
  {
    icon: '🚜',
    iconClass: 'fi-green',
    title: 'Farmer Corner',
    desc: 'Apply for crop insurance directly. Browse policies tailored for your farm region and crop type.',
    link: '/register',
    linkText: 'Get Insured →',
  },
  {
    icon: '💰',
    iconClass: 'fi-gold',
    title: 'Premium Calculator',
    desc: 'Estimate your insurance premium instantly before applying. Enter your farm area and crop type.',
    link: '/about',
    linkText: 'Calculate Now →',
  },
  {
    icon: '📋',
    iconClass: 'fi-blue',
    title: 'Application Status',
    desc: 'Track your claim or policy application at every step, from submission to payout.',
    link: '/login',
    linkText: 'Check Status →',
  },
  {
    icon: '🌿',
    iconClass: 'fi-green',
    title: 'Krishi Rakshak Portal',
    desc: 'Report crop loss, file grievances, and communicate directly with your insurance provider.',
    link: '/dashboard',
    linkText: 'Report Loss →',
  },
  {
    icon: '🎓',
    iconClass: 'fi-gold',
    title: 'Learning Hub',
    desc: 'Access guides on smart farming, insurance policies, and best practices to protect your yield.',
    link: '/dashboard',
    linkText: 'Start Learning →',
  },
  {
    icon: '📈',
    iconClass: 'fi-blue',
    title: 'Yield Estimator',
    desc: 'AI-powered yield estimation based on satellite imagery, weather data, and soil conditions.',
    link: '/dashboard',
    linkText: 'Estimate Yield →',
  },
];

const STEPS = [
  { n: '1', title: 'Register', desc: 'Create your farmer or provider account in minutes.' },
  { n: '2', title: 'Choose Policy', desc: 'Browse active insurance plans that cover your crops.' },
  { n: '3', title: 'Submit Proof', desc: 'Capture land visuals and submit your claim digitally.' },
  { n: '4', title: 'Get Paid', desc: 'Receive approved payouts directly to your account.' },
];

// Particle positions (static for SSR safety)
const PARTICLES = [
  { top: '15%', left: '8%', delay: '0s', dur: '3.5s' },
  { top: '25%', left: '18%', delay: '0.5s', dur: '4s' },
  { top: '60%', left: '5%', delay: '1s', dur: '3s' },
  { top: '75%', left: '15%', delay: '1.5s', dur: '5s' },
  { top: '10%', left: '35%', delay: '0.3s', dur: '4.5s' },
  { top: '45%', left: '30%', delay: '0.8s', dur: '3.8s' },
  { top: '85%', left: '25%', delay: '2s', dur: '4.2s' },
  { top: '30%', left: '42%', delay: '1.2s', dur: '3.2s' },
];

function Home() {
  const heroRef = useRef(null);

  useEffect(() => {
    // Intersection observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.opacity = '1';
          e.target.style.transform = 'translateY(0)';
        }
      }),
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('.scroll-reveal').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div>
      {/* ══ HERO ══ */}
      <section className="home-hero" ref={heroRef}>
        <div className="hero-bg-layer" />
        <div className="hero-bg-pattern" />

        {/* Floating particles */}
        <div className="hero-particles">
          {PARTICLES.map((p, i) => (
            <div
              key={i}
              className="hero-particle"
              style={{
                top: p.top, left: p.left,
                animationDelay: p.delay,
                animationDuration: p.dur,
              }}
            />
          ))}
        </div>

        {/* Hero Left Content */}
        <div className="hero-content">
          <div className="hero-badge anim-fadeUp delay-1">
            <span className="dot" />
            Trusted by 50,000+ Farmers Across India
          </div>

          <h1 className="hero-title anim-fadeUp delay-2">
            Protect Your <span className="accent">Harvest</span>,<br />
            Secure Your <span className="green-accent">Future</span>
          </h1>

          <p className="hero-desc anim-fadeUp delay-3">
            India's most transparent crop insurance platform — connecting farmers with verified
            providers for seamless policy enrollment, digital claim submission, and instant payouts.
          </p>

          <div className="hero-cta-group anim-fadeUp delay-4">
            <Link to="/register" className="btn-primary" style={{ textDecoration: 'none', padding: '0.9rem 2rem', fontSize: '0.95rem', display: 'inline-flex', alignItems: 'center', gap: '8px', borderRadius: 'var(--radius-md)' }}>
              🌾 Start Protecting
            </Link>
            <Link to="/about" className="btn-secondary" style={{ textDecoration: 'none', padding: '0.9rem 2rem', fontSize: '0.95rem', display: 'inline-flex', alignItems: 'center', gap: '8px', borderRadius: 'var(--radius-md)' }}>
              Learn More
            </Link>
          </div>

          {/* Stats */}
          <div className="hero-stats anim-fadeUp delay-6">
            {[
              { num: '₹2.4Cr', label: 'Claims Paid' },
              { num: '98%', label: 'Approval Rate' },
              { num: '3 Days', label: 'Avg. Payout' },
            ].map((s, i) => (
              <div key={i}>
                <span className="hero-stat-num">{s.num}</span>
                <span className="hero-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Hero Right Visual (Policy Card Preview) */}
        <div className="hero-visual">
          <div className="hero-card-stack anim-scaleIn delay-4">
            <div className="hero-card-back hcb-1" />
            <div className="hero-card-back hcb-2" />
            <div className="hero-main-card">
              <div className="hmc-header">
                <div>
                  <div className="hmc-title">Flood Protection</div>
                  <div className="hmc-sub">National Agri Insurance</div>
                </div>
                <span className="hmc-chip active">Active</span>
              </div>
              <div className="hmc-divider" />
              <div className="hmc-row">
                <span className="hmc-row-label">Coverage Type</span>
                <span className="hmc-row-value">Flood / Water</span>
              </div>
              <div className="hmc-row">
                <span className="hmc-row-label">Premium</span>
                <span className="hmc-row-value gold">₹1,200 / season</span>
              </div>
              <div className="hmc-row">
                <span className="hmc-row-label">Max Payout</span>
                <span className="hmc-row-value gold">₹85,000</span>
              </div>
              <div className="hmc-row">
                <span className="hmc-row-label">Claim Status</span>
                <span className="hmc-row-value" style={{ color: 'var(--green-accent)' }}>Approved ✓</span>
              </div>
              <div className="hmc-progress-bar">
                <div className="hmc-progress-fill" style={{ width: '78%' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FEATURES ══ */}
      <section className="features-section">
        <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
          <div className="scroll-reveal">
            <div className="section-label">Everything You Need</div>
            <h2 className="section-title">Comprehensive <span className="accent">Farm Protection</span></h2>
            <p className="section-desc">
              From policy discovery to claim settlement — a complete digital ecosystem for Indian agriculture.
            </p>
          </div>

          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <div key={i} className={`feature-card scroll-reveal`} style={{ animationDelay: `${i * 0.08}s` }}>
                <div className={`feature-icon-wrap ${f.iconClass}`}>{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
                <Link to={f.link} className="feature-link">{f.linkText}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section className="how-section">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="scroll-reveal" style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
            <div className="section-label" style={{ justifyContent: 'center', display: 'flex' }}>Simple Process</div>
            <h2 className="section-title" style={{ textAlign: 'center' }}>
              Get Covered in <span className="accent">4 Steps</span>
            </h2>
          </div>

          <div className="steps-grid">
            {STEPS.map((s, i) => (
              <div key={i} className={`step-item scroll-reveal`}>
                <div className="step-number">{s.n}</div>
                <h3 className="step-title">{s.title}</h3>
                <p className="step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA BANNER ══ */}
      <section style={{
        padding: '5rem 5vw',
        textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(26,58,42,0.4) 0%, rgba(14,11,7,0.2) 100%)',
        borderTop: '1px solid rgba(255,255,255,0.04)',
      }}>
        <div className="scroll-reveal" style={{ maxWidth: '640px', margin: '0 auto' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌾</div>
          <h2 className="section-title" style={{ marginBottom: '1rem' }}>
            Ready to Protect Your <span className="accent">Crops?</span>
          </h2>
          <p style={{ marginBottom: '2rem', color: 'var(--earth-300)', fontSize: '1rem', lineHeight: 1.7 }}>
            Join thousands of farmers who have secured their livelihoods through AgriSurance.
            Register today and get your first policy in minutes.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn-primary" style={{ textDecoration: 'none', padding: '0.9rem 2.5rem', fontSize: '0.95rem', display: 'inline-flex', alignItems: 'center', gap: '8px', borderRadius: 'var(--radius-md)' }}>
              Register as Farmer
            </Link>
            <Link to="/register" className="btn-secondary" style={{ textDecoration: 'none', padding: '0.9rem 2.5rem', fontSize: '0.95rem', display: 'inline-flex', alignItems: 'center', gap: '8px', borderRadius: 'var(--radius-md)' }}>
              Join as Provider
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;

