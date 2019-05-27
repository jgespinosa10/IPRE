const WIDTH = 1300;
const HEIGHT = 500;
const MARGIN = { TOP: 20, BOTTOM: 40, LEFT: 50, RIGHT: 750 };

const width = WIDTH - MARGIN.RIGHT - MARGIN.LEFT;
const height = HEIGHT - MARGIN.TOP - MARGIN.BOTTOM;

var symbols = 0;

var inas = 5

var svg = d3.select("#Cajon").append("svg")
			.attr("height", HEIGHT)
			.attr("width", WIDTH)
			.append("g")
			.attr("transform", "translate("+ MARGIN.LEFT + "," + MARGIN.TOP + ")");

var xScale = d3.scaleBand()
				.domain([2013, 2014, 2015, 2016, 2017, "Total"])
				.range([0, width])
				.paddingInner(0.5)
				.paddingOuter(0.5)
				.padding(0.5)
				.align(0.5)

var yScale = d3.scaleLinear()
				.range([height, 0]);

var yScale0 = d3.scaleLinear()
				.range([height, 0]);

var xGen = d3.axisBottom(xScale)
				.ticks(3);
var yGen = d3.axisLeft(yScale)
				.ticks(6);

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

var	tooltip = d3.select("body").append("div")
	                .style("position", "absolute")
	                .attr("class", "tooltip")
	                .style("left", "70px")
	                .style("top", "50px")
	                .style("opacity", 0);

// anadir zoom
// var zoom = d3.zoom()
//     .scaleExtent([1, 40])
//     .on("zoom", zoomed);

var colors = d3.scaleOrdinal(d3.schemeCategory10);

var legendw = width + 30;
var legendh = height*2/3 + 10;

var colores = d3.schemeReds[4];
colores = colores.concat(d3.schemeBlues[5]);
colores = colores.concat(d3.schemeGreens[6]);
colores = colores.concat(d3.schemePurples[8]);
colores = colores.concat(d3.schemeOranges[5]);
colores = colores.concat(d3.schemeGreys[8]);
colores = colores.concat(d3.schemeBrBG[7]);
colores.push("#f760d0");
colores.push("#cf2c91");
colores.push("#a200ff");
colores.push("#bcbd22");
colores.push("#5e5563");
colores.push("#810909");
colores.push("#d57e7e");
colores.push("#9d2020");
colores.push("#a56e6e");

var eso = 0;

var botones = 0;
var ramos2 = {};
var simbolos = {};
var paleta = {};
var cantidad = {};

var y0 = {};
for(let i = 2013; i <= 2018; i++) {
	y0[i] = 0;
}
var t = d3.transition()
            .duration(800);

var filtro_anos = ["2013", "2014", "2015", "2016", "2017"]
var grafics = [];
var optativos = true;
var major = true;
var minor = true;
var resto = true;
var ramosactivos = {}

d3.csv("data/Datos_programacion.csv").then(dataset => {
	eso = d3.nest()
				.key(function(d) {return d["BLOQUE ACADÉMICO"]})
				.entries(dataset);
	eso.forEach((d, i) => {
		paleta[d.key] = colores[i];
	});

	paleta["Minor de Profundidad en Fundamentos Científicos y Tecnológicos de la Computación"] = "#cbc9c9";

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
		ramos2[element.key] = i + 1;
	});
	botones = d3.select("#Botones")
					.append("div");

	var input = d3.select("#Complete")
					.on('change', cambiar)				
		datalist = d3.select("#Select")			
				.selectAll('option')
					.data(ramos)
					.enter()
				.append('option')
					.attr('value', function(d) {return d.text})
					.text(function (d) {return d.text});
	
	d3.select("body").append("br");				
	var filtro = d3.select("#Filtros")
					.append("div")
	
	for(let i = 2013; i < 2018; i++) {
		filtro.append("button")
				.text("" + i)
				.attr("class", "filtro")
				.style("background-color", "rgb(103, 255, 1)")
				.on("click", filtrar_anos);
		
	};
	filtro.append("button")
				.text("Optativos")
				.attr("class", "filtro")
				.style("background-color", "rgb(103, 255, 1)")
				.on("click", filtrar_optativos);

	filtro.append("button")
				.text("Major")
				.attr("class", "filtro")
				.style("background-color", "rgb(103, 255, 1)")
				.on("click", filtrar_major);

	filtro.append("button")
				.text("Minor")
				.attr("class", "filtro")
				.style("background-color", "rgb(103, 255, 1)")
				.on("click", filtrar_minor);

	filtro.append("button")
				.text("Titulo o extras")
				.attr("class", "filtro")
				.style("background-color", "rgb(103, 255, 1)")
				.on("click", filtrar_resto);

	symbols.forEach(d => {
		let total = [];
		for(let i = 2013; i <= 2018; i++) {
			d.values.forEach(element => {
				if(element.value[i] != "") {
					total.push({year: i, major: element.key, valor: parseInt(element.value[i]), tipo: element.value["TCurso"].includes("Optativo")});
				}
				else {
					total.push({year: i, major: element.key, valor: 0, tipo: element.value["TCurso"].includes("Optativo")});
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
						anos.push({x: i, y: parseInt(element.value[i]), tipo: element.value["TCurso"].includes("Optativo"), major: element.key});
					}
					else {
						anos.push({x: i, y: 0,major: element.key , tipo: element.value["TCurso"].includes("Optativo")});
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
	yAxis.transition().call(yGen);
	// Falta poner barras simples, luego completar las funciones anadir y quitar)

	for(let i = 2013; i <= 2018; i++) {
		y0[i] = 0;
	};
});


function poner_grafico() {
	xScale.domain(filtro_anos.concat(["Total"]))
	xScale.paddingInner(0)
	xAxis.transition().call(xGen) 
	grafics.forEach((d,i) => {
		ramosactivos[d] = {}
		filtro_anos.forEach((elemento) => {
		ramosactivos[d][elemento] = 0
	});
		ramosactivos[d][2018] = 0
		svg.selectAll(".numero" + ramos2[d]).remove();
		simbolos[d].forEach(element => {
			if (isNaN(ramosactivos[d][element.year])){
				return
			}
			if(element.valor > 0) {
				if (optativos || !(element.tipo)) {
					if (major || !(element.major.includes("Major"))) {
						if (minor || !(element.major.includes("Minor"))) {
							if (resto || element.major.includes("Major") || element.major.includes("Minor")) {
								ramosactivos[d][element.year] += element.valor
								svg.append("rect")
									.attr("class", "barras " + "numero" + ramos2[d])
									.attr("class", "barras " + "numero" + ramos2[d])
									.attr("x", (function() {
										if(element.year == "2018"){
											return xScale("Total") + (80/grafics.length)*(i) + 30 * (inas - (filtro_anos.length))/(filtro_anos.length + 1)
									}else{
										return xScale(element.year) + (80/grafics.length)*(i) + 30 * (inas - (filtro_anos.length))/(filtro_anos.length + 1)
									}}))
									/*.attr("x", (xScale(element.year) - 40 + (80/grafics.length)*(i)))*/
									.attr("y", height)
									.attr("width", 80/grafics.length)
									.attr("height", 0)
									.attr("stroke", "black")
									.attr("stroke-width", 1)
									.attr("stroke-opacity", 0)
									.on("mouseover", function() {
										d3.select(this)
											.attr("stroke-opacity", 1);
										tooltip.transition()
					                    .duration(300)
					                    .style("opacity", 1);

					                    tooltip
					                    .style("left", (d3.event.pageX + 10) + "px")
					                    .style("top", (d3.event.pageY + 10) + "px")
					                    .html(element.major +  "<br>" + "Alumnos: " + element.valor
					                     + "<br>" + "Total Año: " + ramosactivos[d][element.year]
					                     )
									})
									.on("mouseout", function() {
										d3.select(this)
											.attr("stroke-opacity", 0);
										
										svg.selectAll(".major").remove()
										tooltip
	    	  								.style("opacity", 0)
									})
									.on("mousemove", function(d) {
									tooltip
								      .style("left", (d3.event.pageX + 10) + "px")
								      .style("top", (d3.event.pageY - 30) + "px")})
									.transition()
									.attr("y", yScale(y0[element.year] + element.valor))
									.attr("fill", paleta[element.major])
									.attr("height", height - yScale(element.valor))
									.attr("width", 80/grafics.length);
								y0[element.year] += element.valor;
							};
						};
					};
				};
			};
		});
		for(let i = 2013; i <= 2018; i++) {
			y0[i] = 0;
		};
	})
};
function cambiar() {
	if(ramos2[this.value])
		{
			anadir(this.value)}
	else{
	}
}
function anadir(ramo) {
	// anadir ramo al grafico
	grafics.push(ramo);

	// Cambiar axis
	let mayor = 0
	grafics.forEach(d => {
		let grande = Math.max.apply(Math, cantidad[d].map(function(o) {return o.y}));
		if(grande > mayor) mayor = grande;
	});
	yScale.domain([0, 1.05*mayor]);
	yAxis.transition().call(yGen);

	// Poner barras nuevas y cambiar antiguas;

	poner_grafico();
	
	// anadir boton
	botones.append("button")
			.text(ramo)
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
	poner_grafico();
	yScale0.domain([0, 1.05*mayor]);
	// quitar el boton
	d3.select(this).remove();
};

function sumar_todos(total, num) {
	return total + num.valor;
};

function calcular_total() {
	for (var ramo in simbolos) {
		simbolos[ramo].forEach(d => {
			if(d.year == (2018 + "")){
				sumar = simbolos[ramo].filter(element => {
					return (filtro_anos.indexOf(element.year+"") >= 0 && element.major == d.major);
				});
				d.valor = sumar.reduce(sumar_todos, 0);
			};
		});
	};
	poner_grafico();
};
function filtrar_anos() {
	let index = filtro_anos.indexOf(this.textContent);
	if (index >= 0) {
		d3.select(this).style("background-color", "rgb(244, 91, 83)");
		filtro_anos.splice(index, 1);
	}
	else {
		d3.select(this).style("background-color", "rgb(103, 255, 1)")
		filtro_anos.push(this.textContent)
	}
	calcular_total()
};

function filtrar_optativos() {
	if (optativos) {
		d3.select(this).style("background-color", "rgb(244, 91, 83)");
		optativos = false;
	}
	else {
		d3.select(this).style("background-color", "rgb(103, 255, 1)");
		optativos = true;
	}
	poner_grafico();
};

function filtrar_major() {
	if (major) {
		d3.select(this).style("background-color", "rgb(244, 91, 83)");
		major = false;
	}
	else {
		d3.select(this).style("background-color", "rgb(103, 255, 1)");
		major = true;
	}
	poner_grafico();
};

function filtrar_minor() {
	if (minor) {
		d3.select(this).style("background-color", "rgb(244, 91, 83)");
		minor = false;
	}
	else {
		d3.select(this).style("background-color", "rgb(103, 255, 1)");
		minor = true;
	};
	poner_grafico();
};

function filtrar_resto() {
	if (resto) {
		d3.select(this).style("background-color", "rgb(244, 91, 83)");
		resto = false;
	}
	else {
		d3.select(this).style("background-color", "rgb(103, 255, 1)");
		resto = true;
	}
	poner_grafico();
};
