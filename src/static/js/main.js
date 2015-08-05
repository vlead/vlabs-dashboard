window.VLD = window.VLD || {};
VLD.DS_URL = "http://localhost:5000";
(function (VLD) {

// Master View to control the selected values
var AppView = Backbone.View.extend({
  el: $('.container'),
  events: {
    'change #category': 'onSelect'
  },
  initialize: function() {
    this.on('detail-view', this.showDetailView);
  },
  onSelect: function(e) {
    var value = $(e.currentTarget).val();
    this.showCategory(value);
  },
  //TODO: comment to elaborate the use of dictionary maps to dynamically pick
  //up corresponding collections and views based on the selected category.
  showCategory: function(category) {
    console.log("category:", category);
    console.log("collection: ", collections[category]);
    var current_collection = new collections[category]();
    this.current_collection = current_collection;
    //var current_collection = new Labs();
    console.log(current_collection);
    current_collection.fetch({
      success: function(coll, response, opts) {
        var current_view = new list_views[category]({
          collection: current_collection,
          el: $('#result-set')
        });
        console.log(current_view);
        current_view.render();
      },
      error: function(coll, resp, opts) {
        alert("Error retrieving info");
      }
    });
  },
  showDetailView: function(type, id) {
    console.log('detailed view', type, id);
    /*var current_model = this.current_collection.filter({id: id});
    var detailed_view = new LabDetailedView({model: current_model});
    detailed_view.render();*/
  }
});

var Lab = Backbone.Model.extend({});

var Labs = Backbone.Collection.extend({
  model: Lab,
  url: VLD.DS_URL + "/labs",
  initialize: function() {
    console.log("Labs initialize");
  }
});

// Labs List View
var LabsListView = Backbone.View.extend({
  events: {
    'click .list': 'showLabDetail'
  },
  initialize: function() {
    this.wrapper_template =
      _.template($('#labs-list-view-wrapper-template').html());
    this.template = _.template($('#lab-list-template').html());
  },
  render: function() {
    this.$el.html(this.wrapper_template());
    this.$lab_el = $('#lab-list');
    this.collection.each(function(lab) {
      this.$lab_el.append(this.template(lab.toJSON()));
    }, this);
  },
  showLabDetail: function(event) {
    var lab_id = $(event.currentTarget).attr('data-lab');
    console.log('clicked', lab_id);
    VLD.app_view.trigger('detail-view', 'lab', lab_id);
  }
});

var Institute = Backbone.Model.extend({});

var Institutes = Backbone.Collection.extend({
  model: Institute,
  url: VLD.DS_URL + "/institutes",
  initialize: function() {
    console.log("Institutes initialize");
  }
});

// Institutes List View
var InstitutesListView = Backbone.View.extend({
  events:{
    'click .list': 'showInstDetail'
  },
  initialize: function () {
    this.wrapper_template =
      _.template($('#institutes-list-view-wrapper-template').html());
    this.template = _.template($('#institute-list-template').html());
    },
  render: function(){
    this.$el.html(this.wrapper_template());
    this.$inst_el = $('#inst-list');
    this.collection.each(function(institute) {
      this.$inst_el.append(this.template(institute.toJSON()));
    }, this);
  },
  showInstDetail: function(event) {
    var inst_id = $(event.currentTarget).attr('inst-list');
    console.log('clicked', inst_id);
    VLD.app_view.trigger('detail-view', 'institute', inst_id);
  }
});

var Discipline = Backbone.Model.extend({});

var Disciplines = Backbone.Collection.extend({
  model: Discipline,
  url: VLD.DS_URL + "/disciplines",
  initialize: function() {
    console.log("Disciplines initialize");
  }
});

// Disciplines List View
var DisciplinesListView = Backbone.View.extend({
  events:{
    'click .list': 'showDiscDetail'
  },
  initialize: function () {
    this.wrapper_template =
      _.template($('#disciplines-list-view-wrapper-template').html());
    this.template = _.template($('#discipline-list-template').html());
  },
  render: function(){
    this.$el.html(this.wrapper_template());
    this.$disc_el = $('#disc-list');
    this.collection.each(function(discipline) {
      this.$disc_el.append(this.template(discipline.toJSON()));
    }, this);
  },
  showDiscDetail: function(event) {
    var disc_id = $(event.currentTarget).attr('disc-list');
    console.log('clicked', disc_id);
    VLD.app_view.trigger('detail-view', 'disciplines', disc_id);
  }
});

var Developer = Backbone.Model.extend({});

var Developers = Backbone.Collection.extend({
  model: Developer,
  url: VLD.DS_URL + "/developers",
  initialize: function() {
    console.log("Developers initialize");
  }
});

// Developers List View
var DevelopersListView = Backbone.View.extend({
  events:{
    'click .list': 'showDevDetail'
  },
  initialize: function () {
    this.wrapper_template =
      _.template($('#developers-list-view-wrapper-template').html());
    this.template = _.template($('#developer-list-template').html());
  },
  render: function(){
    this.$el.html(this.wrapper_template());
    this.$dev_el = $('#dev-list');
    this.collection.each(function(developer) {
      this.$dev_el.append(this.template(developer.toJSON()));
    }, this);
  },
  showDevDetail: function(event) {
    var dev_id = $(event.currentTarget).attr('dev-list');
    console.log('clicked', dev_id);
    VLD.app_view.trigger('detail-view', 'developers', dev_id);
  }
});

var Technology = Backbone.Model.extend({});

var Technologies = Backbone.Collection.extend({
  model: Technology,
  url: VLD.DS_URL + "/technologies",
  initialize: function() {
    console.log("Technologies initialize");
  }
});

// Technologies List View
var TechnologiesListView = Backbone.View.extend({
  events:{
    'click .list': 'showTechDetail'
  },
  initialize: function () {
    this.wrapper_template =
      _.template($('#technologies-list-view-wrapper-template').html());
    this.template = _.template($('#technology-list-template').html());
  },
  render: function(){
    this.$el.html(this.wrapper_template());
    this.$tech_el = $('#tech-list');
    this.collection.each(function(technology) {
      this.$tech_el.append(this.template(technology.toJSON()));
    }, this);
  },
  showTechDetail: function(event) {
    var tech_id = $(event.currentTarget).attr('tech-list');
    console.log('clicked', tech_id);
    VLD.app_view.trigger('detail-view', 'technologies', tech_id);
  }
});

var collections = {
  lab: Labs,
  developer: Developers,
  institute: Institutes,
  discipline: Disciplines,
  technology: Technologies
};

var models = {
  lab: Lab,
  developer: Developer,
  institute: Institute,
  discipline: Discipline,
  technology: Technology
};

var list_views = {
  lab: LabsListView,
  developer: DevelopersListView,
  discipline: DisciplinesListView,
  institute: InstitutesListView,
  technology: TechnologiesListView
};

function init() {
  $.ajaxSetup({crossDomain: true});
  VLD.app_view = new AppView();
}

window.onload = function() {
  init();
};
})(VLD);
