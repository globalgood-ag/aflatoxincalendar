// default view for map
let measure = "Rain";

const colors = [
  "Blues",
  "Greens",
  "Oranges",
  "Purples",
  "Reds",
  "Spectral",
  "Viridis",
  "Cool",
  "BuPu",
  "PuRd",
  "RdPu",
  "YlGnBu",
  "YlGn"
];

const aezCodes=
  {
    "101": "Temperate / arid",
    "102": "Temperate / Semi-arid",
    "103": "Temperate / sub-humid",
    "104": "Temperate / humid",
    "211": "Subtropic - warm / arid",
    "212": "Subtropic - warm / semiarid",
    "213": "Subtropic - warm / subhumid",
    "214": "Subtropic - warm / humid",
    "221": "Subtropic - cool / arid",
    "222": "Subtropic - cool / semiarid",
    "223": "Subtropic - cool / subhumid",
    "224": "Subtropic - cool / humid",
    "311": "Tropic - warm / arid",
    "312": "Tropic - warm / semiarid",
    "313": "Tropic - warm / subhumid",
    "314": "Tropic - warm / humid",
    "321": "Tropic - cool / arid",
    "322": "Tropic - cool / semiarid",
    "323": "Tropic - cool / subhumid",
    "324": "Tropic - cool / humid",
    "400": "Boreal"
  }

const cols = {
  Rain: {
    label: "Excess Rainfall Before Harvest, total 2003-2019",
    type: "numer",
    format: ",.0f",
    title: "Excess Rainfall After Harvest, total 2003-2019",
    latestyear: "2016",
    url: "http://www.num.org/",
    source: "num.org",
    description:
      "Total dekads characterized by climatic mycotoxin risk warning for rainfall for each region in Africa"
  },aezmedian: {
    label: "AgroEcological Zone",
    type: "numer",
    format: ",.0f",
    title: "AgroEcological Zone",
    latestyear: "2016",
    url: "http://www.num.org/",
    source: "num.org",
    description:
      "ago eco"
  }
  ,meanelectricity: {
    label: "No Access to Electricity, Mean (people/km^2???)",
    type: "numer",
    format: ",.0f",
    title: "No Access to Electricity, Mean",
    latestyear: "2016",
    url: "http://www.num.org/",
    source: "num.org",
    description:
      "No Access to Electricity, Mean"
  }
  ,meancattle: {
    label: "Number of Cattle, Mean  (cattle/some area???)",
    type: "numer",
    format: ",.0f",
    title: "Number of Cattle, Mean",
    latestyear: "2016",
    url: "http://www.num.org/",
    source: "num.org",
    description:
      "Number of Cattle, Mean"
  },
  Drought: {
    label: "Drought Stress Before Harvest, total 2003-2019",
    type: "numer",
    format: ".0f",
    title: "Drought Stress Before Harvest, total 2003-2019",
    latestyear: "2016",
    url: "http://www.num.org/",
    source: "num.org",
    description:
      "Estimates Developed by the UN Inter-agency Group for Child num Estimation ( UNICEF, WHO, World Bank, UN DESA Population Division )"
  },
  km2_tot: {
    label: "Surface Area (km^2)",
    type: "numer",
    format: ".0f",
    title: "Surface Area",
    latestyear: "2016",
    url: "http://www.num.org/",
    source: "num.org",
    description:
      "Total area )"
  }
};

let aspect=1.3
let width = 1100;
let height = width/aspect;

const regions = {
  Africa: {x:width/1.85,y:height/1.5,k:3.1},
  World: {x:width/2,y:height/1.8,k:1.1},
  Europe: {x:width/1.8,y:height/2.2,k:3.4},
  Asia: {x:width/1.35,y:height/2.2,k:2},
  Oceania: {x:width/1.17,y:height/1.3,k:3.7},
  SouthAmerica: {x:width/3,y:height/1.3,k:3},
  NorthAmerica: {x:width/4.5,y:height/2.2,k:2.6}
};



let projection = d3
  .geoMercator()
  .scale(width/7)
  .translate([width / 2, height /1.5]);

let path = d3.geoPath().projection(projection);

// spinner loader settings
const opts = {
  lines: 9, // The numer of lines to draw
  length: 9, // The length of each line
  width: 5, // The line thickness
  radius: 14, // The radius of the inner circle
  color: "#c10e19", // #rgb or #rrggbb or array of colors
  speed: 1.9, // Rounds per second
  trail: 40, // Afterglow percentage
  className: "spinner" // The CSS class to assign to the spinner
};



// select elements
let measureSelect = d3.select("#dimensions");
let regionSelect = d3.select("#region");
let levelSelect = d3.select("#level");


// use Susie Lu's d3-legend plugin
// http://d3-legend.susielu.com/
let d3legend = d3
  .legendColor()
  .shapeWidth(width / 10)
  .cells(9)
  .orient("horizontal")
  .labelOffset(3)
  .ascending(true)
  .labelAlign("middle")
  .shapePadding(2);
let svg = d3
  .select("svg")
  .attr("width", width)
  .attr("height", height);

  // create spinner
let target = d3.select("body").node();
// trigger loader
let spinner = new Spinner(opts).spin(target);

var margin = {top: 20, right: 30, bottom: 40, left: 150},
    width2 = 460 - margin.left - margin.right,
    height2 = 20000 - margin.top - margin.bottom;
let svg2 = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width2 + margin.left + margin.right)
    .attr("height", height2 + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

          // create options for select element
var selectEnter = measureSelect
  .selectAll("option")
  .data(d3.keys(cols).sort())
  .enter();
var selectUpdate = selectEnter.append("option");
selectUpdate
  .attr("value", function(d) {
    return d;
  })
  .text(function(d) {
    return cols[d].title;
  })
  .attr("selected", function(d) {
    if (d == measure) {
      return true;
    }
  });

var rgn = document.getElementById("region");
for(var reg in regions){
  option=document.createElement("option");
  option.text = reg;
  rgn.add(option);};

var region="Africa";
var level="provinces"

var lvl = document.getElementById("level");
var option3 = document.createElement("option");
var option4 = document.createElement("option");
option4.text = "provinces";
lvl.add(option4);
option3.text = "countries";
lvl.add(option3);

let countryObj = {};

function createMap(values) {
  data=values[1];
  topo=values[0];
  topo2=values[2];
  console.log(topo);
  spinner.stop();
  data.forEach(function(d) {
    d.Rain = +d["Rain"];
    countryObj[d.Region] = d;
  });

  var color = d3.scaleSequential();
  
  function defineColor(){
var extent = d3.extent(data.filter(function(d){return d["Continent"]==region || region=="World"}), function(d) {
      return +countryObj[d.Region][measure];
    });
   
    color.domain([extent[0], extent[1]])
    .interpolator(
        d3["interpolate" + colors[Math.floor(Math.random() * colors.length)]]
      );
}
      

  function renderChart(){ 	
   dat= data.filter(function(d){return d["Continent"]==region || region=="World"});
  var x = d3.scaleLinear()
    var max=d3.max(dat, function(d) { return d[measure]; });
       var x = d3.scaleLinear()
    .domain([0, max])
    .range([ 0, width2]);
  svg2.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height2-20 + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

  // Y axis
  var y = d3.scaleBand()
    .range([ 0, height2])
    .domain(dat.map(function(d) { return d.Region+", "+d.Country; }))
    .padding(.1);
  svg2.append("g")
    .call(d3.axisLeft(y))

  //Bars
  svg2.selectAll("myRect")
    .data(dat)
    .enter()
    .append("rect")
    .attr("x", x(0) )
    .attr("y", function(d) { return y(d.Region+", "+d.Country); }) //y(d.Region); })
    .attr("width", function(d) { return x(d[measure]); })
    .attr("height", y.bandwidth() )
    .attr("fill", function(d) { return color(d[measure]);})
  }

    function updateChart(){
      dat=data.filter(function(d){return d["Continent"]==region || region=="World"})
      var max=d3.max(dat, function(d) { 
        
        return +d[measure]; });
         console.log(max);
      
       var x = d3.scaleLinear()
    .domain([0, max])
    .range([ 0, width2]);
  
      var x_axis = d3.axisBottom()
			.scale(x);

		function update(){
			x.domain([0,max])

			svg2.select(".x")
				.transition()
      .ease(d3.easeCubic)           // control the speed of the transition
        .duration(600) 
				.call(x_axis)
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");
		}
    
    update();
      
  // Y axis
  var y = d3.scaleBand()
    .range([ 0, height2])
    .domain(dat.map(function(d) { return d.Region; }))
    .padding(.1);

    svg2.selectAll("rect")
      .data(dat)
      .transition().duration(800)
      .attr("x", x(0) )
    .attr("y", function(d) { return y(d.Region); })
    .attr("width", function(d) { return x(d[measure]); })
    .attr("height", y.bandwidth() )
    .attr("fill", function(d) { return color(d[measure]);})
    
  }

  // render map colors based on data
  function renderMap() {
    // counter for missing counties (usually in Alaska)
    console.log("rendering");
    d3legend
      .labelFormat(function(d) {
        let value;
        if (cols[measure].type == "percentage") {
          value = d / 100;
        } else {
          value = d;
        }
        return d3.format(cols[measure].format)(value);
      })
      .title(cols[measure].label)
      .scale(color);
    // if legend already exists, remove and create again
    svg.select(".legend").remove();
    // create legend
    let legend = svg
      .append("g")
      .attr("class", "legend")
      .attr(
        "transform",
        "translate(" + width / 24 + "," + height * 6 / 7 + ")"
      );
    legend.call(d3legend);

    var z=regions[region];
  
    mainPath
        .transition()
        .duration(0)
        .filter(function(d){return d.properties["att2_continent"]!=region && region!="World"})
        .style("fill", function(d) {    
            return "#ccc";
          }) ;

    mainPath
      .transition()
      .duration(1000)
      .filter(function(d){return d.properties["att2_continent"]==region || region=="World"})
      .style("fill", function(d) {
        let country = countryObj[d.properties.name1_shr];
        if (country && country[measure] === null) {
          console.log(country.Country + " does not have data");
          return "#ccc";
        } else if (country) {
          return color(country[measure]);
        } else {
          return "#ccc";
        }});
        zoomIn(z["x"],z["y"],z["k"],750);
    
console.log(data);  

  }

  // define zoom function
  function zoomed() {
    group.attr("transform", d3.event.transform);
    // group.select(".nation").style("stroke-width", 0.5 / d3.event.scale + "px");
    // group.select(".state-border").style("stroke-width", 0.5 / d3.event.scale + "px");
    // group.select(".country-border").style("stroke-width", 0.1 / d3.event.scale + "px");
  }
let centered;
  // When clicked, zoom in
  function clicked(d) {
    
    var x, y, k;
console.log(d);

    // Compute centroid of the selected path
    if (d && centered !== d) {
      // if (d) {
      var centroid = path.centroid(d);
      x = centroid[0];
      y = centroid[1];
      // k = zoom.scaleExtent()[1];
      k = 12;
      centered = d;
      zoomIn(x,y,k,750);// Manually Zoom
    } else {
      var z=regions[region];
      zoomIn(z["x"],z["y"],z["k"],750)
      centered = null;
    }
    document.getElementById("chart2").style.display="block";
    document.getElementById("chart3").style.display="block";
    document.getElementById("my_dataviz3").style.display="block";
    document.getElementById("my_dataviz4").style.display="block";
    heatmapChart(d.properties.asap1_id);
    //heatmapChart(d.properties.asap1_id);
    cropChart(d.properties.asap1_id);
    /*svg.append("path")
    .datum(d)
    .attr("d", path)
    .attr("stroke", "#777")
    .attr("stroke-width","60px");*/
  }

  // create background box for zoom
  svg
    .append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height);

  let zoom = d3
    .zoom()
    .scaleExtent([1, 15])
    .on("zoom", zoomed);

  svg.style("pointer-events", "all").call(zoom);

  let group = svg.append("g").attr("class", "continent");  

if(level=="provinces"){
  let provincePath = group
    .selectAll(".provinces")
    .data(topojson.feature(topo, topo.objects.agull).features)
    .enter()
    .append("path")
    .attr("class", "province-border")
    .attr("d", path)
    .on("click", clicked);
  mainPath=provincePath;
  }

  let countryPath = group
  .selectAll(".countries")
  .data(topojson.feature(topo2, topo2.objects.agull).features)
  .enter()
  .append("path")
  .attr("class", "country-border")
  
  .attr("d", path);
console.log(countryPath);

     if(level=="countries"){
    countryPath.on("click", clicked);
    mainPath=countryPath;
    
    }
    //document.querySelectorAll('.country-border').style.pointerEvents="none";

var marginCro = { top: 20, right: 0, bottom: 10, left: 70 },
          widthCro = 560 - marginCro.left - marginCro.right,
          heightCro = 120 - marginCro.top - marginCro.bottom,
          gridSize = Math.floor(widthCro / 20),  
          months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
          cropFile="https://raw.githubusercontent.com/Ben-Keller/aflamap/master/cropcal.csv";

      var svg5 = d3.select("#chart3").append("svg")
          .attr("width", widthCro + marginCro.left + marginCro.right)
          .attr("height", heightCro + marginCro.top + marginCro.bottom)
          .append("g")
          .attr("transform", "translate(" + marginCro.left + "," + marginCro.top + ")");

      var lines1 = svg5.selectAll(".lines1")
          .data(months);

      //cards.append("title");
        
      lines1.enter().append("rect")
      .attr("x", function(d,i){return i*widthCro/24.8})
      .attr("y", 0)
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("class", "lines1 bordered")
      .attr("width", 1)
      .attr("height", heightCro+20)
      .transition().duration(200)
      .style("fill", "black") 


        const calCodes={
          "Sowing":"lime",
                "Growing":"green",
                "Harvesting":"blue"  
            
    
    }  

     var cropChart = function(id) {
        d3.csv(cropFile).then(
        function(data) {
               data=data.filter(function(d){
                return d.asap1_id==id;
            });
            console.log("me");
            console.log(data);
     svg5.selectAll(".crops").remove()
          var crops = svg5.selectAll(".crops")
              .data(data);
          
          crops.enter().append("rect")
              .attr("x", 0)
              .attr("y", function(d,i) { return heightCro - i * gridSize/1.5-20; })
              .attr("rx", 4)
              .attr("ry", 4)
              .attr("class", "crops bordered")
              .attr("width", function(d) {if(+d.sos_e<+d.sos_s){return (d.sos_e+1)*gridSize/2}
            else if(+d.eos_s<+d.sos_e){return (d.eos_s)*gridSize/2} else if(+d.eos_e<+d.eos_s){return (+d.eos_e+1)*gridSize/2} else{return 0;}})
              .attr("height", gridSize/1.5)
              .transition().duration(200)
              .style("fill", function(d){if(+d.sos_e<+d.sos_s){return calCodes["Sowing"]}
            else if(+d.eos_s<+d.sos_e){return calCodes["Growing"]} else if(+d.eos_e<+d.eos_s) {return calCodes["Harvesting"]}else {return "blue"}});
              //.text("Sowing");            

          crops.enter().append("rect")
              .attr("x", function(d) { return (d.sos_s-1) * gridSize/2; })
              .attr("y", function(d,i) { return heightCro - i * gridSize/1.5-20; })
              .attr("rx", 4)
              .attr("ry", 4)
              .attr("class", "crops bordered")
              .attr("width", function(d) {if(+d.sos_e>+d.sos_s) {return((d.sos_e-d.sos_s+1)*gridSize/2)}
            else {return (37-d.sos_s)*gridSize/2}})
              .attr("height", gridSize/1.5)
              .transition().duration(200)
              .style("fill", calCodes["Sowing"]);
              //.text("Sowing");            

              crops.enter().append("rect")
              .attr("x", function(d) { return (d.sos_e) * gridSize/2; })
              .attr("y", function(d,i) { return heightCro - i * gridSize/1.5-20; })
              .attr("rx", 4)
              .attr("ry", 4)
              .attr("class", "crops bordered")
              .attr("width", function(d) {if(+d.eos_s>+d.sos_e) {return((d.eos_s-d.sos_e)*gridSize/2)}
            else {return (36-d.sos_e)*gridSize/2}})
              .attr("height", gridSize/1.5)
              .transition().duration(250)
              .style("fill", calCodes["Growing"]);

              crops.enter().append("rect")
              .attr("x", function(d) { return (d.eos_s-1) * gridSize/2; })
              .attr("y", function(d,i) { return heightCro- i * gridSize/1.5-20; })
              .attr("rx", 4)
              .attr("ry", 4)
              .attr("class", "crops bordered")
              .attr("width", function(d) {if(+d.eos_e>+d.eos_s) {return((d.eos_e-d.eos_s+1)*gridSize/2)}
            else {return (37-d.eos_s)*gridSize/2}})
              .attr("height", gridSize/1.5)
              .transition().duration(300)
              .style("fill", calCodes["Harvesting"]);

                       //cards.select("title").text(function(d) { return codes[d.value]; });
          
          crops.exit().remove();
          svg5.selectAll(".cropLabel").remove();
          var cropLabels = svg5.selectAll(".cropLabel")
          .data(data)
          .enter().append("text")
            .text(function (d) { return d.crop_name.replace(/ *\([^)]*\) */g, ""); })
            .attr("x", 0)
            .attr("y", function (d, i) { return heightCro - i * gridSize/1.5-3-20; })
            .style("text-anchor", "end")
            .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
            .attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? "cropLabel mono axis axis-workweek" : "cropLabel mono axis"); });



// select the svg area
var svg6 = d3.select("#my_dataviz4")

// Add one dot in the legend for each name.
var size = 20
var svgText = svg6.append("text");
svgText
.text("Crop Calendar")
.attr("x",205).attr("y",80).attr("font-size",19);
svg6.selectAll("dots1")
  .data(Object.values(calCodes))
  .enter()
  .append("rect")
  .attr("x", function (d, i) { return (i*widthCro-1)/4+105; })
    .attr("y", 100) // 100 is where the first dot appears. 25 is the distance between dots
    .attr("width", size)
    .attr("height", size/1.5)
    .attr("rx", 4)
.attr("ry", 4)
.style("stroke","#E6E6E6")
    .style("fill", function(d){ return d})

// Add one dot in the legend for each name.
svg6.selectAll("labels1")
  .data(Object.keys(calCodes))
  .enter()
  .append("text")
  .attr("x", function (d, i) { return (i*widthCro-1)/4+135; })
  .attr("y", 110) 
    .style("fill", "black")
    .text(function(d){ return d})
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")
  
      
        }).catch(function(error){
            console.log(error);
        });  
      };

    var marginCal = { top: 20, right: 0, bottom: 30, left: 70 },
    widthCal = 560 - marginCal.left - marginCal.right,
    heightCal = 245 - marginCal.top - marginCal.bottom,
    gridSize = Math.floor(widthCal / 20),
    years = [2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020]
    months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    csvFile="https://raw.githubusercontent.com/Ben-Keller/aflamap/master/aflaWarnings.csv";

var svg3 = d3.select("#chart2").append("svg")
    .attr("width", widthCal + marginCal.left + marginCal.right)
    .attr("height", heightCal + marginCal.top + marginCal.bottom)
    .append("g")
    .attr("transform", "translate(" + marginCal.left + "," + marginCal.top + ")");

var dayLabels = svg3.selectAll(".dayLabel")
    .data(years)
    .enter().append("text")
      .text(function (d) { return d; })
      .attr("x", 0)
      .attr("y", function (d, i) { return i * gridSize/2-3; })
      .style("text-anchor", "end")
      .attr("transform", "translate(-6," + gridSize / 2 + ")")
      .attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis"); });

var timeLabels = svg3.selectAll(".timeLabel")
    .data(months)
    .enter().append("text")
      .text(function(d) { return d; })
      .attr("x", function(d, i) { return i * gridSize*1.5+5; })
      .attr("y", 0)
      .style("text-anchor", "middle")
      .attr("transform", "translate(" + gridSize / 2 + ", -6)")
      .attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"); });
var lines2 = svg3.selectAll(".lines2")
      .data(months);

lines2.enter().append("rect")
.attr("x", function(d,i){return i*widthCal/24.8})
.attr("y", -40)
.attr("rx", 4)
.attr("ry", 4)
.attr("class", "lines2 bordered")
.attr("width", 1)
.attr("height", 40)
.transition().duration(200)
.style("fill", "black") 

      const warningColors={
"n":"white",
"e":"lime",
"r":"green",
"d":"yellow",
"h":"blue",
"w":"purple"}  

const codes={

  "e":"Crops in early stages",
"r":"Pre-harvest: no drought conditions",
"h":"Around harvest: normal rain",

"n":"Crops not present/active",

"d":"Pre-harvest: drought conditions",
"w":"Around harvest: abundant rain"}

var heatmapChart = function(id) {

  let textHeader = d3.select("#textDescription h3");
  let textDescription = d3.select("#textDescription p");    
  

    el=data.filter(function(d){
        return d.asap1_id==id;
    });
    console.log(el[0]);
  textHeader.text(el[0].name1_shr +", "+el[0].Country);
  textDescription
    .style("opacity", 0)

  svg3.selectAll(".dekad").remove();
  d3.csv(csvFile).then(
  function(data) {
      
      data=data.filter(function(d){
          return d.asap1_id==id;
      });
         

      data=data.map(function(d){
      
      return{
      year: +Math.floor((d.reference_date-1)/36+1),
      dekad: +(d.reference_date-1)%36+1,
      value: d.class_code}
               
  });

         
 console.log(data);
 
    var cards = svg3.selectAll(".dekad")
        .data(data, function(d) {return d.year+':'+d.dekad;});

    


    cards.append("title");

    cards.enter().append("rect")
        .attr("x", function(d) { return (d.dekad - 1) * gridSize/2; })
        .attr("y", function(d) { return (d.year - 1) * gridSize/2; })
        .attr("rx", 4)
        .attr("ry", 4)
        .style("fill","white")
        .attr("class", "dekad bordered")
        .attr("width", gridSize/2)
        .attr("height", gridSize/2)
        .transition().duration(300)
        .style("fill", function(d) { return warningColors[d.value]; });
                  
    cards.select("title").text(function(d) { return codes[d.value]; });
  
    cards.exit().remove();

// select the svg area
var SVG4 = d3.select("#my_dataviz3")

// create a list of keys


// Add one dot in the legend for each name.
var size = 20
SVG4.selectAll("mydots")
.data(Object.keys(codes))
.enter()
.append("rect")
.attr("x", function(d,i){return 25+260*Math.floor(i/3)})
.attr("y", function(d,i){ return (15+i*(size+5))%75}) // 100 is where the first dot appears. 25 is the distance between dots
.attr("width", size/2)
.attr("height", size/2)
.attr("rx", 4)
.attr("ry", 4)
.style ( "stroke" , "#E6E6E6" )
.style("fill", function(d){ return warningColors[d]})

// Add one dot in the lege0nd for each name.
SVG4.selectAll("mylabels")
.data(Object.keys(codes))
.enter()
.append("text")
.attr("x", function(d,i){return 20+260*Math.floor(i/3) +size*1.2}) 
.attr("y", function(d,i){ return (10+i*(size+5))%75 + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
.style("fill", "black")
.text(function(d){ return codes[d]})
.attr("text-anchor", "left")
.style("alignment-baseline", "middle")

  }).catch(function(error){
      console.log(error);
  });  
};    



 /*
function title(d) {
    var x, y;

    // Compute centroid of the selected path
    if (d && centered !== d) {
      // if (d) {
      var centroid = path.centroid(d);
      x = centroid[0];
      y = centroid[1];
      return x,y;
    }}

      console.log("titling");
     let titles=group.selectAll(".countries")
      .data(d3.json("...."))
   .enter()
    .append("path")
    .attr("class", "country-border2")
    .attr("d", path);
   
  
  titles.append("text")
                        .attr("class", "country-label")
                        .attr("transform", function(d) { console.log("d", d); return "translate(" +           path.centroid(d) + ")"; })
                        .text(function(d) { return d.properties.gunit; })
                        .attr("dx", function (d) {return "0.3em";
                    }).attr("dy", function (d) {
                        return "0.35em";
                    }).style('fill', 'black');
  */

  defineColor();
  renderChart();
  //renderHistogram();
  renderMap();
  renderText();
  bindHover();

  measureSelect.on("change", function(d) {
    measure = this.value;
    defineColor();
    updateChart();
    renderMap();
    renderText();
  });

  levelSelect.on("change", function(d) {
    /*renderText();
    spinner = new Spinner(opts).spin(target);
    level = this.value;
    var promises=[]
    promises.push(d3.json("https://raw.githubusercontent.com/Ben-Keller/aflamap/master/provinces.json"))
    promises.push(d3.csv("https://raw.githubusercontent.com/Ben-Keller/aflamap/master/aflaDataFull.csv"))
    promises.push(d3.json("https://raw.githubusercontent.com/Ben-Keller/aflamap/master/countries.json"))
  Promise.all(promises).then(function(values) {
    svg.selectAll("*").remove();
    svg2.selectAll("*").remove();
    countryObj = {};
    console.log(values);
    createMap(values);
  });
    */
  });

  regionSelect.on("change", function(d) {
    region = this.value;
    var z=regions[region];
  
   // zoomIn(z["x"],z["y"],z["k"],750);
    defineColor();
    updateChart();
    renderMap();
    renderText();
  });

  function zoomIn(x,y,k,dur){
        svg
          .transition()
          .duration(dur)
          .call(
            zoom.transform,
            d3.zoomIdentity
              .translate(width / 2, height / 2)
              .scale(k)
              .translate(-x, -y)
          );
         console.log(region);
      ;}
}

// change factor description
function renderText() {
  let textHeader = d3.select("#textDescription h3");
  let textDescription = d3.select("#textDescription p");
  let title = cols[measure].title;
  let description = cols[measure].description;
  document.getElementById("chart3").style.display="none";
  document.getElementById("chart2").style.display="none";
  document.getElementById("my_dataviz3").style.display="none";
  document.getElementById("my_dataviz4").style.display="none";
  textHeader
    .style("opacity", 0)
    .transition()
    .duration(1000)
    .style("opacity", 1)
    .text(title);
  textDescription
    .style("opacity", 0)
    .transition()
    .style("opacity", 1)
    .text(description);
}

// define mouseover and mouseout events
// to ensure mouseover events work on IE
function bindHover() {
  document.body.addEventListener("mousemove", function(e) {
    if (e.target.nodeName == "path") {
      let d = d3.select(e.target).data()[0].properties;
       let content = "";
      try{
    
         content =
          "<b>" +
          d.name1_shr +
          "</b><br>" +
          "AEZ: " +
          aezCodes[String(parseInt(countryObj[d.name1_shr]["aezmedian"]))]+
          "<br>" +
          "Country: " +
         countryObj[d.name1_shr]["Country"] +
          "<br>" +
          "Rain: " +
          countryObj[d.name1_shr]["Rain"] +
          "<br>" +
          "Percentage of area as crop: " +
          ((countryObj[d.name1_shr]["km2_crop"] /countryObj[d.name1_shr]["km2_tot"])*100).toFixed(2);
         
         }
      catch{content =
          "<b>" +
          d.name1_shr;}
     
   
      showDetail(e, content);
    }
  });
  document.body.addEventListener("mouseout", function(e) {
    if (e.target.nodeName == "path") hideDetail();
  });
}
// create tooltip
let tooltip = d3
  .select("body")
  .append("div")
  .style("position", "absolute")
  .style("z-index", "10")
  .style("visibility", "hidden")
  .attr("class", "tooltip");
// Show tooltip on hover
function showDetail(event, content) {
  // show tooltip with information from the __data__ property of the element

  let x_hover = 0;
  let y_hover = 0;
  let tooltipWidth = parseInt(tooltip.style("width"));
  let tooltipHeight = parseInt(tooltip.style("height"));
  let classed, notClassed;
  if (event.pageX > document.body.clientWidth / 2) {
    x_hover = tooltipWidth + 30;
    classed = "right";
    notClassed = "left";
  } else {
    x_hover = -30;
    classed = "left";
    notClassed = "right";
  }
  y_hover =
    document.body.clientHeight - event.pageY < tooltipHeight + 4
      ? event.pageY - (tooltipHeight + 4)
      : event.pageY - tooltipHeight / 2;
  return tooltip
    .classed(classed, true)
    .classed(notClassed, false)
    .style("visibility", "visible")
    .style("top", y_hover + "px")
    .style("left", event.pageX - x_hover + "px")
    .html(content);
}
// Hide tooltip on hover
function hideDetail() {
  // hide tooltip
  return tooltip.style("visibility", "hidden");
}

function setResponsiveSVG() {
  let width = +d3.select("svg").attr("width");
  let height = +d3.select("svg").attr("height");
  let calcString = +(height / width) * 100 + "%";
  let svgElement = d3.select("svg");
  let svgParent = d3.select(d3.select("svg").node().parentNode);
  svgElement
    .attr("class", "scaling-svg")
    .attr("preserveAspectRatio", "xMinYMin")
    .attr("viewBox", "0 0 " + width + " " + height)
    .attr("width", null)
    .attr("height", null);
  svgParent.style("padding-bottom", calcString);
}

  var promises=[]
    promises.push(d3.json("https://raw.githubusercontent.com/Ben-Keller/aflamap/master/provinces.json"))
    promises.push(d3.csv("https://raw.githubusercontent.com/Ben-Keller/aflamap/master/aflaDataFull.csv"))
    promises.push(d3.json("https://raw.githubusercontent.com/Ben-Keller/aflamap/master/countries.json"))

  Promise.all(promises).then(function(values) {
    console.log(values)
     console.log("nna")
     createMap(values);
     setResponsiveSVG();
  });

