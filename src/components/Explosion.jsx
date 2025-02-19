import { useEffect, useState } from "react";
import styles from "./Explosion.module.css";
import PropTypes from "prop-types";

const Explosion = ({ x, y, onComplete }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const colors = ["#FFD700", "#FFA500", "#FF4500", "#FF0000"];
    const particleCount = 30;
    const newParticles = Array.from({ length: particleCount }, () => ({
      tx: (Math.random() - 0.5) * 200,
      ty: (Math.random() - 0.5) * 200,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    setParticles(newParticles);

    const timer = setTimeout(() => {
      onComplete();
    }, 800);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={styles.explosion} style={{ left: x, top: y }}>
      {particles.map((particle, i) => (
        <div
          key={i}
          className={styles.particle}
          style={{
            "--tx": `${particle.tx}px`,
            "--ty": `${particle.ty}px`,
            backgroundColor: particle.color,
          }}
        />
      ))}
    </div>
  );
};

Explosion.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  onComplete: PropTypes.func.isRequired,
};

export default Explosion;
