'use strict';

import 'normalize.css';
require('./styles/index.scss');

localStorage.setItem('example_project', 'D3: Scatter Plot');

const url = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

const color = d3.scaleOrdinal(d3.schemeCategory10);

const margin = {
    top: 100,
    right: 20,
    bottom: 30,
    left: 60
  },
  width = 920 - margin.left - margin.right,
  height = 630 - margin.top - margin.bottom;

const svg = d3.select("main")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .attr("class", "graph")
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Define the div for the tooltip
const tooltip = d3.select("main")
  .append("div")
  .attr("class", "tooltip")
  .attr("id", "tooltip")
  .style("opacity", 0);

// User Story #1: I can see a title element that has a corresponding id="title".
// title
svg.append("text")
  .attr("id","title")
  .attr("x", (width / 2))
  .attr("y", 0 - (margin.top / 2))
  .attr("text-anchor", "middle")
  .style("font-size", "30px")
  .text("Doping in Professional Bicycle Racing");

d3.json(url, dataset => {
  // User Story #11: I can see that the range of the x-axis labels are within the range of the actual x-axis data.
  const xScale = d3.scaleLinear()
    .domain([d3.min(dataset, d => d.Year-1), d3.max(dataset, d => d.Year+1)])
    .range([0, width]);

  // User Story #12: I can see that the range of the y-axis labels are within the range of the actual y-axis data.
  const yScale = d3.scaleTime()
    .domain([d3.min(dataset, d => formatTimeString(d)), d3.max(dataset, d => formatTimeString(d))])
    .range([0, height]);

  // User Story #10: I can see multiple tick labels on the x-axis that show the year.
  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));

  // User Story #9: I can see multiple tick labels on the y-axis with %M:%S time format.
  const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

  // User Story #2: I can see an x-axis that has a corresponding id="x-axis".
  svg.append('g')
    .call(xAxis)
    .attr('id', 'x-axis')
    .attr('transform', `translate(0, ${height})`);

  // User Story #3: I can see a y-axis that has a corresponding id="y-axis".
  svg.append('g')
    .call(yAxis)
    .attr('id', 'y-axis')
    .attr('transform', `translate(0, 0)`);

  // User Story #4: I can see dots, that each have a class of dot, which represent the data being plotted.
  svg.selectAll('circle')
    .data(dataset)
    .enter()
    .append('circle')
    .attr('class', 'dot')
    // User Story #7: The data-xvalue and its corresponding dot should align with the corresponding point/value on the x-axis.
    .attr('cx', d => xScale(d.Year))
    // User Story #8: The data-yvalue and its corresponding dot should align with the corresponding point/value on the y-axis.
    .attr('cy', d => yScale(formatTimeString(d)))
    .attr('r', 5)
    .style('fill', d => color(d.Doping !== ''))
    // User Story #5: Each dot should have the properties data-xvalue and data-yvalue containing their corresponding x and y values.
    .attr('data-xvalue', d => d.Year)
    .attr('data-yvalue', d => formatTimeString(d))
    .on('mouseover', d => {
      tooltip.transition()
             .duration(200)
             .style('opacity', .9);

      tooltip.attr('data-year', d.Year)
             .html(`${d.Name} : ${d.Nationality}<br>
                    Year: ${d.Year}, Time: ${d.Time}
                    ${d.Doping && '<br><br>' + d.Doping}`)
             .style('left', `${d3.event.pageX}px`)
             .style('top', `${d3.event.pageY}px`);
    })
    .on('mouseout', () => {
      tooltip.transition()
             .duration(200)
             .style('opacity', 0);
    });

  // User Story #13: I can see a legend containing descriptive text that has id="legend".
  const legend = svg.selectAll(".legend")
    .data(color.domain())
    .enter()
    .append("g")
    .attr("class", "legend")
    .attr("id", "legend")
    .attr("transform", function(d, i) {
      return "translate(0," + (height/2 - i * 20) + ")";
    });

  legend.append("rect")
    .attr("x", width - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", color);

  legend.append("text")
    .attr("x", width - 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text((d) => d ? "Riders with doping allegations": "No doping allegations");
});

const formatTimeString = (d) => {
  const [min, sec] = d.Time.split(':');
  const date = new Date();
  date.setMinutes(min);
  date.setSeconds(sec);
  return date;
};



var legendColors = colorbrewer.RdYlBu[11].reverse();
var legendWidth = 400;
var legendHeight = 300/legendColors.length;

var variance = data.monthlyVariance.map(function(val){
  return val.variance;
});
var minTemp = data.baseTemperature + Math.min.apply(null, variance);
var maxTemp = data.baseTemperature + Math.max.apply(null, variance);

var legendThreshold = d3.scale.threshold()
  .domain((function(min,max,count){
    var array = [];
    var step = (max-min)/count;
    var base = min;
    for(var i = 1; i < count; i++){
      array.push(base + i*step);
    }
    return array;
  })(minTemp, maxTemp,legendColors.length))
  .range(legendColors);

var legendX = d3.scale.linear()
  .domain([minTemp, maxTemp])
  .range([0, legendWidth]);

var legendXAxis = d3.svg.axis()
  .scale(legendX)
  .orient("bottom")
  .tickSize(10, 0)
  .tickValues(legendThreshold.domain())
  .tickFormat(d3.format(".1f"));

var legend = svg.append("g")
  .classed("legend", true)
  .attr("id", "legend")
  .attr("transform", "translate(" + (padding.left) + "," + (padding.top + height + padding.bottom - 2*legendHeight) + ")");

legend.append("g")
  .selectAll("rect")
  .data(legendThreshold.range().map(function(color){
    var d = legendThreshold.invertExtent(color);
    if(d[0] == null) d[0] = legendX.domain()[0];
    if(d[1] == null) d[1] = legendX.domain()[1];
    return d;
  }))
  .enter().append("rect")
  .style("fill", function(d, i){return legendThreshold(d[0])})
  .attr({
    x: function(d,i){return legendX(d[0])},
    y: 0,
    width: function(d,i){return legendX(d[1]) - legendX(d[0])},
    height: legendHeight
  });

legend.append("g")
  .attr("transform", "translate(" + 0 + "," + legendHeight + ")")
  .call(legendXAxis);
