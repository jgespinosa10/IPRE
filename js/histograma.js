
const WIDTH = 1300;
const HEIGHT = 500;
const MARGIN = { TOP: 20, BOTTOM: 40, LEFT: 50, RIGHT: 650 };

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
				.domain([2012.5 , 2018.5]);
var yScale = d3.scaleLinear()
				.range([height, 0]);

var yScale0 = d3.scaleLinear()
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
				.text("Alumnos");

var	Xlabel = svg.append("text")
				.attr("class", "label-x")
				.attr("transform",
					  "translate(" + (width/2) + " ," +
									 (height + MARGIN.TOP + 10) + ")")
				.attr("style", "font-size: 20")
				.style("text-anchor", "middle")
				.text("generación");

// anadir zoom
// var zoom = d3.zoom()
//     .scaleExtent([1, 40])
//     .on("zoom", zoomed);

var colors = d3.scaleOrdinal(d3.schemeCategory10);

var legendw = width + 30;
var legendh = height*2/3 + 10;

var colores = d3.schemeCategory10;
colores = colores.concat(d3.schemeAccent);
colores = colores.concat(d3.schemeDark2);
colores = colores.concat(d3.schemePaired);
colores = colores.concat(d3.schemeSet1);
colores = colores.concat(d3.schemeSet2);

var eso = 0;

var botones = 0;
var ramos2 = {};
var simbolos = {};
var paleta = {};
var cantidad = {};

var y0 = {};
for(let i = 2013; i <= 2018; i++) {
	y0[i] = 0;
};

var grafics = ["Matemáticas Discretas"];

d3.csv("data/Datos_programacion.csv").then(dataset => {
	eso = d3.nest()
				.key(function(d) {return d["BLOQUE ACADÉMICO"]})
				.entries(dataset);
	eso.forEach((d, i) => {
		paleta[d.key] = colores[i];
	});
  	symbols = d3.nest()
		.key(function(d) {return d["RAMO"]})
		.key(function(d) {return d["BLOQUE ACADÉMICO"]})
		.rollup(function(d) {return {"Track" : d[0]["TRACK/ÁREA"], "N": d[0]["N° VERSIONES"], "TCurso" : d[0]["TIPO CURSO"], 
			"TOpt" : d[0]["TIPO OPTATIVIDAD"], 
			"2013" : d[0]["Alumnos que falta por aprobar 2013"],
			"2014" : d[0]["Alumnos que falta por aprobar 2014"],
			"2015" : d[0]["Alumnos que falta por aprobar 2015"], 
			"2016" : d[0]["Alumnos que falta por aprobar 2016"],
			"2017" : d[0]["Alumnos que falta por aprobar 2017"],
			"2018" : d[0]["Alumnos que falta por aprobar 2018"]}})
		.entries(dataset);
	
	var ramos = [];
	symbols.forEach((element, i) => {
		ramos.push({"text": element.key});
		ramos2[element.key] = i;
	});

	botones = d3.select("body")
					.append("div");
	
	botones.append("button")
			.text("Matemáticas Discretas")
			.on("click", quitar)
			.attr("class", "button ");

	d3.select("body")
		.append("br")

	select = d3.select("body")
				.append("div")
				.attr("class", "input-group-prepend");

	select.append("label")
			.attr("for", "Select")
			.text("Selecciona ramo")
			.attr("class", "input-group-text");

	select.append("select")
			.attr("id", "Select")
			.attr("class", "custom-select");

	var input = d3.select("#Select")
					.on('change', anadir)
				.selectAll('option')
					.data(ramos)
					.enter()
				.append('option')
					.attr('value', function(d) {return d.text})
					.text(function (d) {return d.text});

	symbols.forEach(d => {
		let total = [];
		for(let i = 2013; i <= 2018; i++) {
			d.values.forEach(element => {
				if(element.value[i] != "") {
					total.push({year: i, major: element.key, valor: parseInt(element.value[i])});
				}
				else {
					total.push({year: i, major: element.key, valor: 0});
				}
			});
		};
		total.sort(function(a , b) { return (b.valor - a.valor);});
		simbolos[d.key] = total;

		var anos = [];
		d.values.forEach(element => {
			for(let i = 2013; i <= 2018; i++) {
				if(anos.length < 7) {
					if(element.value[i] != "") {
						anos.push({x: i, y: parseInt(element.value[i])});
					}
					else {
						anos.push({x: i, y: 0});
					};
				}
				else {
					if(element.value[i] != "") {
						anos[i - 2013].y += parseInt(element.value[i]);
					}
				};
			};
		});
		cantidad[d.key] = anos;
	});
	// cambio de barras
	let mayor = Math.max.apply(Math, cantidad["Matemáticas Discretas"].map(function(o) {return o.y}));
	yScale.domain([0, 1.05*mayor]);
	yScale0.domain([0, 1.05*mayor]);

	yAxis.transition().call(yGen);
	// Falta poner barras simples, luego completar las funciones anadir y quitar
	simbolos["Matemáticas Discretas"].forEach(d => {
		if(d.valor > 0 ) {
			svg.append("rect")
				.attr("class", "barras " + "numero" + ramos2["Matemáticas Discretas"])
				.attr("x", (xScale(d.year) - 40))
				.attr("y", yScale(y0[d.year] + d.valor))
				.attr("fill", paleta[d.major])
				.attr("height", height - yScale(d.valor))
				.attr("width", 80)
				.attr("stroke", "black")
				.attr("stroke-width", 2)
				.attr("stroke-opacity", 0)
				.on("mouseover", function() {
					d3.select(this)
						.attr("stroke-opacity", 1);

					svg.append("circle")
						.attr("r", 3)
						.attr("x", width + 5)
						.attr("y", 70)
						.

					svg.append("text")
						.attr("class", "major" )
						.attr("y", 50)
						.attr("x", width + 10)
						.attr("dy", "1em")
						.attr("style", "font-size: 10")
						.style("text-anchor", "left")
						.text("Matemáticas Discretas:");

					svg.append("text")
						.attr("class", "major" )
						.attr("y", 70)
						.attr("x", width + 10)
						.attr("dy", "1em")
						.attr("style", "font-size: 10")
						.style("text-anchor", "left")
						.text(d.major);

					svg.append("text")
						.attr("class", "major" )
						.attr("y", 90)
						.attr("x", width + 10)
						.attr("dy", "1em")
						.attr("style", "font-size: 10")
						.style("text-anchor", "left")
						.text(d.valor);

				})
				.on("mouseout", function() {
					d3.select(this)
						.attr("stroke-opacity", 0);
					d3.selectAll(".major").remove()
				});
			y0[d.year] += d.valor;
		}	
	})

	for(let i = 2013; i <= 2018; i++) {
		y0[i] = 0;
	};
});

function anadir() {
	// anadir ramo al grafico
	grafics.push(this.value);

	// Cambiar axis
	let mayor = 0
	grafics.forEach(d => {
		let grande = Math.max.apply(Math, cantidad[d].map(function(o) {return o.y}));
		if(grande > mayor) mayor = grande;
	});
	yScale.domain([0, 1.05*mayor]);
	yAxis.transition().call(yGen);

	// Poner barras nuevas y cambiar antiguas;
	grafics.forEach((d,i) => {
		if(i < grafics.length - 1) {
			svg.selectAll(".numero" + ramos2[d]).remove();
		};
		simbolos[d].forEach(element => {
			if(element.valor > 0 ) {
				svg.append("rect")
					.attr("class", "barras " + "numero" + ramos2[d])
					.attr("x", (xScale(element.year) - 40 + (80/grafics.length)*(i)))
					.attr("y", yScale(y0[element.year] + element.valor))
					.attr("fill", paleta[element.major])
					.attr("height", height - yScale(element.valor))
					.attr("width", 80/grafics.length)
					.attr("stroke", "black")
					.attr("stroke-width", 1)
					.attr("stroke-opacity", 0)
					.on("mouseover", function() {
						d3.select(this)
							.attr("stroke-opacity", 1);

						svg.append("text")
							.attr("class", "major" )
							.attr("y", 50)
							.attr("x", width + 10)
							.attr("dy", "1em")
							.attr("style", "font-size: 10")
							.style("text-anchor", "left")
							.text(d + ":");
						
						svg.append("text")
							.attr("class", "major" )
							.attr("y", 70)
							.attr("x", width + 10)
							.attr("dy", "1em")
							.attr("style", "font-size: 10")
							.style("text-anchor", "left")
							.text(element.major);

						svg.append("text")
							.attr("class", "major" )
							.attr("y", 90)
							.attr("x", width + 10)
							.attr("dy", "1em")
							.attr("style", "font-size: 10")
							.style("text-anchor", "left")
							.text(element.valor);
					})
					.on("mouseout", function() {
						d3.select(this)
							.attr("stroke-opacity", 0);
						
						svg.selectAll(".major").remove()
					});
				y0[element.year] += element.valor;
			};
		});
		for(let i = 2013; i <= 2018; i++) {
			y0[i] = 0;
		};
	})
	
	// anadir boton
	botones.append("button")
			.text(this.value)
			.on("click", quitar)
			.attr("class", "button");
};

function quitar() {
	// Quitar barras
	svg.selectAll(".numero" + ramos2[this.textContent]).remove();
	
	// quitar ramo del grafico
	let index = grafics.indexOf(this.textContent);
	if (index > -1) {
		grafics.splice(index, 1);
	};

	// Cambiar axis
	let mayor = 0
	grafics.forEach(d => {
		let grande = Math.max.apply(Math, cantidad[d].map(function(o) {return o.y}));
		if(grande > mayor) mayor = grande;
	});
	yScale.domain([0, 1.05*mayor]);
	yAxis.transition().call(yGen);

	// cambiar graficos existentes
	grafics.forEach((d,i) => {
		svg.selectAll(".numero" + ramos2[d]).remove();
		simbolos[d].forEach(element => {
			if(element.valor > 0 ) {
				svg.append("rect")
					.attr("class", "barras " + "numero" + ramos2[d])
					.attr("x", (xScale(element.year) - 40 + (80/grafics.length)*(i)))
					.attr("y", yScale(y0[element.year] + element.valor))
					.attr("fill", paleta[element.major])
					.attr("height", height - yScale(element.valor))
					.attr("width", 80/grafics.length)
					.attr("stroke", "black")
					.attr("stroke-width", 2)
					.attr("stroke-opacity", 0)
					.on("mouseover", function() {
						d3.select(this)
							.attr("stroke-opacity", 1);
						
						svg.append("text")
							.attr("class", "major" )
							.attr("y", 50)
							.attr("x", width + 10)
							.attr("dy", "1em")
							.attr("style", "font-size: 10")
							.style("text-anchor", "left")
							.text(d+":");
						
						svg.append("text")
							.attr("class", "major" )
							.attr("y", 70)
							.attr("x", width + 10)
							.attr("dy", "1em")
							.attr("style", "font-size: 10")
							.style("text-anchor", "left")
							.text(element.major);

						svg.append("text")
							.attr("class", "major" )
							.attr("y", 90)
							.attr("x", width + 10)
							.attr("dy", "1em")
							.attr("style", "font-size: 10")
							.style("text-anchor", "left")
							.text(element.valor);
					})
					.on("mouseout", function() {
						d3.select(this)
							.attr("stroke-opacity", 0);
						
						svg.selectAll(".major").remove()
					});
				y0[element.year] += element.valor;
			};
		})
		for(let i = 2013; i <= 2018; i++) {
			y0[i] = 0;
		};
	});

	yScale0.domain([0, 1.05*mayor]);

	// quitar el boton
	d3.select(this).remove();

};

// function zoomed() {
// 	view.attr("transform", d3.event.transform);
// 	xAxis.call(xGen.scale(d3.event.transform.rescaleX(x)));
// 	yAxis.call(yGen.scale(d3.event.transform.rescaleY(y)));
// };