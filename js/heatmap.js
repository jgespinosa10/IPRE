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

var ano20182 = [],
    ano20191 = [];

var maxRow = 5;

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

//Read the data
d3.csv("data/20182.csv").then(dataset1 => {
    d3.csv("data/20191.csv").then(dataset2 => {
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
            ano20182.push(
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
            ano20191.push(
                {
                    "nombre": d["Nombre Curso"],
                    "NRC":d["NRC"],
                    "catedra": temp,
                    "ayudantia": temp2,
                    "lab":temp3
                }
            );
        });
        valores = { 
                    "L":{"8:30":0, "10:00":0, "11:30":0, "14:00":0, "15:30":0, "17:00":0, "18:30":0, "20:00":0},
                    "M":{"8:30":0, "10:00":0, "11:30":0, "14:00":0, "15:30":0, "17:00":0, "18:30":0, "20:00":0},
                    "W":{"8:30":0, "10:00":0, "11:30":0, "14:00":0, "15:30":0, "17:00":0, "18:30":0, "20:00":0},
                    "J":{"8:30":0, "10:00":0, "11:30":0, "14:00":0, "15:30":0, "17:00":0, "18:30":0, "20:00":0},
                    "V":{"8:30":0, "10:00":0, "11:30":0, "14:00":0, "15:30":0, "17:00":0, "18:30":0, "20:00":0},
                    "S":{"8:30":0, "10:00":0, "11:30":0, "14:00":0, "15:30":0, "17:00":0, "18:30":0, "20:00":0}
                };
        ano20182.forEach(d => {
            d["catedra"].forEach(f => {
                if (Object.keys(valores).indexOf(f[0]) >= 0)
                {
                    if (Object.keys(valores[f[0]]).indexOf(f[1]) >= 0) 
                        {
                            valores[f[0]][f[1]]+=1;
                        };
                };
            });
            d["ayudantia"].forEach(f => {
                if (Object.keys(valores).indexOf(f[0]) >= 0)
                {
                    if (Object.keys(valores[f[0]]).indexOf(f[1]) >= 0) 
                        {
                            valores[f[0]][f[1]]+=1;
                        };
                };
            });
            d["lab"].forEach(f => {
                if (Object.keys(valores).indexOf(f[0]) >= 0)
                {
                    if (Object.keys(valores[f[0]]).indexOf(f[1]) >= 0) 
                        {
                            valores[f[0]][f[1]]+=1;
                        };
                };
            });
        });
        final = [];
        Object.keys(valores).forEach(d => {
            Object.keys(valores[d]).forEach(f => {
                final.push([d, f, valores[d][f]])
            })
        })
        maxRow = Math.max.apply(Math, final.map(function (i) {
                                    return i[2];}));
        
        legendscale.domain([0, maxRow]);
        legendGen.ticks(maxRow);
        legendAxis.call(legendGen);
        
        svg2.selectAll()
            .data(final)
            .enter()
            .append("rect")
            .attr("x", function(d) { return x(d[0]) })
            .attr("y", function(d) { return y(d[1]) })
            .attr("width", x.bandwidth() )
            .attr("height", y.bandwidth() )
            .style("fill", function(d) { return color(d[2]/maxRow)} );
    });
});