function incluye(chico, grande) 
{
    let resp = false;
    grande.forEach(d => {
        if (d[0] == chico[0] && d[1] == chico[1]) resp = true;
    });
    return resp;
};

const MARGIN2 = { TOP: 20, BOTTOM: 40, LEFT: 750, RIGHT: 70 };

var svg2 = d3.select("#Cajon").select("svg")
        .append("g")
        .attr("transform",
            "translate(" + MARGIN2.LEFT + "," + MARGIN2.TOP + ")");

var dias = ["L", "M", "W", "J", "V", "S"];
var horarios = ["8:30", "10:00", "11:30", "13:00", "14:00", "15:30", "17:00", "18:30", "20:00"];

var cambio = {"1": "8:30", "2":"10:00", "3":"11:30", "4":"14:00", "5":"15:30", "6":"17:00", "7":"18:30", "8":"20:00"}

// Armar escalas
var x = d3.scaleBand()
        .range([0, width])
        .domain(dias)
        .padding(0.01);

svg2.append("g")
    .call(d3.axisTop(x))

var y = d3.scaleBand()
        .range([0, height])
        .domain(horarios)
        .padding(0.01);


svg2.append("g")
    .call(d3.axisLeft(y));

// Escala de colores
var color = d3.interpolateYlOrRd

// parámetros leyenda
var legendFullHeight = height;
var legendFullWidth = 50;
var legendMargin = { top: 20, bottom: 20, left: 10, right: 20 };

var legendheight = legendFullHeight - legendMargin.top - legendMargin.right;
var legendwidth = legendFullWidth - legendMargin.left - legendMargin.right;
// leyenda
var legendSvg = svg2
                .append('g')
                .attr('transform', 'translate(' + (width + legendMargin.left) + ',' +
                        legendMargin.top + ')');

var legendscale = d3.scaleLinear()
            .domain([0, maxRow])
            .range([0, legendheight]);
// Eje X
var legendGen = d3.axisRight(legendscale)
                .ticks(maxRow);

var legendAxis = svg.append("g")
				.attr("class", "y-axis")
				.attr("transform", "translate(" + (MARGIN2.LEFT + 585) + "," + legendMargin.top + ")")
				.call(legendGen);

var linearGradient = svg.append("defs")
                    .append("linearGradient")
                    .attr("id", "linear-gradient")
                    .attr("gradientTransform", "rotate(90)");
                    
linearGradient.append("stop")
                .attr("offset", "0%")
                .attr("stop-color", color(0));
        
linearGradient.append("stop")
                .attr("offset", "50%")
                .attr("stop-color", color(0.5));
        
linearGradient.append("stop")
                .attr("offset", "100%")
                .attr("stop-color", color(1));


legendSvg.append('rect')
                        .attr('x1', 0)
                        .attr('y1', 0)
                        .attr('width', legendwidth)
                        .attr('height', legendheight)
                        .style('fill', "url(#linear-gradient)");

var semestres = {"2018-2": [], "2019-1": []},
    semestre = "2018-2",
    catedra = true,
    ayud = true,
    lab = true,
    maxRow = 5;

//Read the data
d3.csv("data/20182.csv").then(dataset1 => {
    d3.csv("data/20191.csv").then(dataset2 => {
        
        let elegir = [{"text": "2018-2"},
                      {"text": "2019-1"}]

        d3.select("#Complete2")
            .on('change', cambioheat);
        
        d3.select("#Select2")
            .selectAll('option')
                .data(elegir)
                .enter()
            .append('option')
                .attr('value', function(d) {return d.text})
                .text(function (d) {return d.text});

        dataset1.forEach(d => {
            let temp = d["Catedra"].split(";");
            temp.forEach((f,i) => {
                let a = f.split(":")
                temp[i] = [a[0], cambio[a[1]]];
            });
            let temp2 = d["Ayudantia"].split(";");
            temp2.forEach((f,i) => {
                let a = f.split(":")
                temp2[i] = [a[0], cambio[a[1]]];
            });
            let temp3 = d["Lab"].split(";");
            temp3.forEach((f,i) => {
                let a = f.split(":")
                temp3[i] = [a[0], cambio[a[1]]];
            });
            semestres["2018-2"].push(
                {
                    "nombre": d["Nombre Curso"],
                    "NRC":d["NRC"],
                    "catedra": temp,
                    "ayudantia": temp2,
                    "lab":temp3
                }
            );
        })
        dataset2.forEach(d => {
            let temp = d["Catedra"].split(";");
            temp.forEach((f,i) => {
                let a = f.split(":")
                temp[i] = [a[0], cambio[a[1]]];
            });
            let temp2 = d["Ayudantia"].split(";");
            temp2.forEach((f,i) => {
                let a = f.split(":")
                temp2[i] = [a[0], cambio[a[1]]];
            });
            let temp3 = d["Lab"].split(";");
            temp3.forEach((f,i) => {
                let a = f.split(":")
                temp3[i] = [a[0], cambio[a[1]]];
            });
            semestres["2019-1"].push(
                {
                    "nombre": d["Nombre Curso"],
                    "NRC":d["NRC"],
                    "catedra": temp,
                    "ayudantia": temp2,
                    "lab":temp3
                }
            );
        });

        var filtro = d3.select("#Filtros2")
					.append("div");
        
        filtro.append("button")
				.text("catedra")
				.attr("class", "filtro")
				.style("background-color", "rgb(103, 255, 1)")
                .on("click", mostrar_catedra);
                
        filtro.append("button")
				.text("ayudantía")
				.attr("class", "filtro")
				.style("background-color", "rgb(103, 255, 1)")
                .on("click", mostrar_ayudantia);

        filtro.append("button")
				.text("Lab")
				.attr("class", "filtro")
				.style("background-color", "rgb(103, 255, 1)")
                .on("click", mostrar_lab);        

        let valores = { 
                    "L":{"8:30":[], "10:00":[], "11:30":[], "14:00":[], "15:30":[], "17:00":[], "18:30":[], "20:00":[]},
                    "M":{"8:30":[], "10:00":[], "11:30":[], "14:00":[], "15:30":[], "17:00":[], "18:30":[], "20:00":[]},
                    "W":{"8:30":[], "10:00":[], "11:30":[], "14:00":[], "15:30":[], "17:00":[], "18:30":[], "20:00":[]},
                    "J":{"8:30":[], "10:00":[], "11:30":[], "14:00":[], "15:30":[], "17:00":[], "18:30":[], "20:00":[]},
                    "V":{"8:30":[], "10:00":[], "11:30":[], "14:00":[], "15:30":[], "17:00":[], "18:30":[], "20:00":[]},
                    "S":{"8:30":[], "10:00":[], "11:30":[], "14:00":[], "15:30":[], "17:00":[], "18:30":[], "20:00":[]}
                };
        semestres[semestre].forEach(d => {
            d["catedra"].forEach(f => {
                if (Object.keys(valores).indexOf(f[0]) >= 0)
                {
                    if (Object.keys(valores[f[0]]).indexOf(f[1]) >= 0) 
                    {
                        if (!incluye([d["nombre"], "catedra"] , valores[f[0]][f[1]])) {
                            valores[f[0]][f[1]].push([d["nombre"], "catedra"]);
                        };
                    };
                };
            });
            d["ayudantia"].forEach(f => {
                if (Object.keys(valores).indexOf(f[0]) >= 0)
                {
                    if (Object.keys(valores[f[0]]).indexOf(f[1]) >= 0) 
                    {
                        if (!incluye([d["nombre"], "ayudantia"] , valores[f[0]][f[1]])) {
                            valores[f[0]][f[1]].push([d["nombre"], "ayudantia"]);
                        };
                    };
                };
            });
            d["lab"].forEach(f => {
                if (Object.keys(valores).indexOf(f[0]) >= 0)
                {
                    if (Object.keys(valores[f[0]]).indexOf(f[1]) >= 0)
                    {
                        if (!incluye([d["nombre"], "lab"] , valores[f[0]][f[1]])) {
                            valores[f[0]][f[1]].push([d["nombre"], "lab"]);
                        };
                    };
                };
            });
        });

        let final = [];
        Object.keys(valores).forEach(d => {
            Object.keys(valores[d]).forEach(f => {
                final.push([d, f, valores[d][f].length])
            })
        });
        
        maxRow = Math.max(Math.max.apply(Math, final.map(function (i) {
                                return i[2];})),
                            5);
        
        legendscale.domain([0, maxRow]);
        legendGen.ticks(maxRow);
        legendAxis.call(legendGen);
        
        svg2.selectAll()
            .data(final)
            .enter()
            .append("rect")
            .attr("class", "mapa")
            .attr("x", function(d) { return x(d[0]) })
            .attr("y", function(d) { return y(d[1]) })
            .attr("width", x.bandwidth() )
            .attr("height", y.bandwidth() )
            .style("fill", function(d) { return color(d[2]/maxRow)} );
    });
});

function cambiarheat() {
    let valores = { 
        "L":{"8:30":[], "10:00":[], "11:30":[], "14:00":[], "15:30":[], "17:00":[], "18:30":[], "20:00":[]},
        "M":{"8:30":[], "10:00":[], "11:30":[], "14:00":[], "15:30":[], "17:00":[], "18:30":[], "20:00":[]},
        "W":{"8:30":[], "10:00":[], "11:30":[], "14:00":[], "15:30":[], "17:00":[], "18:30":[], "20:00":[]},
        "J":{"8:30":[], "10:00":[], "11:30":[], "14:00":[], "15:30":[], "17:00":[], "18:30":[], "20:00":[]},
        "V":{"8:30":[], "10:00":[], "11:30":[], "14:00":[], "15:30":[], "17:00":[], "18:30":[], "20:00":[]},
        "S":{"8:30":[], "10:00":[], "11:30":[], "14:00":[], "15:30":[], "17:00":[], "18:30":[], "20:00":[]}
    };
    semestres[semestre].forEach(d => {
        if(catedra) {
            d["catedra"].forEach(f => {
                if (Object.keys(valores).indexOf(f[0]) >= 0)
                {
                    if (Object.keys(valores[f[0]]).indexOf(f[1]) >= 0) 
                    {
                        if (!incluye([d["nombre"], "catedra"] , valores[f[0]][f[1]])) {
                            valores[f[0]][f[1]].push([d["nombre"], "catedra"]);
                        };
                    };
                };
            });
        };
        if(ayud) {
            d["ayudantia"].forEach(f => {
                if (Object.keys(valores).indexOf(f[0]) >= 0)
                {
                    if (Object.keys(valores[f[0]]).indexOf(f[1]) >= 0) 
                    {
                        if (!incluye([d["nombre"], "ayudantia"] , valores[f[0]][f[1]])) {
                            valores[f[0]][f[1]].push([d["nombre"], "ayudantia"]);
                        };
                    };
                };
            });
        };
        if(lab) {
            d["lab"].forEach(f => {
                if (Object.keys(valores).indexOf(f[0]) >= 0)
                {
                    if (Object.keys(valores[f[0]]).indexOf(f[1]) >= 0)
                    {
                        if (!incluye([d["nombre"], "lab"] , valores[f[0]][f[1]])) {
                            valores[f[0]][f[1]].push([d["nombre"], "lab"]);
                        };
                    };
                };
            });
        };
    });

    let final = [];
    Object.keys(valores).forEach(d => {
        Object.keys(valores[d]).forEach(f => {
            final.push([d, f, valores[d][f].length])
        })
    });
    maxRow = Math.max(Math.max.apply(Math, final.map(function (i) {
                                return i[2];})),
                        5);
    legendscale.domain([0, maxRow]);
    legendGen.ticks(maxRow);
    legendAxis.call(legendGen);

    let cuadrados = svg2.selectAll(".mapa")
                        .data(final);
    cuadrados.transition()
            .duration(500)
            .attr("x", function(d) { return x(d[0]) })
            .attr("y", function(d) { return y(d[1]) })
            .style("fill", function(d) { return color(d[2]/maxRow)} );
};

function mostrar_catedra() {
    console.log(d3.select(this));
    if (catedra) {
		d3.select(this).style("background-color", "rgb(244, 91, 83)");
		catedra = false;
	}
	else {
		d3.select(this).style("background-color", "rgb(103, 255, 1)");
		catedra = true;
    }
    cambiarheat();
};

function mostrar_ayudantia() {
    if (ayud) {
		d3.select(this).style("background-color", "rgb(244, 91, 83)");
		ayud = false;
	}
	else {
		d3.select(this).style("background-color", "rgb(103, 255, 1)");
		ayud = true;
	}
    cambiarheat();
};

function mostrar_lab() {
    if (lab) {
		d3.select(this).style("background-color", "rgb(244, 91, 83)");
		lab = false;
	}
	else {
		d3.select(this).style("background-color", "rgb(103, 255, 1)");
		lab = true;
	}
    cambiarheat();
};

function cambioheat() {
    semestre = this.value;
    cambiarheat();
};