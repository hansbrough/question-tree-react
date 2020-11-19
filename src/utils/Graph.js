/*
* *Singleton* w/helper methods to ingest and get data from a given *module graph*.
* note: public methods prefixed with 'this' keyword (others are private)
*/
const Graph = function() {
  this.store = null;
  this.modules = null;
  this.fetching = null;

  /*--ingest---*/
  this.digest = (resp) => {
    const payload = resp || resp.data
    this.fetching = false;
    setStore(payload);
    setModules(payload);
    return !!resp;
  };
  //
  this.fetch = (config_url) => {
    if(config_url && !this.fetching) {
      this.fetching = true;
      config_url = `${config_url}.json`;
      return fetch(config_url, {method:'get'})
      .then(resp => resp.json())
      .then(this.digest);
    }
  };

  /*---setters---*/
  const setStore = payload => this.store = payload;
  const setModules = (payload) => {
     this.modules = Object.keys((() => { const { meta, ...modules } = payload; return modules; })());
  }

  /*--getters---*/
  const getStore   = () => this.store;
  const getModules = () => this.modules;
  this.getFirstQuestionInModule = (modId) => {
    return (modId && this.store && this.store[modId]) ? this.store[ modId ].questions[0] : null;
  }
  //this.getFirstQuestionInModule = (modId) => (modId && this.store && this.store[modId]) ? this.store[ modId ].questions[0] : null;
  //const getId = () => (this.store && this.store.meta) ? this.store.meta.graph_id : null;
  // get module Object
  const getModuleByQid = (qid) => {
    const modNames = Object.keys(this.store);
    for(const mod of modNames) {
      const {questions} = this.store[mod];
      if(questions && !!questions.find(item => item.id === qid)) {
        return this.store[mod];
      }
    }
  };
  // get module ID
  this.getModuleIdByQid = (qid) => {
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
  this.getIdxOfQidInModule = qid => getModuleQids(qid).indexOf(qid);
  /*
  * given a question id - determine if it is the last in a module's 'basepath'.
  * looks for last question with a 'next' prop.
  */
  this.getQidIsLastInModuleBasePath = qid => {
    const {questions} = getModuleByQid(qid) || {};//get questions obj by destructuring
    const basePathQuestions = questions && questions.filter(q => q.next);
    const lastModQuestion = basePathQuestions && basePathQuestions.slice(-1).pop();
    return qid === (lastModQuestion && lastModQuestion.next);
  }
  /*
  * given a question id return an array of all qid's in it's module
  * default to empty array if 'qid' doesnt exist in graph
  */
  const getModuleQids = qid => {
    let qids, mod;
    if(qid){
      mod = getModuleByQid(qid);
      if(mod){
        qids = mod.questions.map(a => a.id);
      }
    }
    return qids || [];
  }
  //
  this.getModuleTitleById = (id) => (this.store && id && this.store[id]) ? this.store[id].title : null;
  /*
  * Given a current module find the next module
  * 1. use 'next' value from current module in graph or
  * 2. if no 'next' property use next module by index
  * 3. else use first module.
  */
  this.getNextModuleId = (moduleId) => {
    const store   = getStore();
    const modules = getModules();
    let nextId;
    if(store && store[moduleId] && store[moduleId].next) {
      nextId = store[moduleId].next;
    } else if(store && moduleId) {
      let currentIdx = store && Object.keys(store).indexOf(moduleId);
      nextId = currentIdx && modules[currentIdx+1];
    } else {
      nextId = modules && modules[0];
    }
    return nextId;
  };
  /*
  * given a module id and question id get the question entry.
  */
  this.getModuleQuestion = (modId, questionId) => getQuestionsByModuleId(modId).find(q => q.id === questionId);
  /*
  * given a module id and question id determine the next question.
  */
  this.getNextModuleQuestion = (modId, questionId) => {
    const questionSequence  = getQuestionsByModuleId(modId);
    return questionSequence.find((item) => item.id === questionId);
  };
  /*
  * determine the total number of questions in the graph
  * (not inclusive of conditional questions)
  * note: will count questions in unused modules
  */
  this.getBasePathLength = () => this.modules.reduce((acc, modId) => {
    return acc + this.store[modId]['questions' || []].length
  }, 0);
  /*
  * return boolean describing if question id is part of the 'base path'
  */
  this.getIsQidInBasePath = qid => !!this.getModuleIdByQid(qid);
  /*
  * return question object given a question id
  */
  const getQuestionById = (id) => {
    const mods = Object.values(this.modules);
    let question;
    for(const mod of mods) {
      const questions = getQuestionsByModuleId(mod)
      question = questions && questions.find(q => q.id === id);
      if(question) {
        break;
      }
    }
    return question;
  };
  const getQuestionsByModuleId = id => (this.store && this.store[id]) ? this.store[id].questions : null;
  /*
  * given a start point node for a conditional path - return the squential path end node
  * e.g. conditional node 'plantId_3' was reached from base path node 'plantId_1' so return
  * the 'next' base path node of 'plantId_2' which would have been used was it not for the conditional branch.
  * defaults to null value if question not found in graph base path (e.g. 'detour' question)
  */
  this.getSequentialEndPoint = question => {
    const prevGraphQuestion = getQuestionById(question.previous);
    return (prevGraphQuestion) ? prevGraphQuestion.next : null;
  };
};

export default new Graph();
