/*
* helper / utility methods to get data from *module graph*.
*/
export default class Graph {
  static store;
  static modules;
  static fetching;

  /*--ingest---*/
  static digest = (resp) => {
    const payload = resp || resp.data
    this.fetching = false;
    this.setStore(payload);
    this.setModules(payload);
    return !!resp;
  };
  //
  static fetch = (config_url) => {
    if(!this.store && !this.fetching) {
      this.fetching = true;
      config_url = (config_url || '/data/graph/index') + '.json';
      return fetch(config_url, {method:'get'})
      .then(resp => resp.json())
      .then(this.digest);
    }
  };

  /*---setters---*/
  static setStore = payload => this.store = payload;
  static setModules = (payload) => {
     this.modules = Object.keys((() => { const { meta, ...modules } = payload; return modules; })());
  }

  /*--getters---*/
  static getStore   = () => this.store;
  static getModules = () => this.modules;
  static getFirstQuestionInModule = (modId) => (modId && this.store && this.store[modId]) ? this.store[ modId ].questions[0] : null;
  static getId = () => (this.store && this.store.meta) ? this.store.meta.graph_id : null;
  // get module Object
  static getModuleByQid = (qid) => {
    const modNames = Object.keys(this.store);
    for(const mod of modNames) {
      const {questions} = this.store[mod];
      if(questions && !!questions.find(item => item.id === qid)) {
        return this.store[mod];
      }
    }
  };
  // get module ID
  static getModuleIdByQid = (qid) => {
    const allModNames = Object.keys(this.store);
    for(const modName of allModNames) {
      const {questions} = this.store[modName];
      if(questions && !!questions.find(item => item.id === qid)) {
        return modName
      }
    }
  };
  /*
  * return index of question id in it's module of associated questions
  * default to -1 if 'qid' doesnt exist in graph
  */
  static getIdxOfQidInModule = qid => this.getModuleQids(qid).indexOf(qid);
  /*
  * given a question id return an array of all qid's in it's module
  * default to empty array if 'qid' doesnt exist in graph
  */
  static getModuleQids = qid => {
    let qids, mod;
    if(qid){
      mod = this.getModuleByQid(qid);
      if(mod){
        qids = mod.questions.map(a => a.id);
      }
    }
    return qids || [];
  }
  //
  static getModuleTitleById = (id) => (this.store && id && this.store[id]) ? this.store[id].title : null;
  /*
  * Given a current module find the next module
  * 1. use 'next' value from current module in graph or
  * 2. if no 'next' property use next module by index
  * 3. else use first module.
  */
  static getNextModuleId = (moduleId) => {
    //console.log("Graph getNextModuleId moduleId:",moduleId);
    const store   = this.getStore();
    const modules = this.getModules();
    let nextId;
    if(store && store[moduleId] && store[moduleId].next) {
      nextId = store[moduleId].next;
    } else if(store && moduleId) {
      let currentIdx = store && Object.keys(store).indexOf(moduleId);
      nextId = (currentIdx && modules[currentIdx+1]) || null;
    } else {
      nextId = modules && modules[0];
    }
    //console.log("...nextId:",nextId)
    return nextId;
  };
  /*
  * given a module id and question id get the question entry.
  */
  static getModuleQuestion = (modId, questionId) => this.getQuestionsByModuleId(modId).find(q => q.id === questionId);
  /*
  * given a module id and question id determine the next question.
  */
  static getNextModuleQuestion = (modId, questionId) => {
    //console.log("Graph", " getNextModuleQuestion: ",modId, questionId);
    const questionSequence  = this.getQuestionsByModuleId(modId);
    return questionSequence.find((item) => item.id === questionId);
  };
  /*
  * determine the total number of questions in the graph
  * (not inclusive of conditional questions)
  * note: will count questions in unused modules
  */
  static getBasePathLength = () => this.modules.reduce((acc, modId) => {
    return acc + this.store[modId]['questions' || []].length
  }, 0);
  /*
  * return boolean describing if question id is part of the 'base path'
  */
  static getIsQidInBasePath = qid => !!this.getModuleIdByQid(qid);
  /*
  * return question object given a question id
  */
  static getQuestionById = (id) => {
    //console.log("Graph", " getQuestionById:",id);
    const mods = Object.values(this.modules);
    //console.log("...mods:",mods);
    let question;
    for(const mod of mods) {
      const questions = this.getQuestionsByModuleId(mod)
      //console.log("...questions:",questions);
      question = questions && questions.find(q => q.id === id);
      if(question) {
        break;
      }
    }
    return question;
  };
  static getQuestionsByModuleId = id => (this.store && this.store[id]) ? this.store[id].questions : null;
  /*
  * given a start point node for a conditional path - return the squential path end node
  * e.g. conditional node 'plantId_3' was reached from base path node 'plantId_1' so return
  * the 'next' base path node of 'plantId_2' which would have been used was it not for the conditional branch.
  * defaults to null value if question not found in graph base path (e.g. 'detour' question)
  */
  static getSequentialEndPoint = question => {
    //console.log("Graph", " getSequentialEndPoint question:",question);
    const prevGraphQuestion = this.getQuestionById(question.previous);
    //console.log("...prevGraphQuestion:",prevGraphQuestion)
    return (prevGraphQuestion) ? prevGraphQuestion.next : null;
  };
};
