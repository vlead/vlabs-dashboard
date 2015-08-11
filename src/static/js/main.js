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
    this.on('detail-view', this.show_detail_view);
    this.on('update-view', this.show_update_view);
    this.fetched_collections = {};
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
    console.log('fetched colls', this.fetched_collections);
    if(this.fetched_collections[category]) {
      console.log('coll already exist');
      this.showListView(category);
    }
    else {
      console.log('coll doesnt exist! Fetching it');
      var self = this;
      current_collection.fetch({
        success: function(coll, response, opts) {
          console.log(this);
          self.fetched_collections[category] = current_collection;
          self.showListView(category);
        },
        error: function(coll, resp, opts) {
          alert("Error retrieving info");
        }
      });
    }
  },
  showListView: function(type) {
    //TODO: maybe a later optimization could be to not destroy the views, but
    //to switch among views..
    if(this.current_view) {
      this.current_view.remove();
    }
    this.current_view = new list_views[type]({
      collection: this.fetched_collections[type]
    });
    console.log('showListView() current view:', this.current_view);
    this.current_view.render();
  },
  show_detail_view: function(type, id) {
    console.log('detailed view', type, id);
    var model = this.fetched_collections[type].find({id: parseInt(id)});
    if(!model) {
      console.log('no model found!', model);
      return;
    }
    console.log(model);
    //the type of detailed view do not exist!
    if(!_.has(detail_views, type)) {
      return;
    }
    //TODO: maybe a later optimization could be to not destroy the views, but
    //to switch among views..
    if(this.current_view) {
      this.current_view.remove();
    }
    this.current_view = new detail_views[type]({
      model: model
    });
    this.current_view.render();
  },
  show_update_view: function(type, id) {
    console.log('update view', type, id);
    var model = this.fetched_collections[type].find({id: parseInt(id)});
    if(!model) {
      console.log('no model found!', model);
      return;
    }
    console.log(model);
    //the type of update view do not exist!
    if(!_.has(update_views, type)) {
      return;
    }
    //TODO: maybe a later optimization could be to not destroy the views, but
    //to switch among views..
    if(this.current_view) {
      this.current_view.remove();
    }
    this.current_view = new update_views[type]({
      model: model
    });
    this.current_view.render();
  },
  get_institutes: function() {
    return [
      {
        "id": 1,
        "name": "Amrita University"
      },
      {
        "id": 2,
        "name": "COEP"
      },
      {
        "id": 3,
        "name": "Dayalbagh"
      },
      {
        "id": 4,
        "name": "IIIT-H"
      },
      {
        "id": 5,
        "name": "IIT-Bombay"
      },
      {
        "id": 6,
        "name": "IIT-Delhi"
      },
      {
        "id": 7,
        "name": "IIT-Guwahati"
      },
      {
        "id": 8,
        "name": "IIT-Kanpur"
      },
      {
        "id": 9,
        "name": "IIT-Kharagpur"
      },
      {
        "id": 10,
        "name": "IIT-Madras"
      },
      {
        "id": 11,
        "name": "IIT-Roorkee"
      },
      {
        "id": 12,
        "name": "NIT-K"
      }
    ]
  },
  get_disciplines: function() {
    return [
      {
        "id": 1,
        "name": "Aerospace Engineering"
      },
      {
        "id": 2,
        "name": "Biotechnology and Biomedical Engineering"
      },
      {
        "id": 3,
        "name": "Chemical Engineering"
      },
      {
        "id": 4,
        "name": "Chemical Sciences"
      },
      {
        "id": 5,
        "name": "Civil Engineering"
      },
      {
        "id": 6,
        "name": "Computer Science and Engineering"
      },
      {
        "id": 7,
        "name": "Electrical Engineering"
      },
      {
        "id": 8,
        "name": "Electronics and Communications"
      },
      {
        "id": 9,
        "name": "Humanities"
      },
      {
        "id": 10,
        "name": "Mechanical Engineering"
      },
      {
        "id": 11,
        "name": "Physical Sciences"
      },
      {
        "id": 12,
        "name": "Textile Engineering"
      },
      {
        "id": 13,
        "name": "Design Engineering"
      },
      {
        "id": 14,
        "name": "Material Sciences"
      },
      {
        "id": 15,
        "name": "Unknown"
      }
    ]
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
    $('#result-set').append(this.$el);
  },
  render: function() {
    console.log('rendering lab list');
    console.log('total labs: ', this.collection.length);
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

var LabDetailView = Backbone.View.extend({
  events: {
    'click #update-btn': 'show_update_view'
  },
  initialize: function () {
    console.log('LabDetailView initialized');
    //console.log(this);
    this.template = _.template($('#lab-detailed-template').html());
    $('#result-set').append(this.$el);
  },
  render: function() {
    console.log('rendering..');
    //console.log(this.model, this.model.toJSON);
    this.$el.html(this.template(this.model.toJSON()));
  },
  show_update_view: function() {
    VLD.app_view.trigger('update-view', 'lab', this.model.get('id'))
  }
});

var LabUpdateView = Backbone.View.extend({
  events: {
    'click #add-tech': 'add_technology'
  },
  initialize: function() {
    this.template = _.template($('#lab-update-template').html());
    this.tag_template = _.template($('#tag-template').html());
    $('#result-set').append(this.$el);
  },
  render: function() {
    console.log('rendering update view');
    var instts = VLD.app_view.get_institutes();
    var discs = VLD.app_view.get_disciplines();
    this.$el.html(this.template({
      lab: this.model.toJSON(),
      instts: instts,
      discs: discs
    }));
  },
  add_technology: function() {
    var tech = $('#lab-tech-select option:selected').val();
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
    $('#result-set').append(this.$el);
    },
  render: function(){
    this.$el.html(this.wrapper_template());
    this.$inst_el = $('#inst-list');
    this.collection.each(function(institute) {
      this.$inst_el.append(this.template(institute.toJSON()));
    }, this);
  },
  showInstDetail: function(event) {
    var inst_id = $(event.currentTarget).attr('data-inst');
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
    $('#result-set').append(this.$el);
  },
  render: function(){
    this.$el.html(this.wrapper_template());
    this.$disc_el = $('#disc-list');
    this.collection.each(function(discipline) {
      this.$disc_el.append(this.template(discipline.toJSON()));
    }, this);
  },
  showDiscDetail: function(event) {
    var disc_id = $(event.currentTarget).attr('data-disc');
    console.log('clicked', disc_id);
    VLD.app_view.trigger('detail-view', 'discipline', disc_id);
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
    $('#result-set').append(this.$el);
  },
  render: function(){
    this.$el.html(this.wrapper_template());
    this.$dev_el = $('#dev-list');
    this.collection.each(function(developer) {
      this.$dev_el.append(this.template(developer.toJSON()));
    }, this);
  },
  showDevDetail: function(event) {
    var dev_id = $(event.currentTarget).attr('data-dev');
    console.log('clicked', dev_id);
    VLD.app_view.trigger('detail-view', 'developer', dev_id);
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
    $('#result-set').append(this.$el);
  },
  render: function(){
    this.$el.html(this.wrapper_template());
    this.$tech_el = $('#tech-list');
    this.collection.each(function(technology) {
      this.$tech_el.append(this.template(technology.toJSON()));
    }, this);
  },
  showTechDetail: function(event) {
    var tech_id = $(event.currentTarget).attr('data-tech');
    console.log('clicked', tech_id);
    VLD.app_view.trigger('detail-view', 'technology', tech_id);
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

var detail_views = {
  lab: LabDetailView,
  //institute: InstituteView
};

var update_views = {
  lab: LabUpdateView
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
