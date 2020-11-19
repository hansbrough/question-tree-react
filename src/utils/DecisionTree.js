/*
* Singleton w/tools to help navigate a graph of questions.
* note: path to graph and questions supplied by parent.
*/
import Graph from "./Graph";
import Questions from "./Questions";

const DecisionTree = function() {
  //console.log("DecisionTree init")
  let runningDelta     = 0,
      currentModuleId  = null,
      currentQuestion  = null,
      defaultScreen    = null,
      direction        = 1,
      history          = [];

  /*
  * fetch and ingest given Module Graph and Question set
  */
  this.fetch = (options={}) => {
    const { base_url: baseUrl='', graph_path, question_set_path, defaultScreen='introduction' } = options;
    const graphPath = graph_path && `${baseUrl}${graph_path}`;
    const questionSetPath = question_set_path && `${baseUrl}${question_set_path}`;
    reset();//clear ref to old vals from previous graph.
    return Promise.all([Graph.fetch(graphPath), Questions.fetch(questionSetPath)]);
  };

  /*-- getters --*/
  //public interface - history
  this.hasPreviousQuestion = () => history.length > 1;
  //
  const getTotalQuestionCount = (question) => {
    console.log("DecisionTree"," getTotalQuestionCount");
    updateRunningDelta(getPathDelta(question));
    return Graph.getBasePathLength() + runningDelta;
  };
  /*
  * return object with current question index and the total question count.
  * account for conditional questions by setting current idx to items in history.
  */
  const getQuestionPosition = (question) => ({current: history.length, total: getTotalQuestionCount(question)})
  /*
  * uses graph store to return object based on 'next' question id from 'config' arg.
  * by default uses 'next' question id from the current question.
  */
  const getNextQuestionFromGraph = (config) => {
    //console.log("DecisionTree"," getNextQuestionFromGraph config:",config);
    const nextQuestionId = (config) ? config.id : currentQuestion.next;
    //console.log("...nextQuestionId:",nextQuestionId)
    //if next question obj passed in ... determine it's sequential 'next' question
    const question      = Graph.getNextModuleQuestion(currentModuleId, nextQuestionId);
    //console.log("...question:",question)
    return question;
  };
  /*
  * based on questonObj determine which level of 'next' we should use - from graph or questions
  * return object with id and a conditional value if next question is conditional (not from module graph)
  */
  const getNextQuestionId = (question, options={}) => {
    //console.log("getNextQuestionId: ",question, options);
    const payload = { id: null };
    const {labelIdx}  = options;
    const {labels} = question;
    const answer = labelIdx && labels && labels.find(item => item.qid === labelIdx);
    const lastQuestion = Graph.getQidIsLastInModuleBasePath(question.id);

    if(answer && answer.next) {
      //console.log("... conditional by labelIdx: ",labelIdx);
      payload.id = answer.next;
      payload.conditional = true;
    } else if(question.next) {
      //console.log("... by graph");
      payload.id = question.next;
    } else if(question.conditional && lastQuestion) {
      //question is conditional but last in module, advance to next module.
      payload.id = null;
    } else if(question.conditional) {
      //console.log("... no next value. return to base path.");
      question = Questions.getFirstConditionalInPath(question);
      payload.id = Graph.getSequentialEndPoint(question);
      //console.log(".... base path next id:",payload.id);
    }
    payload.module = Graph.getModuleIdByQid(payload.id);
    //console.log("......payload:",payload);
    return payload;
  };
  /*
  * determine path length difference from Base Path
  * for example when moving forward through graph, 'detours' should add to overal path length.
  * direction thru graph helps to determine value.
  */
  const getPathDelta = (question) => {
    //console.log("-- DecisionTree"," getPathDelta: ",question);
    let delta = 0;

    if(question && question.conditional) {
      const targetQuestionInBasePath = Graph.getIsQidInBasePath(question.id);
      const firstConditional = Questions.getFirstConditionalInPath(question);
      const basePathEndPt = Graph.getSequentialEndPoint(firstConditional);
      const conditionalPathEndPt = firstConditional.id;
      const basePathEndPtIdx = Graph.getIdxOfQidInModule(basePathEndPt);
      const conditionalPathEndPtIdx = Graph.getIdxOfQidInModule(conditionalPathEndPt);
      const conditionalPathEndPtDefined = Questions.getNodeById(conditionalPathEndPt);

      if(basePathEndPt && basePathEndPtIdx >= 0) {
        if(conditionalPathEndPtIdx >= 0){//Shortcut
          //console.log("......straight shortcut");
          delta = basePathEndPtIdx - conditionalPathEndPtIdx;
        } else if(targetQuestionInBasePath){//Shortcut (from mixed path)
          //console.log("......mixed shortcut");
          delta = basePathEndPtIdx - Graph.getIdxOfQidInModule(question.id);
        } else if(conditionalPathEndPtDefined){//Detour
          //console.log("......Detour Path, ",conditionalPathEndPt," defined just not in current module.")
          delta = 1;
        }
      } else if(!basePathEndPt && conditionalPathEndPtDefined){//detour off last base path node
        //console.log("......detour off last base path node");
        delta = 1;
      } else {
        //console.log("......... unknown path type!");
      }
    }
    delta = (!!direction) ? delta : -delta;

    // side effect - when backing out of conditional node, flip the conditional prop.
    if( !direction && delta !== 0 ) {
      console.log(".... remove conditional prop from:", question.id);
      Questions.updateNodeById(question.id, { conditional: false })
    }

    return delta;
  };

  /*-- setters --*/
  const setCurrentModuleId = val => currentModuleId = val;
  const setCurrentQuestion = (question) => {
    //console.log("DecisionTree setCurrentQuestion")
    if(question) {
      setHistory('add', question);//add qid to history stack.
      // only when moving fwd add 'previous' property.
      if(direction) {
        const prevQuestionId  = (currentQuestion) ? currentQuestion.id : defaultScreen;
        question = Object.assign(question, { previous: prevQuestionId });
      }
      const positionData    = getQuestionPosition(question);

      //console.log("...positionData:",positionData);
      //determine if is second to last and last question.
      if( positionData.total / positionData.current === 1){
        //console.log("......this is the last question");
        Object.assign(question, {last:true});
      }
      if( positionData.total - positionData.current === 1){
        //console.log("......this is the penultimate question")
        Object.assign(question, {penultimate:true});
      }

      currentQuestion = Object.assign(question, {position:positionData});
      //console.log("... currentQuestion has been extended with 'previous' property");
      Questions.update(currentQuestion);//sync questions store
    } else {
      currentQuestion = null;
    }
};
  const setDefaultScreen = val => defaultScreen = val;
  // updates path history. returns question id(s) operated on.
  const setHistory = (verb, obj) => {
    //console.log('setHistory:',verb, obj);
    let operand;
    switch(verb) {
      case 'add':
        operand = obj.id;
        history.push( obj.id );
        break;
      case 'delete':
        operand = history[history.length - 1];
        history = history.slice(0, history.length - 1);//remove current question.
        break;
      case 'clear':
        operand = history;
        history = [];
        break;
      default:
        break;
    }
    //console.log("...history after operation:",history)
    return operand;
  };
  const updateRunningDelta = (val) => runningDelta += val;
  const setDirection = val => direction = val;

  //clear any refs to prev vals
  const reset = () => {
    setDefaultScreen(defaultScreen);
    setCurrentQuestion();
    setHistory('clear');
    runningDelta = 0;
  };

  /*-- called from client code --*/
  // finds and sets the 'next' question as the 'current question'.
  // return question to caller.
  this.next = (config) => {
    console.log('-----DecisionTree next-----');
    //console.log("...config:",config);
    const question = { views: 0 };
    let firstModuleQuestion;
    setDirection(1);
    if( !currentQuestion ) {//0 case. first question.
      //console.log("...first question");
      setCurrentModuleId( Graph.getNextModuleId() );
      firstModuleQuestion = Graph.getFirstQuestionInModule(currentModuleId);
      Object.assign(question, firstModuleQuestion, { first: true });
    } else {
      //console.log("...not first question:",currentQuestion);
      const nextModuleId    = Graph.getNextModuleId( currentModuleId );
      const nextQuestionObj = getNextQuestionId( currentQuestion, config );
      //console.log("...nextModuleId:",nextModuleId," nextQuestionObj:",nextQuestionObj);
      if(nextQuestionObj.id) {//use next question in this module
        //console.log("...currentQuestion is followed by another question in same module");
        const graphNextQuestion = getNextQuestionFromGraph(nextQuestionObj) || {};
        Object.assign(question, nextQuestionObj, graphNextQuestion);
      } else if(nextModuleId && nextModuleId !== 'module_final') {//jump to next module
        //console.log("...go to next module");
        setCurrentModuleId( nextModuleId );
        firstModuleQuestion = Graph.getFirstQuestionInModule(nextModuleId);
        Object.assign(question, firstModuleQuestion);
      } else {//account for last module.
        //console.log("...graph complete");
        setCurrentModuleId( nextModuleId );
        firstModuleQuestion = Graph.getFirstQuestionInModule(nextModuleId);
        Object.assign(question, firstModuleQuestion);
      }
    }

    if(question) {
      //console.log('... question before being extended: ',question);
      Object.assign(question, Questions.getNodeById(question.id), { module : currentModuleId }, config);
      question.views++;
      console.log('....question: ',question);
    }

    setCurrentQuestion(question);
    // return val may be used by UI component
    return question;
  };

  //
  this.prev = () => {
    console.log('-----DecisionTree prev-----');
    let   question  = null;
    const len       = history.length;
    setDirection(0);
    if( len > 0 ){
      const removedQuestionId = setHistory('delete');
      const delta = getPathDelta(Questions.getNodeById(removedQuestionId));
      console.log("...delta:",delta)
      //when backing out of a conditional question - recalc of path length needed.
      updateRunningDelta(delta);
      // if( delta !== 0 ) {
      //   console.log(".... remove conditional prop from:", removedQuestionId);
      //   Questions.updateNodeById(removedQuestionId, { conditional: false })
      // }
      question = Questions.getNodeById( history.pop() );
    }
    //keep internal state in sync w/UI change
    //console.log('... ',question);
    question.views++;
    setCurrentQuestion(question);//add question back as currentQuesion
    setCurrentModuleId(question.module);

    return question;
  };
}

export default new DecisionTree();
