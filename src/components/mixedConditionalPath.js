import React from 'react';
import GraphUI from './GraphUI';

const PathType = () => {
  const introText = "This is an intro screen. Click 'next' to start";

  return (
    <main>
      <h2>Mixed Conditional Path Example</h2>
      <p>
        A conditional path that contains both detour and shortcut paths.
        In the diagram below 'path 1' represents a Shortcut Path with a Graph Length of 3, while 'path 2' represents a Detour Path with a Graph Length of 5.
      </p>
      <img
        src="https://user-images.githubusercontent.com/658255/28886182-624b6d4e-776d-11e7-995a-c9047e55d185.png"
        alt="Mixed Conditional path diagram"
      />
      <GraphUI
        graph_path="/data/graph/mixed_conditional"
        question_set_path="/data/questions/mixed_conditional"
        intro_text={introText}
      />
      <h3>A closer look at the json files</h3>
      <b>Module Graph JSON</b>
      <p>
        The <em>Base Path</em> is declared as questions 1 - 3 with questions 4 and 5 unreachable unless accessed by the condtional routes.
        When both graphs are taken into account - there are three routes through the question set: the <em>Base Path</em>, the Detour path and the and Detour + Shortcut path.
      </p>
      <pre><code>
        {`
  {
    "meta":{
      "graph_id":"1"
    },
    "module_plantId":{
      "title":"Plant Identification - Mixed Conditional",
      "questions": [
        {"id":"plantId_1", "next":"plantId_2"},
        {"id":"plantId_2", "next":"plantId_3"},
        {"id":"plantId_3"},
        {"id":"plantId_4"},
        {"id":"plantId_5"}
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
        Question 1 used the 'next' property to set up a conditional route through questions 4 and 5.
        Question 4 also adds a shortcut route back to the last node on the base path (Question 3)
      </p>
      <pre><code>
        {`
  {
    "plantId_1":{
      "title":"Which of the following is the name of this plant?",
      "media": [
        {"type":"image", "src":"/assets/img/al_aculeata_a_200.jpg"}
      ],
      "labels":[
        {"title":"Aloe aculeata", "qid":"105"},
        {"title":"Agave sp.", "qid":"106"},
        {"title":"Detour", "qid":"107", "next":"plantId_4"},
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
        {"type":"image", "src":"/assets/img/a_brevifolia_c_200.jpg"}
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
        {"type":"image", "src":"/assets/img/a_bracteosa_d_200.jpg"}
      ],
      "labels":[
        {"title":"Kalinkoe luciae", "qid":"129"},
        {"title":"Agave havardiana", "qid":"130"},
        {"title":"Echeveria subrigida", "qid":"131"},
        {"title":"Echeveria lophantha", "qid":"132"},
        {"title":"Echeveria gigantium", "qid":"133"}
      ],
      "actual":"129",
      "category":"quiz",
      "criterion":"agave",
      "type":"radio"
    },
    "plantId_4":{
      "title":"Which of the following is the name of this plant?",
      "media": [
        {"type":"image", "src":"/assets/img/a_bracteosa_h_200.jpg"}
      ],
      "labels":[
        {"title":"Agave celsii", "qid":"114"},
        {"title":"Aloe vera", "qid":"115"},
        {"title":"Shortcut", "qid":"116","next":"plantId_3"},
        {"title":"Detour continued", "qid":"117","next":"plantId_5"},
        {"title":"Dudlyea brittonii", "qid":"118"}
      ],
      "actual":"116",
      "category":"quiz",
      "criterion":"agave",
      "type":"radio",
      "comment":"another chance at agave bracteosa w/a different picture."
    },
    "plantId_5":{
      "title":"A Detour Question",
      "media": [
        {"type":"image", "src":"/assets/img/a_bracteosa_frost_200.jpg"}
      ],
      "labels":[
        {"title":"Agave bracteosa 'Calamar'", "qid":"119"},
        {"title":"Aloe sp.", "qid":"120"},
        {"title":"Agave bracteosa", "qid":"121"},
        {"title":"Back to base path", "qid":"122"},
        {"title":"Agave bracteosa varigata", "qid":"123"}
      ],
      "actual":"121",
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
