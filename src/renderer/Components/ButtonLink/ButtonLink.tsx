import React from 'react';
import { Link, To, useMatch } from 'react-router-dom';

export interface ButtonLinkProps {
  children: React.ReactNode;
  to: To;
}

function ButtonLink({ children, to }: ButtonLinkProps) {
  const match = useMatch(to as string);
  return (
    <Link className={match ? 'button-link button-link-selected ' : 'button-link'} to={to}>
      {children}
    </Link>
  );
}

export default ButtonLink;
