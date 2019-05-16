
const MARGIN2 = { TOP: 20, BOTTOM: 40, LEFT: 750, RIGHT: 50 };

var svg2 = d3.select("#Cajon").select("svg")
        .append("g")
        .attr("transform",
            "translate(" + MARGIN2.LEFT + "," + MARGIN2.TOP + ")");

var dias = ["L", "M", "W", "J", "V", "S"];
var horarios = ["8:30", "10:00", "11:30", "13:00", "14:00", "15:30", "17:00", "18:30", "20:00"];

// Armar escalas
var x = d3.scaleBand()
        .range([0, width])
        .domain(dias)
        .padding(0.01);

svg2.append("g")
    .call(d3.axisBottom(x))

var y = d3.scaleBand()
        .range([0, height])
        .domain(horarios)
        .padding(0.01);

svg2.append("g")
    .call(d3.axisLeft(y));

// Escala de colores
var color = d3.interpolateYlOrRd

//Read the data
// d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/heatmap_data.csv", function(data) {

//   svg.selectAll()
//       .data(data, function(d) {return d.group+':'+d.variable;})
//       .enter()
//       .append("rect")
//       .attr("x", function(d) { return x(d.group) })
//       .attr("y", function(d) { return y(d.variable) })
//       .attr("width", x.bandwidth() )
//       .attr("height", y.bandwidth() )
//       .style("fill", function(d) { return myColor(d.value)} )

// })