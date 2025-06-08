import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

const Logo: React.FC<LogoProps> = ({ 
  className = "", 
  width = 60, 
  height = 40 
}) => {
  return (
    <Link to="/" className="flex items-center">
      <img 
        src="/assets/images/logo.svg" 
        alt="Hunter Mussel Logo" 
        width={width * 3} 
        height={height}
        className={className}
      />
    </Link>
  );
};

export default Logo;
