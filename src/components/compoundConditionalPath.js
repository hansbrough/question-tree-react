import React from 'react';
import GraphUI from './GraphUI';

const PathType = () => {
  const introText = "This is an intro screen. Click 'next' to start";

  return (
    <main>
      <h2>Compound Conditional Path Example</h2>
      <p>
        A Conditional Path with it's own nested conditional paths.
      </p>
      <img
        src="https://user-images.githubusercontent.com/658255/28884380-6d912060-7766-11e7-8ab9-da45c038dab2.png"
        alt="Compound Conditional path diagram"
      />
      <GraphUI
        graph_path="/data/graph/detour_compound"
        question_set_path="/data/questions/detour_compound"
        intro_text={introText}
      />
      <h3>A closer look at the json files</h3>
      <b>Module Graph JSON</b>
      <p>
        The <em>Base Path</em> is defined below as questions 1, 2 and 3.
        It's not possible to get to questions 4, 5, or 6 with out following a conditional path.
      </p>
      <pre><code>
        {`
  {
    "meta":{
      "graph_id":"1"
    },
    "module_plantId":{
      "title":"Plant Identification (Detour/Compound)",
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
        Question 2 contains an answer that is the top level conditional path.
        If a user goes down this route to question 4 they can choose one of the <em>nested</em> conditional paths which lead to questions 5 or 6.
        Questions 5 and 6 do not have their own conditional options defined so navigation will return to the <em>Base Paths</em> next item - question 3.
        Once question 3 is completed the module is also considered completed and navigation will move to the next Graph module.
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
        {"title":"Agave sp.", "qid":"106"},
        {"title":"Echeveria x agave 'Compound'", "qid":"107"},
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
        {"title":"Aloe africana", "qid":"111", "next":"plantId_4"},
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
    "plantId_4":{
      "title":"Which of the following is the name of this plant?",
      "media": [
        {"type":"image", "src":"/img/a_bracteosa_h_200.jpg"}
      ],
      "labels":[
        {"title":"Agave celsii", "qid":"114"},
        {"title":"Aloe vera", "qid":"115", "next":"plantId_5"},
        {"title":"Agave bracteosa", "qid":"116"},
        {"title":"Echeveria agavoides", "qid":"117","next":"plantId_6"},
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
        {"type":"image", "src":"/img/a_bracteosa_frost_200.jpg"}
      ],
      "labels":[
        {"title":"Agave bracteosa 'Calamar'", "qid":"119"},
        {"title":"Aloe sp.", "qid":"120"},
        {"title":"Agave bracteosa 'branch 1'", "qid":"121"},
        {"title":"Echeveria 'branch 2'", "qid":"122"},
        {"title":"Agave bracteosa varigata", "qid":"123"}
      ],
      "actual":"121",
      "category":"quiz",
      "criterion":"agave",
      "type":"radio"
    },
    "plantId_6":{
      "title":"Compound branch 1 Question 1",
      "media": [
        {"type":"image", "src":"/img/a_attenuata_a_200.jpg"}
      ],
      "labels":[
        {"title":"Agave bovicornuta", "qid":"124"},
        {"title":"Agave havardiana", "qid":"125"},
        {"title":"Agave attenuata", "qid":"126"},
        {"title":"Agave lophantha", "qid":"127"},
        {"title":"Agave bracteosa", "qid":"128"}
      ],
      "actual":"126",
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
