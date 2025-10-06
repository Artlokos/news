import React from 'react';
import styles from './Header.module.css';
import Logo from '../Logo/Logo';

type HeaderProps = {
  label: string;
};

const Header: React.FC<HeaderProps> = () => {
  return (
    <header className={styles.header}>
      <Logo label='Pulsar' slogan='Пульс этого города'/>
    </header>
  );
};

export default Header;
