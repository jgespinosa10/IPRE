const WIDTH = 700;
const HEIGHT = 500;
const MARGIN = { TOP: 20, BOTTOM: 20, LEFT: 50, RIGHT: 50 };

const width = WIDTH - MARGIN.RIGHT - MARGIN.LEFT;
const height = HEIGHT - MARGIN.TOP - MARGIN.BOTTOM;

var symbols = 0

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
  console.log(symbols)
});