import React from 'react';
import GraphUI from './GraphUI';

const PathType = () => {
  const introText = "This is an intro screen. Click 'next' to start";

  return (
    <main>
      <h2>Shortcut Path Example</h2>
        <p>
          A type of Conditional Path that allows users to bypass questions on the Base Path.
          In the diagram below the Graph Length is only 2 nodes if the shortcut is used.
        </p>
        <img
          src="https://user-images.githubusercontent.com/658255/28883099-294ebac4-7762-11e7-8e54-0b982504954f.png"
          alt="Shortcut path diagram"
        />
      <GraphUI
        graph_path="/data/graph/shortcut"
        question_set_path="/data/questions/shortcut"
        intro_text={introText}
      />
      <h3>A closer look at the json files</h3>
      <b>Module Graph JSON</b>
      <p>
      some helpful commments...
      </p>
      <pre><code>
        {`
  {
    "meta":{
      "graph_id":"1"
    },
    "module_plantId":{
      "title":"Plant Identification",
      "questions": [
        {"id":"plantId_1", "next":"plantId_2"},
        {"id":"plantId_2", "next":"plantId_3"},
        {"id":"plantId_3"}
      ],
      "next":"module_final"
    },
    "module_final":{
      "title":"What's Next",
      "questions": [
        { "id":"quiz_results"}
      ]
    }
  }
        `}
      </code></pre>
      <b>Questions JSON</b>
      <p>
      some helpful commments...
      </p>
      <pre><code>
        {`
  {
    "plantId_1":{
      "title":"Which of the following is the name of this plant?",
      "media": [
        {"type":"image", "src":"/img/al_aculeata_a_200.jpg"}
      ],
      "labels":[
        {"title":"Aloe aculeata", "qid":"105"},
        {"title":"'Shortcut'", "qid":"106", "next":"plantId_3"},
        {"title":"Aloe africana", "qid":"107"},
        {"title":"Gasteria baylissiana", "qid":"108"}
      ],
      "actual":"105",
      "category":"quiz",
      "criterion":"aloe",
      "type":"radio"
    },
    "plantId_2":{
      "title":"Which of the following is the name of this plant?",
      "media": [
        {"type":"image", "src":"/img/a_brevifolia_c_200.jpg"}
      ],
      "labels":[
        {"title":"Aloe arborescens", "qid":"109"},
        {"title":"Aloe vera", "qid":"110"},
        {"title":"Aloe africana", "qid":"111"},
        {"title":"Aloe brevifolia", "qid":"112"},
        {"title":"Aloe aculeata", "qid":"113"}
      ],
      "actual":"112",
      "category":"quiz",
      "criterion":"aloe",
      "type":"radio"
    },
    "plantId_3":{
      "title":"Which of the following is the name of this plant?",
      "media": [
        {"type":"image", "src":"/img/a_bracteosa_d_200.jpg"}
      ],
      "labels":[
        {"title":"Agave celsii", "qid":"114"},
        {"title":"Aloe vera", "qid":"115"},
        {"title":"Agave bracteosa", "qid":"116"},
        {"title":"Echeveria agavoides", "qid":"117"},
        {"title":"Dudlyea brittonii", "qid":"118"}
      ],
      "actual":"116",
      "category":"quiz",
      "criterion":"agave",
      "type":"radio"
    },

    "quiz_results":{
      "type":"summary",
      "qid":"10000"
    }
  }
        `}
      </code></pre>
    </main>
  )
};

export default PathType;
