/*
* Simple (perhaps even ugly) example of using the 'question-tree-core' package in React.
*/
import React, { useEffect, useState } from 'react';
import DecisionTree from 'question-tree-core';

const GraphUI = () => {
  const [decisionTreeInitializing, setDecisionTreeInitializing] = useState();
  const [decisionTreeInitialized, setDecisionTreeInitialized] = useState();
  const [currentQuestion, setCurrentQuestion] = useState();
  const [currentAnswerId, setCurrentAnswerId] = useState();

  useEffect(() => {
    if(!decisionTreeInitializing) {
      const p = DecisionTree.fetch({
        graph_path:'/data/graph/multi_node_path',
        question_set_path:'/data/questions/multi_node_path'
      });
      setDecisionTreeInitializing(true);
      p && p.then(setDecisionTreeInitialized);
    }
  },[decisionTreeInitializing]);

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
      {!currentQuestion &&
        <div style={{padding:".5rem"}}>Introduction...</div>
      }
      {currentQuestion &&
        <div style={{padding:".5rem"}}>
          <p>{currentQuestion.title}</p>
          <p>{currentQuestion.id}</p>
          {currentQuestion.labels
            && currentQuestion.labels.map(
              item => (
                <label key={item.qid}>{item.title}
                  <input type="radio" id={item.qid} onChange={handleInputChange}/>
                </label>
              )
          )}
        </div>
      }
      <button onClick={() => handlePrevClick()}>Prev</button>
      <button onClick={() => handleNextClick()}>Next</button>
    </div>
  );
};

export default GraphUI;
