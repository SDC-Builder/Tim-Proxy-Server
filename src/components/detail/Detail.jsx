import React from 'react';

const Detail = (props) => {
  const { state, expanded, click } = props;
  return (
    <div id="detail">
      <h2>About this Course</h2>
      <h3 className="recent-views">
        {`${state.recent_views.toLocaleString('en')} recent views`}
      </h3>
      <div className={'description expandable ' + expanded} onClick={click}>
        {state.description.split('\n').map((para, index) => <p key={index}>{para}</p>)}
      </div>
      <div className={'show-more-button ' + expanded}>
        <button onClick={click}>SHOW ALL</button>
      </div>
    </div>
  );
};

export default Detail;
