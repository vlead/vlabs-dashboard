// Master View to control the selected values
var AppView = Backbone.View.extend({
    el: $('.container'),
    events: {
	'change #category': 'onSelect'
    },
    initialize: function(){ },
    onSelect: function(e) {
	var value = $(e.currentTarget).val();
	this.showCategory(value);
    },
    showCategory: function(category) {
    	console.log("category =" , category);
    	console.log("collection =" , collections[category]);
    	var current_collection = new collections[category]();
    	//var current_collection = new Labs();

    	console.log(current_collection);
    	current_collection.fetch({
		success: function(coll, response, opts) {
			var current_view = new list_views[category]({collection: current_collection});
			console.log(current_view);
			current_view.render();
		},
		error: function(coll, resp, opts) {
			alert("Error retrieving info");
		}
	});
    }
});




			    
function init() {
    $.ajaxSetup({crossDomain: true});
    var appview = new AppView();
}

init();

// Labs List View
var Lab = Backbone.Model.extend({});

var Labs = Backbone.Collection.extend({
    model: Lab,
    url: "http://localhost:5000/labs",
    initialize: function() {
        console.log("Labs initialize");
    }
});

var LabsListView = Backbone.View.extend({
    el: $('#result-set'),
    initialize: function () {
    	this.main_template = _.template($('#labsview-root-template').html()),
    	this.lab_template = _.template($('#lab-model-template').html()),
        _.bindAll(this, "render");
    },
    render: function(){
        console.log("render") 
        console.log(this.collection.length);
       	this.$el.html(this.main_template());
        this.collection.each(function(lab) {
            console.log(this);
            $('#labs-table').append(this.lab_template({
        	name: lab.get('name'),
		discipline: lab.get('discipline')['name'],
		institute: lab.get('institute')['name'],
		hosted: lab.get('status'),
		no_of_experiments: lab.get('number_of_experiments')
            }));
        }, this);
    }
})


// Institutes List View
var Institute = Backbone.Model.extend({});

var Institutes = Backbone.Collection.extend({
    model: Institute,
    url: "http://localhost:5000/institutes",
    initialize: function() {
        console.log("Institutes initialize");
    }
});

var InstitutesListView = Backbone.View.extend({
    el: $('#result-set'),
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
    el: $('#result-set'),
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

var list_views = { lab: LabsListView,
		   developer: DevelopersListView,
		   discipline: DisciplinesListView,
		   institute: InstitutesListView,
		   technology: TechnologiesListView
		 };
