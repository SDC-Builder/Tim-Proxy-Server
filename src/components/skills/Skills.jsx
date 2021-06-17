import React from 'react';

const Skills = (props) => {
  // console.log('alkjsdfa;lkdjsfa;lkdjsf;lakjsdf;lakjsdf;lkja')
  const { state } = props;
  return (
    <div className="skills">
      <h2>Skills You Will Gain!</h2>
      <ul className="skills-list">
        {state.skills_you_will_gain.map((skill) => <li key={skill} className="skill-name">{skill}</li>)}
      </ul>
    </div>
  );
};

export default Skills;
