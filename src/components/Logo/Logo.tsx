import React from 'react';
import styles from './Logo.module.css';

interface LogoProps {
  label: string;
  slogan: string;
//   className:string;
}

const Logo: React.FC<LogoProps> = ({ label,slogan }) => {
  return (
    <>
      <p className={styles.logo}> {label}</p>
      <p className={styles.slogan}>{slogan}</p>
    </>
  );
};

export default Logo;
