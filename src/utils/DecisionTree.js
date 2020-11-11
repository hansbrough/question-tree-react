/*
*
*/
//import Graph from "./Graph";
import Graph from "./Graph2";
//import Questions from "./Questions";
import Questions from "./Questions2";

export default class DecisionTree {
  static runningDelta     = 0;
  static currentModuleId  = null;
  static currentQuestion  = null;
  static defaultScreen    = null;
  static history          = [];

  static init = (options={}) => {
    console.log('DecisionTree init:',options);
    console.log("...Graph:",Graph);
    const { base_url: baseUrl='', graph_path, question_set_path, defaultScreen='introduction' } = options;
    const graphPath = graph_path && `${baseUrl}${graph_path}`;
    const questionSetPath = question_set_path && `${baseUrl}${question_set_path}`;
    this.setDefaultScreen(defaultScreen);
    return Promise.all([Graph.fetch(graphPath), Questions.fetch(questionSetPath)]);
  };

  /*-- getters --*/
  /*
  * return object with current question index and the total question count.
  * account for conditional questions by setting current idx to items in history.
  */
  static getQuestionPosition = (question) => ({current: this.history.length, total: this.getTotalQuestionCount(question)})
  //
  static getTotalQuestionCount = (question) => {
    //console.log("DecisionTree"," getTotalQuestionCount");
    this.updateRunningDelta(question);
    return Graph.getBasePathLength() + this.runningDelta;
  };
  /*
  * uses graph store to return object based on 'next' question id from 'config' arg.
  * by default uses 'next' question id from the current question.
  */
  static getNextQuestionFromGraph = (config) => {
    console.log("DecisionTree"," getNextQuestionFromGraph config:",config);
    const nextQuestionId = (config) ? config.id : this.currentQuestion.next;
    console.log("...nextQuestionId:",nextQuestionId)
    //if next question obj passed in ... determine it's sequential 'next' question
    const question      = Graph.getNextModuleQuestion(this.currentModuleId, nextQuestionId);
    //const nextQuestion  = (question && question.next) ? {next:question.next} : {};
    console.log("...question:",question)
    //return nextQuestion;
    return question;
  };
  /*
  * based on questonObj determine which level of 'next' we should use - from graph or questions
  * return object with id and a conditional value if next question is conditional (not from module graph)
  */
  static getNextQuestionId = (question, options={}) => {
    console.log("getNextQuestionId: ",question, options);
    const payload = { id: null };
    const {labelIdx}  = options;
    const {labels} = question;
    const answer = labelIdx && labels && labels.find(item => item.qid === labelIdx);

    if(answer && answer.next) {
      console.log("... conditional by labelIdx: ",labelIdx);
      payload.id = answer.next;
      payload.conditional = true;
    } else if(question.next) {
      console.log("... by graph");
      payload.id = question.next;
    } else if(question.conditional) {
      console.log("... no next value. return to base path.");
      question = Questions.getFirstConditionalInPath(question);
      payload.id = Graph.getSequentialEndPoint(question);
      console.log(".... base path next id:",payload.id);
    }
    payload.module = Graph.getModuleIdByQid(payload.id);
    console.log("......payload:",payload);
    return payload;
  };
  /*
  * for conditional paths return length
  */
  static getPathDelta = (question) => {
    let delta = 0;
    if(question && question.conditional) {
      console.log("DecisionTree"," getPathDelta: ",question);
      const targetQuestionInBasePath = Graph.getIsQidInBasePath(question.id);
      const firstConditional = Questions.getFirstConditionalInPath(question);
      const basePathEndPt = Graph.getSequentialEndPoint(firstConditional);
      //console.log("......basePathEndPt:",basePathEndPt);
      const conditionalPathEndPt = firstConditional.id;
      //console.log("......conditionalPathEndPt",conditionalPathEndPt);
      const basePathEndPtIdx = Graph.getIdxOfQidInModule(basePathEndPt);
      const conditionalPathEndPtIdx = Graph.getIdxOfQidInModule(conditionalPathEndPt);
      const conditionalPathEndPtDefined = Questions.getNodeById(conditionalPathEndPt);
      //console.log("......basePathEndPtIdx:",basePathEndPtIdx);
      //console.log("......conditionalPathEndPtIdx:",conditionalPathEndPtIdx);
      //console.log("......QTN.getNodeById():",Question.getNodeById(conditionalPathEndPt))
      //determine path type - TODO:pull out into own method
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
        console.log("......... unknown path type!");
      }
    }
    //console.log("...delta:",delta);
    return delta;
  };

  /*-- setters --*/
  static setCurrentModuleId = val => this.currentModuleId = val;
  static setCurrentQuestion = (question) => {
    console.log("setCurrentQuestion")
    if(question) {
      this.setHistory('add', question);//add qid to history stack.
      const prevQuestionId  = (this.currentQuestion) ? this.currentQuestion.id : this.defaultScreen;
      question = Object.assign(question, {previous:prevQuestionId});
      const positionData    = this.getQuestionPosition(question);

      console.log("...positionData:",positionData);
      //determine if is second to last and last question.
      if( positionData.total / positionData.current === 1){
        console.log("......this is the last question");
        Object.assign(question, {last:true});
      }
      if( positionData.total - positionData.current === 1){
        console.log("......this is the penultimate question")
        Object.assign(question, {penultimate:true});
      }

      this.currentQuestion = Object.assign(question, {position:positionData});
      console.log("... currentQuestion has been extended with 'previous' property");
      Questions.update(this.currentQuestion);//sync questions store

      //PubSub.publish('question:change', this.currentQuestion);
    }
};
  static setDefaultScreen = val => this.defaultScreen = val;
  static setHistory = (verb, obj) => {
    console.log('setHistory:',verb, obj);
    switch(verb) {
      case 'add':
        this.history.push( obj.id );
        break;
      case 'delete':
        this.history = this.history.slice(0, this.history.length - 1);//remove current question.
        break;
      default:
        break;
    }
  };
  static updateRunningDelta = (question) => this.runningDelta += this.getPathDelta(question);

  /*-- called from client code --*/
  // finds and sets the 'next' question as the 'current question'.
  // return question to caller.
  static next = (config) => {
    console.log('-----DecisionTree next-----');
    console.log("...config:",config);
    const question = { views: 0 };
    let firstModuleQuestion;
    if( !this.currentQuestion ) {//0 case. first question.
      console.log("...first question");
      this.setCurrentModuleId( Graph.getNextModuleId() );
      firstModuleQuestion = Graph.getFirstQuestionInModule(this.currentModuleId);
      Object.assign(question, firstModuleQuestion, { first: true });
    } else {
      console.log("...not first question:",this.currentQuestion);
      const nextModuleId    = Graph.getNextModuleId( this.currentModuleId );
      const nextQuestionObj = this.getNextQuestionId( this.currentQuestion, config );
      console.log("...nextModuleId:",nextModuleId," nextQuestionObj:",nextQuestionObj);
      if(nextQuestionObj.id) {//use next question in this module
        console.log("...currentQuestion is followed by another question in same module");
        const graphNextQuestion = this.getNextQuestionFromGraph(nextQuestionObj) || {};
        Object.assign(question, nextQuestionObj, graphNextQuestion);
      } else if(nextModuleId && nextModuleId !== 'module_final') {//jump to next module
        console.log("...go to next module");
        this.setCurrentModuleId( nextModuleId );
        firstModuleQuestion = Graph.getFirstQuestionInModule(nextModuleId);
        Object.assign(question, firstModuleQuestion);
      } else {//account for last module.
        console.log("...graph complete");
        this.setCurrentModuleId( nextModuleId );
        firstModuleQuestion = Graph.getFirstQuestionInModule(nextModuleId);
        Object.assign(question, firstModuleQuestion);
      }
    }

    if(question) {
      console.log('... question before being extended: ',question);
      Object.assign(question, Questions.getNodeById(question.id), { module : this.currentModuleId }, config);
      question.views++;
      console.log('..... question after being extended a second time: ',question);
    }

    this.setCurrentQuestion(question);
    // return val may be used by UI component
    return question;
  };

  //
  static prev = () => {
    //console.log('prev');
    let   question  = null;
    const len       = this.history.length;
    if( len > 0 ){
      this.setHistory('delete');
      //console.log('...', this.history);
      question = Questions.getNodeById( this.history.pop() );
    }
    //keep internal state in sync w/UI change
    //console.log('... ',question);
    question.views++;
    this.setCurrentQuestion(question);//add question back as currentQuesion
    this.setCurrentModuleId(question.module);

    return question;
  };

}
