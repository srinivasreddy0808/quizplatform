import styles from "./Explosion.module.css"; // Import the CSS Module

const Explosion = () => {
  return (
    <div className={styles.explosion}>
      <div className={styles.explosionCircle}></div>
      <div className={`${styles.explosionCircle} ${styles.delay1}`}></div>
      <div className={`${styles.explosionCircle} ${styles.delay2}`}></div>
    </div>
  );
};

export default Explosion;
