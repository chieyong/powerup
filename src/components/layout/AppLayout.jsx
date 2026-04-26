import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

const childNav = [
  { to: '/',        icon: '⭐', label: 'Vandaag' },
  { to: '/groei',   icon: '📈', label: 'Groei' },
  { to: '/samen',   icon: '💬', label: 'Samen' },
];

const parentNav = [
  { to: '/ouder',            icon: '🏠', label: 'Overzicht' },
  { to: '/ouder/gewoontes',  icon: '✏️', label: 'Gewoontes' },
  { to: '/ouder/beloning',   icon: '🎮', label: 'Beloning' },
];

export default function AppLayout() {
  const { mode, setMode, child } = useApp();
  const navigate = useNavigate();
  const nav = mode === 'child' ? childNav : parentNav;

  return (
    <div style={styles.root}>
      {/* Header — donker Tetris-thema */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          {/* Logo in Bangers via h1-global-regel */}
          <span style={styles.logo}>PowerUp ⚡</span>

          <button
            style={styles.modeToggle}
            onClick={() => {
              const next = mode === 'child' ? 'parent' : 'child';
              setMode(next);
              navigate(next === 'child' ? '/' : '/ouder');
            }}
            aria-label={mode === 'child' ? 'Naar oudermodus' : 'Naar kindmodus'}
          >
            <span style={styles.modeToggleText}>
              {mode === 'child' ? '👤 Ouder' : `👦 ${child.name}`}
            </span>
          </button>
        </div>

        {/* Mode indicator strip */}
        <div style={{
          ...styles.modeStrip,
          backgroundColor: mode === 'child' ? 'var(--color-purple)' : 'var(--color-amber)',
        }} />
      </header>

      {/* Page content */}
      <main style={styles.main}>
        <Outlet />
      </main>

      {/* Bottom navigation — donker Tetris-thema */}
      <nav style={styles.nav} aria-label="Navigatie">
        {nav.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/' || item.to === '/ouder'}
            style={({ isActive }) => ({
              ...styles.navItem,
              ...(isActive ? styles.navItemActive : {}),
            })}
          >
            <span style={styles.navIcon}>{item.icon}</span>
            <span style={styles.navLabel}>{item.label}</span>
            {/* Active indicator blokje — Tetris-pixel stijl */}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100dvh',
    maxWidth: 'var(--max-width)',
    margin: '0 auto',
    position: 'relative',
    backgroundColor: 'var(--color-bg)',
  },

  /* Donkere header — Tetris primary kleur */
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    backgroundColor: 'var(--color-dark)',
    height: 'var(--header-height)',
    overflow: 'hidden',
  },
  headerInner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 'calc(100% - 3px)', /* ruimte voor de mode-strip */
    padding: '0 var(--space-5)',
  },
  logo: {
    fontFamily: 'var(--font-display)',
    fontSize: 'var(--font-size-xl)',
    letterSpacing: '0.03em',
    color: 'var(--color-text-on-dark)',
    lineHeight: 1,
  },
  modeToggle: {
    backgroundColor: 'rgba(223, 231, 255, 0.10)',
    border: '1px solid rgba(223, 231, 255, 0.20)',
    borderRadius: 'var(--radius-md)',
    padding: '6px 12px',
    cursor: 'pointer',
    transition: 'background var(--transition-fast)',
  },
  modeToggleText: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--font-size-xs)',
    color: 'var(--color-text-on-dark)',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
  /* 3px kleur-strip onderkant header — geeft aan welke modus actief is */
  modeStrip: {
    height: 3,
    transition: 'background-color var(--transition-base)',
  },

  main: {
    flex: 1,
    overflowY: 'auto',
    paddingBottom: 'calc(var(--nav-height) + var(--space-4))',
  },

  /* Donkere nav — Tetris primary kleur */
  nav: {
    position: 'fixed',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100%',
    maxWidth: 'var(--max-width)',
    height: 'var(--nav-height)',
    backgroundColor: 'var(--color-dark)',
    borderTop: '1px solid rgba(223,231,255,0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    zIndex: 100,
    boxShadow: '0 -4px 24px rgba(28,32,43,0.40)',
  },
  navItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '3px',
    padding: '8px 12px',
    borderRadius: 'var(--radius-md)',
    color: 'rgba(223,231,255,0.65)',
    transition: 'all var(--transition-fast)',
    minWidth: 56,
    textDecoration: 'none',
  },
  navItemActive: {
    color: '#FFFFFF',
    backgroundColor: 'var(--color-purple)',
    boxShadow: '0 0 12px var(--color-purple-glow)',
  },
  navIcon: {
    fontSize: 20,
    lineHeight: 1,
  },
  navLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
};
