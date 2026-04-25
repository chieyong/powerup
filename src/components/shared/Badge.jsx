export default function Badge({ children, color = 'var(--color-primary)', bgColor = 'var(--color-primary-soft)', style }) {
  return (
    <span style={{ ...styles.badge, color, backgroundColor: bgColor, ...style }}>
      {children}
    </span>
  );
}

const styles = {
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    fontSize: 'var(--font-size-xs)',
    fontWeight: 'var(--font-weight-medium)',
    padding: '3px 10px',
    borderRadius: 'var(--radius-full)',
    whiteSpace: 'nowrap',
  },
};
