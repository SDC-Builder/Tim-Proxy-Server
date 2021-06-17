import React from 'react';
import Outcomes from './Outcomes.jsx';
import Facts from './Facts.jsx';

const Meta = (props) => {
  const { state, svgs } = props;
  return (
    <div id="meta">
      <Outcomes state={state} svgs={svgs} />
      <Facts state={state} svgs={svgs} />
    </div>
  );
};

export default Meta;
