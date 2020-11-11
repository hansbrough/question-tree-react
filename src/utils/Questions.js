/*
* helper / utility methods to get data from *question graph*.
*/
class Questions {
  static store = null;
  static options = {};
  static fetching = null;
  //
  static digest(resp) {
    //console.log("Questions"," digest() resp:",resp);
    Questions.fetching = false;
    Questions.store = resp || resp.data;
    const {baseUrl} = Questions.options;
    //conditionally prepend media src w/base url.
    //e.g. based on env differences.
    if(baseUrl){
      for(const q in resp) {
        if(resp[q].media) {
          resp[q].media.forEach(function(m){
            m.src = baseUrl + m.src;
          })
        }
      }
    }
    return !!resp;
  };
  //
  static fetch(config_url) {
    if(!this.store && !this.fetching) {
      this.fetching = true;
      config_url = (config_url || '/data/questions/index') + '.json';
      return fetch(config_url, {method:'get'})
      .then(resp => resp.json())
      .then(this.digest);
    }
  };
  /*
  * return which of a question's predecessors was first in a conditional branch.
  * an arg (question object) that is non-conditional is returned as a no-op.
  * useful for multi-node, conditional branches
  * ex. sequence of 'plantId_1' -> 'plantId_5'(cond) -> 'plantId_6'(cond)
  * will return 'plantId_5' question obj when method passed 'plantId_6' question obj
  */
  static getFirstConditionalInPath = (question) => {
    console.log("Questions"," getFirstConditionalInPath: ",question);
    let node = question;
    if(question.conditional) {
      console.log("...question is conditional ------ what was previous id? ",question.previous);
      const prevQuestion = this.getNodeById(question.previous);
      //console.log("...prevQuestion:",prevQuestion);
      if(prevQuestion.conditional) {
        //console.log("... continue look back")
        node = this.getFirstConditionalInPath(prevQuestion);//continue recursive look back.
      } else {
        //console.log("...done")
        node = question;
      }
    }
    return node;
  }
  //
  static getNodeById = (id) => id && this.store && this.store[id];
  //
  static getQuestionInSetByQid = (set, qid, options) => {
    //console.log("Questions"," getQuestionInSetByQid: ",set, qid, options);
    let len = set.length,
        q = null;
    while(len--){
      //console.log('... len:',len);
      if( qid === parseInt(set[len].qid) ){
        if(options){
          //console.log('.... extending set with options: ', options);
          Object.assign(set[len], options)
        }
        q = set[len];
        //console.log('.... found match.');
        break;
      }
    }
    return q;
  };
  /*
  * Update the question set with changes.
  */
  static update = (question) => this.store[question.id] = question;

};

export default Questions;
