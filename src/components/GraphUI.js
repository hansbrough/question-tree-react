/*
* Simple (perhaps even ugly) example of using the 'question-tree-core' package in React.
*/
import React, { useEffect, useState } from 'react';
import DecisionTree from 'question-tree-core';

const GraphUI = ({graph_path, question_set_path, intro_text='Introduction...'}) => {
  console.log("graph_path:",graph_path," question_set_path:",question_set_path)
  const [decisionTreeInitializing, setDecisionTreeInitializing] = useState();
  const [decisionTreeInitialized, setDecisionTreeInitialized] = useState();
  const [currentQuestion, setCurrentQuestion] = useState();
  const [currentAnswerId, setCurrentAnswerId] = useState();

  useEffect(() => {
    if(!decisionTreeInitializing) {
      const p = DecisionTree.fetch({graph_path, question_set_path});
      setDecisionTreeInitializing(true);
      p && p.then(setDecisionTreeInitialized);
    }
  },[graph_path, question_set_path, decisionTreeInitializing]);

  useEffect(() => {
    if(decisionTreeInitialized) {
      console.log("DecisionTree Initialized!");
    }
  },[decisionTreeInitialized]);

  // event handlers
  const handleNextClick = () => setCurrentQuestion(DecisionTree.next({ labelIdx: currentAnswerId }));
  const handlePrevClick = () => setCurrentQuestion(DecisionTree.prev());
  const handleInputChange = e => setCurrentAnswerId(e.target.id)

  return (
    <div className="graph-ui">
      <h4>Working Example</h4>
      {!currentQuestion &&
        <div style={{padding:".5rem"}}>{intro_text}</div>
      }
      {currentQuestion &&
        <div style={{padding:".5rem"}}>
          <p><em>Question ID:</em> "{currentQuestion.id}"</p>
          <p>{currentQuestion.title}</p>
          {currentQuestion.labels
            && currentQuestion.labels.map(
              item => (
                <label key={item.qid}>
                  <input type="radio" id={item.qid} onChange={handleInputChange}/>
                  {item.title}
                </label>
              )
          )}
        </div>
      }
      <button onClick={handlePrevClick}>Prev</button>
      <button onClick={handleNextClick}>Next</button>
    </div>
  );
};

export default GraphUI;
