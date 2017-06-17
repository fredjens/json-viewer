import React from 'react';

const ExpandIcon = ({ expanded }) => {

  return (
    <span className="expand-icon">
      {expanded ? '-' : '+'}
    </span>
  );
}

export default ExpandIcon;
