/*var V_Labs = {
    Models: {},
    Collections: {},
    Views: {},
    Templates:{}
}*/


var Lab = Backbone.Model.extend({});

var Labs = Backbone.Collection.extend({
    model: Lab,
    url: " http://10.2.56.63:5000/labs",
    initialize: function() {
        console.log("Labs initialize");
    }
});



var LabsView = Backbone.View.extend({
	el: $('#test'),
    initialize: function () {
    	this.main_template = _.template($('#labsview-root-template').html()),
    	this.lab_template = _.template($('#lab-model-template').html()),
        _.bindAll(this, "render");
         //this.collection.bind("reset", this.render);
    },
    render: function(){
        console.log("render") 
        console.log(this.collection.length);
        //$('#test').html('<table id="labs-table" class="table"></table>');
        //$('#labs-table').append('<tr><th>Lab ID</th> <th> Lab Name </th></tr>');
       	this.$el.html(this.main_template());
        
        this.collection.each(function(lab) {
        	//$('#labs-table').append("<tr><td>" + lab.get('lab_id') + '</td><td>' + lab.get('name') + "</td></tr>");
        	console.log(this);
        	$('#labs-table').append(this.lab_template({
        		id: lab.get('lab_id'),
        		name: lab.get('name')
        	}));
        }, this);
    }
})

//new V_Labs.Views.Labs({collection: labs});


/*V_Labs.Router = Backbone.Router.extend({
    routes: {
        "": "defaultRoute" //file:///home/ambika/Desktop/backbone-dashboard/dashboard.html
    },
      
    defaultRoute: function () {
        console.log("defaultRoute");
        V_Labs.labs = new V_Labs.Collections.Labs()
        new V_Labs.Views.Labs({ collection: V_Labs.labs });
        V_Labs.labs.fetch();
        console.log(V_Labs.labs.length)
    }
})
 
var appRouter = new V_Labs.Router();
Backbone.history.start();*/


window.onload = function() {
	console.log('initing dashboard');
	var labs = new Labs();
    console.log(labs);
	labs.fetch({
        success: function(coll, response, opts) {
	        console.log('labs coll', labs);
	        var labsview = new LabsView({collection: labs});
	        console.log(labsview)
	        labsview.render();
	    },
	    error: function(coll, resp, opts) {
		    console.log(coll, resp, opts);
		    console.log(resp.statusCode());
		    console.log("Error retrieving labs info");
	    }
	});
	
};

// function labs_function() {

//     console.log('initing dashboard');
//     var labs = new Labs();
//     labs.fetch({success: function(coll, response, opts) {
//     console.log('labs coll', labs);
//     var labsview = new LabsView({collection: labs});
//     console.log(labsview)
//     labsview.render();
//     },
//     error: function(coll, resp, opts) {
//         alert("Error retrieving labs info");
//     }

// });

// }

