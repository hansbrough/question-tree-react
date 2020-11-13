import React from 'react';
import GraphUI from './GraphUI';

const PathType = () => {
  const introText = "This is an intro screen. Click 'next' to start";

  return (
    <main>
      <h2>Multi-Branch Path Example</h2>
      <p>Node from which multiple, conditional paths are available to choose from.</p>
      <img
        src="https://user-images.githubusercontent.com/658255/28884089-69aa222c-7765-11e7-8b3e-12ab5f657393.png"
        alt="Multi-Branch path diagram"
      />
      <GraphUI
        graph_path="/data/graph/index"
        question_set_path="/data/questions/index"
        intro_text={introText}
      />
      <h3>A closer look at the json files</h3>
      <b>Module Graph JSON</b>
      <p>
        some helpful commments...
      </p>
      <pre><code>
        {`
        `}
      </code></pre>
      <b>Questions JSON</b>
      <p>
        some helpful commments...
      </p>
      <pre><code>
        {`
        `}
      </code></pre>
    </main>
  )
};

export default PathType;
