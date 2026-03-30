import pkg from '../../package.json';
import styles from './AppFooter.module.css';

export default function AppFooter() {
  return (
    <footer className={styles.appFooter}>
      <span className={styles.version}>{pkg.version}</span>
    </footer>
  );
}
