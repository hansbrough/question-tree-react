import React from 'react';
import GraphUI from './GraphUI';

const PathType = () => {

  const introText = "This is an intro screen. Click 'next' to start";
  return (
    <main>
      <h2>Sequential Path Example</h2>
      <p>
        A sequential path is a route through a question graph which avoids any conditional paths.
        The navigation structure is defined entirely in the Module Graph file. Questions 1 - 4 can also be considered the "Base Path".
      </p>
      <img
        src="https://user-images.githubusercontent.com/658255/28881940-98624038-775e-11e7-9a4e-c1672a51cd81.png"
        alt="sequential path diagram"
      />

      <GraphUI
        graph_path="/data/graph/sequential"
        question_set_path="/data/questions/sequential"
        intro_text={introText}
      />
      <h3>A closer look at the json files</h3>
      <b>Module Graph JSON</b>
      <p>
        Notice the Graph JSON below defines a simple base path for questions 1 - 3 without referencing the conditional fourth question.
        The module is complete once question 3 is finished as it has no 'next' property. Once a module's questions are completed - navigation moves onto the first question in the next module.
      </p>
      <pre><code>
        {`
          {
            "meta":{
              "graph_id":"2"
            },
            "module_plantId":{
              "title":"Plant Identification",
              "questions": [
                {"id":"plantId_1", "next":"plantId_2"},
                {"id":"plantId_2", "next":"plantId_3"},
                {"id":"plantId_3", "next":"plantId_4"},
                {"id":"plantId_4"}
              ],
              "next":"module_final"
            },
            "module_final":{
              "title":"Complete",
              "questions": [
                { "id":"quiz_results"}
              ]
            }
          }
        `}
      </code></pre>
      <b>Questions JSON</b>
      <p>
      In question 2's definition a conditional path is created to question 4 via the 'next' property.
      If the user selects this option they'll be redirected to question 4 before continuing along the base path defined in the Graph file above.
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
                {"title":"Agave celsii", "qid":"106"},
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
                {"type":"image", "src":"/assets/img/a_bracteosa_h_200.jpg"}
              ],
              "labels":[
                {"title":"Agave vilamoriana", "qid":"119"},
                {"title":"Aloe chabaudii", "qid":"120"},
                {"title":"Agave chaipensis", "qid":"121"},
                {"title":"Echeveria ferox", "qid":"122"},
                {"title":"Dudlyea pedalanthus", "qid":"123"}
              ],
              "actual":"120",
              "category":"quiz",
              "criterion":"agave",
              "type":"radio",
              "comment":"another chance at agave bracteosa w/a different picture."
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
