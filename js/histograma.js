const WIDTH = 700;
const HEIGHT = 500;
const MARGIN = { TOP: 20, BOTTOM: 40, LEFT: 50, RIGHT: 50 };

const width = WIDTH - MARGIN.RIGHT - MARGIN.LEFT;
const height = HEIGHT - MARGIN.TOP - MARGIN.BOTTOM;

var symbols = 0;

var svg = d3.select("body").append("svg")
			.attr("height", HEIGHT)
			.attr("width", WIDTH)
			.append("g")
			.attr("transform", "translate("+ MARGIN.LEFT + "," + MARGIN.TOP + ")");

var xScale = d3.scaleLinear()
				.range([0, width])
				.domain([2011.5 , 2018.5]);
var yScale = d3.scaleLinear()
				.range([height, 0]);

var xGen = d3.axisBottom(xScale)
				.ticks(7);
var yGen = d3.axisLeft(yScale)
				.ticks(7);

var xAxis = svg.append("g")
				.attr("class", "x-axis")
				.attr("transform", "translate(0," + height + ")")
				.call(xGen);
var yAxis = svg.append("g")
				.attr("class", "y-axis")
				.call(yGen);

var Ylabel = svg.append("text")
				.attr("class", "label-y")
				.attr("transform", "rotate(-90)")
				.attr("y", 0 - MARGIN.LEFT)
				.attr("x", 0 - (height / 2))
				.attr("dy", "1em")
				.attr("style", "font-size: 20")
				.style("text-anchor", "middle")
				.text("cantidad");
var	Xlabel = svg.append("text")
				.attr("class", "label-x")
				.attr("transform",
					  "translate(" + (width/2) + " ," +
									 (height + MARGIN.TOP + 10) + ")")
				.attr("style", "font-size: 20")
				.style("text-anchor", "middle")
				.text("personas");

var colors = d3.scaleOrdinal(d3.schemeCategory10);

var legendw = width + 30;
var legendh = height*2/3 + 10;

d3.csv("data/Datos_programacion.csv").then(dataset => {
  	symbols = d3.nest()
		.key(function(d) {return d["RAMO"]})
		.key(function(d) {return d["BLOQUE ACADÉMICO"]})
		.rollup(function(d) {return {"Track" : d[0]["TRACK/ÁREA"], "N": d[0]["N° VERSIONES"], "TCurso" : d[0]["TIPO CURSO"], 
			"TOpt" : d[0]["TIPO OPTATIVIDAD"], "2012" : d[0]["Alumnos que falta por aprobar 2012"], "2013" : d[0]["Alumnos que falta por aprobar 2013"],
			"2014" : d[0]["Alumnos que falta por aprobar 2014"], "2015" : d[0]["Alumnos que falta por aprobar 2015"], 
			"2016" : d[0]["Alumnos que falta por aprobar 2016"], "2017" : d[0]["Alumnos que falta por aprobar 2017"],
			"2018" : d[0]["Alumnos que falta por aprobar 2018"]}})
		.entries(dataset);

	console.log(symbols[0]);

	var botones = d3.select("body").append("svg")
			.attr("height", 20)
			.attr("width", 50);
	
	var boton = d3.button();

	var ramos = [];
	symbols.forEach(element => {
		ramos.push({"text": element.key});
	});
	var input = d3.select("#Select")
					.on('change', change)
				.selectAll('option')
					.data(ramos)
					.enter()
				.append('option')
					.attr('value', function(d) {return d.text})
					.text(function (d) {return d.text});
	
	console.log(symbols);

});

function change() {

};