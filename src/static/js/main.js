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
    console.log('detailed view of', type, id);
    var current_model = this.current_collection.filter({id: id});
    //var detailed_view = new detail_views[type]({model: current_model});
    //detailed_view.render();
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
  url: "http://localhost:5000/institutes",
  initialize: function() {
    console.log("Institutes initialize");
  }
});

// Institutes List View
var InstitutesListView = Backbone.View.extend({
  initialize: function () {
    this.main_template = _.template($('#institutesview-root-template').html()),
    this.institute_template = _.template($('#institute-model-template').html()),
    _.bindAll(this, "render");
  },
  render: function(){
    console.log("render")
      console.log(this.collection.length);
    this.$el.html(this.main_template());
    this.collection.each(function(institute) {
      console.log(this);
      $('#institutes-table').append(this.institute_template({
        name: institute.get('name')
      }));
    }, this);
  }
})


// Disciplines List View
var Discipline = Backbone.Model.extend({});

var Disciplines = Backbone.Collection.extend({
  model: Discipline,
  url: " http://localhost:5000/disciplines",
  initialize: function() {
    console.log("Disciplines initialize");
  }
});

var DisciplinesListView = Backbone.View.extend({
  initialize: function () {
    this.main_template = _.template($('#disciplinesview-root-template').html()),
    this.discipline_template = _.template($('#discipline-model-template').html()),
    _.bindAll(this, "render");
  },
  render:function(){
    console.log("render")
      console.log(this.collection.length);
    this.$el.html(this.main_template());
    this.collection.each(function(discipline) {
      console.log(this);
      $('#disciplines-table').append(this.discipline_template({
        name: discipline.get('name')
      }));
    }, this);
  }
})


// Developers List View
var Developer = Backbone.Model.extend({});

var Developers = Backbone.Collection.extend({
  model: Developer,
  url: " http://localhost:5000/developers",
  initialize: function() {
    console.log("Developers initialize");
  }
});

var DevelopersListView = Backbone.View.extend({
  el: $('#result-set'),
  initialize: function () {
    this.main_template = _.template($('#developersview-root-template').html()),
    this.developer_template = _.template($('#developer-model-template').html()),
    _.bindAll(this, "render");
  },
  render:function(){
    console.log("render")
      console.log(this.collection.length);
    this.$el.html(this.main_template());
    this.collection.each(function(developer) {
      console.log(this);
      $('#developers-table').append(this.developer_template({
        instituteid: developer.get('institute_id'),
        developername: developer.get('name'),
        emailid: developer.get('email_id')
      }));
    }, this);
  }
})


// Technologies List View
var Technology = Backbone.Model.extend({});

var Technologies = Backbone.Collection.extend({
  model: Technology,
  url: "http://localhost:5000/technologies",
  initialize: function() {
    console.log("Technologies initialize");
  }
});

var TechnologiesListView = Backbone.View.extend({
  el: $('#result-set'),
  initialize: function () {
    this.main_template = _.template($('#technologyview-root-template').html()),
    this.technology_template = _.template($('#technology-model-template').html()),
    _.bindAll(this, "render");
  },
  render: function(){
    console.log("render")
      console.log(this.collection.length);
    this.$el.html(this.main_template());
    this.collection.each(function(technology) {
      console.log(this);
      $('#technologies-table').append(this.technology_template({
        id: technology.get('id'),
        name: technology.get('name'),
        foss: technology.get('foss')
      }));
    }, this);
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

/*var detail_views = {
  lab: LabView,
  institute: InstituteView
};*/

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
