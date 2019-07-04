function incluye(chico, grande)
{
    let resp = false;
    grande.forEach(d => {
        if (d[0] == chico[0] && d[1] == chico[1]) resp = true;
    });
    return resp;
};

function elindex(chico, grande)
{
    let resp = -1
    grande.forEach((d, i) => {
        if (d[0] == chico[0] && d[1] == chico[1]) resp = i;
    });
    return resp;
};

const MARGIN2 = { TOP: 20, BOTTOM: 40, LEFT: 750, RIGHT: 80 };

var svg2 = d3.select("#Cajon").select("svg")
        .append("g")
        .attr("transform",
            "translate(" + MARGIN2.LEFT + "," + MARGIN2.TOP + ")");

var dias = ["L", "M", "W", "J", "V", "S"];
var horarios = ["8:30", "10:00", "11:30", "13:00", "14:00", "15:30", "17:00", "18:30", "20:00"];

var cambio = {"1": "8:30", "2":"10:00", "3":"11:30", "4":"14:00", "5":"15:30", "6":"17:00", "7":"18:30", "8":"20:00"}
var otrocambio = {"8:30" : "1", "10:00" : "2", "11:30" : "3", "14:00" : "4", "15:30" : "5", "17:00" : "6", "18:30": "7", "20:00" : "8"}

var	tooltip2 = d3.select("body").append("div")
	                .style("position", "absolute")
	                .attr("class", "tooltip2")
	                .style("left", "70px")
	                .style("top", "50px")
	                .style("opacity", 0);
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
                if(a[1])
                {
                    let b = a[1].replace(new RegExp(' '), '');
                    temp[i] = [a[0], cambio[b]];    
                }
                else
                {
                    temp[i] = [a[0], cambio[a[1]]];
                };
            });
            let temp2 = d["Ayudantia"].split(";");
            temp2.forEach((f,i) => {
                let a = f.split(":")
                if(a[1])
                {
                    let b = a[1].replace(new RegExp(' '), '');
                    temp2[i] = [a[0], cambio[b]];    
                }
                else
                {
                    temp2[i] = [a[0], cambio[a[1]]];
                };
            });
            let temp3 = d["Lab"].split(";");
            temp3.forEach((f,i) => {
                let a = f.split(":")
                if(a[1])
                {
                    let b = a[1].replace(new RegExp(' '), '');
                    temp3[i] = [a[0], cambio[b]];    
                }
                else
                {
                    temp3[i] = [a[0], cambio[a[1]]];
                };
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
                if(a[1])
                {
                    let b = a[1].replace(new RegExp(' '), '');
                    temp[i] = [a[0], cambio[b]];    
                }
                else
                {
                    temp[i] = [a[0], cambio[a[1]]];
                };
            });
            let temp2 = d["Ayudantia"].split(";");
            temp2.forEach((f,i) => {
                let a = f.split(":")
                if(a[1])
                {
                    let b = a[1].replace(new RegExp(' '), '');
                    temp2[i] = [a[0], cambio[b]];    
                }
                else
                {
                    temp2[i] = [a[0], cambio[a[1]]];
                };
            });
            let temp3 = d["Lab"].split(";");
            temp3.forEach((f,i) => {
                let a = f.split(":")
                if(a[1])
                {
                    let b = a[1].replace(new RegExp(' '), '');
                    temp3[i] = [a[0], cambio[b]];    
                }
                else
                {
                    temp3[i] = [a[0], cambio[a[1]]];
                };
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
            .style("fill", function(d) { return color(d[2]/maxRow)} )
            .on("mouseover", function(d) {
              let ojo = (valores[d[0]][d[1]].map(x => x[0])).toString()
              if(!ojo){
                ojo = "No hay ramos programados"
              }
              while(ojo.indexOf(',') != -1){
                ojo = ojo.replace(',', '<br>  <br>')
              }
              tooltip2.transition()
                        .duration(300)
                        .style("opacity", 1);

                        tooltip2
                        .style("left", (d3.event.pageX + 10) + "px")
                        .style("top", (d3.event.pageY + 10) + "px")
                        .html(ojo)
            })
            .on("mouseout", function() {
              tooltip2
                    .style("opacity", 0)
            })
            .on("mousemove", function(d) {
            tooltip2
                .style("left", (d3.event.pageX + 10) + "px")
                .style("top", (d3.event.pageY - 30) + "px")})
            .on("click", rehacer)
            .transition()
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
                        .data(final)
                        .on("mouseover", function(d) {
                                  let ojo = (valores[d[0]][d[1]].map(x => x[0])).toString()
                                  if(!ojo){
                                    ojo = "No hay ramos programados"
                                  }
                                  while(ojo.indexOf(',') != -1){
                                    ojo = ojo.replace(',', '<br>  <br>')
                                  }
                                  tooltip2.transition()
                                            .duration(300)
                                            .style("opacity", 1);

                                            tooltip2
                                            .style("left", (d3.event.pageX + 10) + "px")
                                            .style("top", (d3.event.pageY + 10) + "px")
                                            .html(ojo)
                                })
                                .on("mouseout", function() {
                                  tooltip2
                                        .style("opacity", 0)
                                })
                                .on("mousemove", function(d) {
                                tooltip2
                                    .style("left", (d3.event.pageX + 10) + "px")
                                    .style("top", (d3.event.pageY - 30) + "px")})
                                .transition();
    cuadrados.transition()
            .duration(500)
            .attr("x", function(d) { return x(d[0]) })
            .attr("y", function(d) { return y(d[1]) })
            .style("fill", function(d) { return color(d[2]/maxRow)} )
};

function exportar_csv(){
    var copy = semestres[semestre];
    var rows = copy.map(x => Object.values(x)).slice();
    rows.forEach(function(x){
                    x[2].forEach(function(i){
                        i[1] = otrocambio[i[1]];
                    })
                    x[3].forEach(function(i){
                        i[1] = otrocambio[i[1]];
                    })
                    x[4].forEach(function(i){
                        i[1] = otrocambio[i[1]];
                    })
                    if(x[0] == "Conocimiento, Cultura y Tecnología"){
                        x[0] = '"Conocimiento, Cultura y Tecnología"'
                    }
                    if(x[2][0] == ""){
                      x[2] = " "}
                    else{
                      x[2] = x[2].join(";").split(',').join(":")}
                    if(x[3][0] == ""){
                      x[3] = " "}
                    else {
                    x[3] = x[3].join(";").split(',').join(":")}
                    if(x[4][0] == ""){
                      x[4] = " "}
                    else{
                    x[4] = x[4].join(";").split(',').join(":")}})
    let csvContent = "data:text/csv;charset=utf-8," + "Nombre Curso,NRC,Catedra,Ayudantia,Lab\n"
    + rows.map(function(e){
        if(e[2] == ":"){
            e[2] = ""
        }
        if(e[3] == ":"){
            e[3] = ""
        }if(e[4] == ":"){
            e[4] = ""
        }
        return e.join(',')
    }).join("\n")
    semestres[semestre].map(x => Object.values(x)).forEach(function(x){
                        x[2].forEach(function(i){
                            i[1] = cambio[i[1]];
                        })
                        x[3].forEach(function(i){
                            i[1] = cambio[i[1]];
                        })
                        x[4].forEach(function(i){
                            i[1] = cambio[i[1]];
                        })}
                    )
   var encodedUri = encodeURI(csvContent);
   var link = document.createElement("a");
   link.setAttribute("href", encodedUri);
   link.setAttribute("download", semestre + ".csv");
   document.body.appendChild(link);

   link.click();
}

function mostrar_catedra() {
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

function rehacer() {
    d3.selectAll(".horario").remove()
    mostrar = this.__data__
    let ramos = []
    semestres[semestre].forEach(d => {
        if (catedra) {
            d["catedra"].forEach(element => {
                if(mostrar[0] == element[0] && mostrar[1] == element[1])
                {
                    ramos.push(["catedra", d["nombre"], d["NRC"]]);
                };
            });
        };
        if (ayud) {
            d["ayudantia"].forEach(element => {
                if(mostrar[0] == element[0] && mostrar[1] == element[1])
                {
                    ramos.push(["ayudantia", d["nombre"], d["NRC"]]);
                };
            });
        };
        if (lab) {
            d["lab"].forEach(element => {
                if(mostrar[0] == element[0] && mostrar[1] == element[1])
                {
                    ramos.push(["lab", d["nombre"], d["NRC"]]);
                };
            });
        };
    });

    if(ramos.length) {
        let form = d3.select("#Cambioshor")
                    .append("form")
                    .attr("class", "horario");
        
        let row = form.append("div").attr("class", "row");
        row.append("div").attr("class", "col-md-3").append('p').text("ramo");
        row.append("div").attr("class", "col-md-1").append('p').text("tipo");
        row.append("div").attr("class", "col-md-1").append('p').text("NRC");
        row.append("div").attr("class", "col-md-2").append('p').text("día");
        row.append("div").attr("class", "col-md-2").append('p').text("módulo");
        
        ramos.forEach(d => {
            
            let row = form.append("div").attr("class", "row");
            row.append("div").attr("class", "col-md-3").append('p').text(d[1]);
            row.append("div").attr("class", "col-md-1").append('p').text(d[0]);
            row.append("div").attr("class", "col-md-1").append('p').text(d[2]);
            row.append("div").attr("class", "col-md-2")
                    .append("input")
                    .attr("type", "text")
                    .attr("class", "dia");
            row.append("div").attr("class", "col-md-2")
                    .append("input")
                    .attr("type", "number")
                    .attr("class", "horas");
        });
        form.append("input").attr("type", "submit")
            .on("click", function() {
                d3.event.stopPropagation();
                d3.event.preventDefault();

                diascamb = d3.selectAll(".dia").nodes();
                horascamb = d3.selectAll(".horas").nodes();
                for(let i = 0; i < diascamb.length; i++) {
                    let a = horascamb[i].valueAsNumber;
                    let b = diascamb[i].value.toUpperCase();
                    if(!(isNaN(a)) && 0 < a && a < 9 && (dias.includes(b))) {
                        for(let j = 0; j < semestres[semestre].length; j++) {
                            if(semestres[semestre][j]["nombre"] == ramos[i][1] && 
                            semestres[semestre][j]["NRC"] == ramos[i][2]) {
                                let index = elindex(mostrar, semestres[semestre][j][ramos[i][0]]);
                                semestres[semestre][j][ramos[i][0]][index] = [b, cambio[a]];
                            }
                        }
                    }
                };
            
            d3.selectAll(".horario").remove()
            cambiarheat();
        });
        
    };
}
