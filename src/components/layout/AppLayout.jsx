import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useApp } from '../../context/AppContext';

const childNav = [
  { to: '/',       icon: '⭐', label: 'Vandaag' },
  { to: '/groei',  icon: '📈', label: 'Groei' },
  { to: '/samen',  icon: '💬', label: 'Samen' },
];

const parentNav = [
  { to: '/ouder',           icon: '🏠', label: 'Overzicht' },
  { to: '/ouder/gewoontes', icon: '✏️', label: 'Gewoontes' },
  { to: '/ouder/beloning',  icon: '🎮', label: 'Beloning' },
];

export default function AppLayout() {
  const { mode, setMode, child, user, isDemo, signInWithGoogle, signOutUser } = useApp();
  const navigate = useNavigate();
  const nav = mode === 'child' ? childNav : parentNav;

  // Navigeer automatisch bij mode-wissel
  useEffect(() => {
    navigate(mode === 'child' ? '/' : '/ouder', { replace: true });
  }, [mode]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Header-knop logica ───────────────────────────────────────────────────
  // Demo (niet ingelogd): "Inloggen" → Google popup
  // Kind (Matthew): toont avatar — geen actie (hij hoeft niet uit te loggen)
  // Ouder (David) in kindmodus: "👤 Ouder" → schakel naar oudermodus
  // Ouder (David) in oudermodus: "👦 [naam]" → schakel naar kindmodus

  const isParentUser = user?.email === import.meta.env.VITE_PARENT_EMAIL;
  const isChildUser  = user?.email === import.meta.env.VITE_CHILD_EMAIL;

  const handleHeaderBtn = async () => {
    if (isDemo) {
      await signInWithGoogle();
    } else if (isParentUser) {
      // David wisselt tussen ouder- en kindmodus
      setMode(mode === 'child' ? 'parent' : 'child');
    }
    // Matthew: geen actie (knop is puur decoratief als avatar)
  };

  const headerBtnLabel = () => {
    if (isDemo)                              return '👤 Inloggen';
    if (isChildUser)                         return null; // alleen avatar
    if (isParentUser && mode === 'child')    return '👤 Ouder';
    if (isParentUser && mode === 'parent')   return `👦 ${child.name}`;
    return '👤 Inloggen';
  };

  const btnLabel = headerBtnLabel();

  return (
    <div style={styles.root}>
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <span style={styles.logo}>PowerUp ⚡</span>

          <div style={styles.headerRight}>
            {/* Demo-badge — laat zien dat dit voorbeelddata is */}
            {isDemo && (
              <span style={styles.demoBadge}>DEMO</span>
            )}

            <button
              style={{
                ...styles.modeToggle,
                cursor: isChildUser ? 'default' : 'pointer',
              }}
              onClick={handleHeaderBtn}
              aria-label={isDemo ? 'Inloggen' : isParentUser ? 'Wissel modus' : 'Ingelogd'}
            >
              {user?.photoURL && (
                <img
                  src={user.photoURL}
                  alt=""
                  style={styles.avatar}
                  referrerPolicy="no-referrer"
                />
              )}
              {btnLabel && (
                <span style={styles.modeToggleText}>{btnLabel}</span>
              )}
            </button>

            {/* Uitloggen — zichtbaar voor elke ingelogde gebruiker */}
            {!isDemo && (
              <button
                style={styles.signOutBtn}
                onClick={signOutUser}
                aria-label="Uitloggen"
                title="Uitloggen"
              >
                ↩
              </button>
            )}
          </div>
        </div>

        <div style={{
          ...styles.modeStrip,
          backgroundColor: isDemo
            ? 'var(--color-text-muted)'
            : mode === 'child'
              ? 'var(--color-purple)'
              : 'var(--color-amber)',
        }} />
      </header>

      <main style={styles.main}>
        <Outlet />
      </main>

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
    height: 'calc(100% - 3px)',
    padding: '0 var(--space-5)',
  },
  logo: {
    fontFamily: 'var(--font-display)',
    fontSize: 'var(--font-size-xl)',
    letterSpacing: '0.03em',
    color: 'var(--color-text-on-dark)',
    lineHeight: 1,
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-2)',
  },
  demoBadge: {
    fontFamily: 'var(--font-mono)',
    fontSize: 9,
    letterSpacing: '0.1em',
    color: 'rgba(223,231,255,0.50)',
    border: '1px solid rgba(223,231,255,0.20)',
    borderRadius: 'var(--radius-sm)',
    padding: '2px 6px',
  },
  modeToggle: {
    backgroundColor: 'rgba(223,231,255,0.10)',
    border: '1px solid rgba(223,231,255,0.20)',
    borderRadius: 'var(--radius-md)',
    padding: '6px 12px',
    transition: 'background var(--transition-fast)',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  modeToggleText: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--font-size-xs)',
    color: 'var(--color-text-on-dark)',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
  avatar: {
    width: 22,
    height: 22,
    borderRadius: '50%',
    objectFit: 'cover',
    flexShrink: 0,
  },
  signOutBtn: {
    backgroundColor: 'rgba(223,231,255,0.08)',
    border: '1px solid rgba(223,231,255,0.15)',
    borderRadius: 'var(--radius-md)',
    padding: '6px 10px',
    color: 'rgba(223,231,255,0.60)',
    fontSize: 14,
    cursor: 'pointer',
    transition: 'all var(--transition-fast)',
  },
  modeStrip: {
    height: 3,
    transition: 'background-color var(--transition-base)',
  },
  main: {
    flex: 1,
    overflowY: 'auto',
    paddingBottom: 'calc(var(--nav-height) + var(--space-4))',
  },
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
  navIcon:  { fontSize: 20, lineHeight: 1 },
  navLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
};
