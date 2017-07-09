/* global App, window */
//Define an AMD module
//loads the Marionette dependency which in turn loads it's dependency Backbone and so on...

define([
  'backbone',
  'marionette',
  'app/router',
  'mixins/ProgressBar'
  ],
  function (Backbone, Marionette, Router, Progress) {
    console.log("Survey.App Load");
    var appName, eduTopic;
/*
    if('_cc' in window){
      appName   = (_cc.appName) ? _cc.appName : 'unknown';
      eduTopic  = (_cc.eduTopic) ? _cc.eduTopic : null;
    }
*/
    var _App    = Marionette.Application.extend({
      appName: appName,
      channelName: 'app',
      radioEvents: {
        'cookie:update': 'handleCookieUpdate'
      },
      cookie:{},
      el:'.cricket-app',
      theme:null,
      Progress: new Progress(),
      postSurveyScreenLUT:{'EDUCATION':'education','DISCUSS':'discuss','DEFAULT':'discuss'},
      campaignScreenLUT:{'education':'education','groupchat':'discuss','DEFAULT':'discuss'},
      initialize: function(options){
        //console.log("Hope.App initialize");
        this.$el = $(this.el);
        this.Router = new Router({appName:appName,eduTopic:eduTopic});
      },
      handleCookieUpdate: function(evt){
        //console.log("App handleCookieUpdate evt:",evt);
        this.ingestCookies();
      },
      setCampaignScreen: function(){
        //console.log("QUESTIONNAIRE.App"," setCampaignScreen");
        var screenObj = {campaignScreen:this.campaignScreenLUT.DEFAULT};
        if(this.cookie.state_cricket && this.cookie.state_cricket.campaign){
          screenObj.campaignScreen = this.campaignScreenLUT[this.cookie.state_cricket.campaign] || this.campaignScreenLUT.DEFAULT;
        }
        _.extend(this, screenObj);
      },
      /*
      * set what screen follows survey based on cookie state
      */
      setPostSurveyScreen: function(){
        //console.log("QUESTIONNAIRE.App"," setPostSurveyScreen");
        var screenObj = {postSurveyScreen:this.postSurveyScreenLUT.DEFAULT};
        if(this.cookie.state_cricket && this.cookie.state_cricket.land_target){
          screenObj.postSurveyScreen = this.postSurveyScreenLUT[this.cookie.state_cricket.land_target];
        }
        _.extend(this, screenObj);
      },
      setTheme: function(value){
        //console.log("QUESTIONNAIRE.App"," setTheme");
        if(value && value !== ''){
          this.theme = value;
          Backbone.trigger('app:theme:set', value);
        }
      }
    });

    //instantiate app
    var QUESTIONNAIRE  = new _App();

    //Add some in house mixins
    //QUESTIONNAIRE = _.extend(QUESTIONNAIRE, CookieManager);

    QUESTIONNAIRE.on('start', function(){
      console.log("QUESTIONNAIRE"," Started");
      Backbone.history.start();
      Backbone.trigger('app:started');
    });

    //Listen to custom events
    Backbone.listenTo(Backbone, 'app:theme:fetched', function(name){
      //console.log("app:theme:fetched",name);
      if(name && name !== ''){
        QUESTIONNAIRE.setTheme(name);
      }
    });

    Backbone.listenTo( Backbone, 'app:theme:set', function(value){
      //console.log("QUESTIONNAIRE.App"," setThemeInUI");
      QUESTIONNAIRE.$el.addClass('theme-'+value);
    });

    Backbone.listenTo( Backbone, 'render:question', function(payload){
      //update url history when new question is rendered.
      var route = payload.id.split('_');
      QUESTIONNAIRE.Router.navigate('choices/'+route[0]+'/'+route[1]);
    });

/*
  App.controller('logout', function(page, options){
    options = options || {};
    //console.log("QUESTIONNAIRE.App"," logout screen:",options);
    var fragment = (options.forward) ? '/logout/'+options.forward : '/logout';
    QUESTIONNAIRE.Router.navigate(fragment);
  });

  App.controller('introduction', function(page){
    //console.log('introduction screen');
    QUESTIONNAIRE.Router.navigate('introduction');
    QUESTIONNAIRE.initialize();
  });

  //Life choice page controllers
  App.controller('work_choices', function (page) {
    //console.log('work_choices screen');
    var topic   = 'work';

    QUESTIONNAIRE.Router.navigate('choices/'+topic);
    $(page).find('#cta_next').on('click', function () {
      //determine if this question just answered has a follow up question.
      //need to examine user choice and match with label config... see if it has a 'next' property. if so get value
      //console.log("... ", QUESTIONNAIRE.Survey.next() );
    });
  });

  App.controller('profile', function (page) {
    //console.log('profile');
    QUESTIONNAIRE.Router.navigate('profile');
    $(page).find('#cta-next').on('click', function () {

    });
  });
*/
  return QUESTIONNAIRE;
});