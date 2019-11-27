const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';
let json = '';
const request = new XMLHttpRequest();
request.open("GET", url, true);
request.send();
request.onload = () => { 
	
  json = JSON.parse(request.responseText);
  const dataset = json.data;  
  const outerWidth = dataset.length*3;
  const outerHeight = 500;
  const margin = { left: 50, right: 0, top: 30, bottom: 20 };
  const innerWidth = outerWidth - margin.left - margin.right;
  const innerHeight = outerHeight - margin.top - margin.bottom;
  const div = d3.select('body').append('div')
                .attr('id', 'tooltip')
                .style('opacity', 0);
  
  const svg = d3.select('div')
                .append('svg')
                .attr('width', outerWidth)
                .attr('height', outerHeight)

  
  const xScale = d3.scaleTime()
  .domain([d3.min(dataset, d => new Date(d[0])), d3.max(dataset, d => new Date(d[0]))])
  .range([margin.left, innerWidth]);
  
  const yScale = d3.scaleLinear()
  .domain([0, d3.max(dataset, d => d[1])])
  .range([innerHeight, margin.top]);
  
  
  d3.select('svg')
      .append('text')
      .attr('x', -margin.top-180)
      .attr('y', margin.left + 20)
      .attr('transform', "rotate(-90)")
      .text('Gross Domestic Product')
  
  
  svg.selectAll('rect')
  .data(dataset)
  .enter()
  .append('rect')
  .attr('x', (d, i) => xScale(new Date(d[0])))
  .attr('y', d => yScale(d[1]))
  .attr('width', 3)
  .attr('height', d => innerHeight - yScale(d[1]))
  .attr('data-gdp', d => d[1])
  .attr('data-date', d => d[0])
  .attr('fill', 'navy')
  .attr('class', 'bar')
  .on('mouseover', d => {
    div.transition()
        .duration(200)
        .style('opacity', .7)
        .attr('data-date', d[0])
    div.html(`${d[0]}<br/>$${d[1]} Billion`)
        .style('left', `${d3.event.pageX}px`)
        .style('top', `${d3.event.pageY}px`)
    })
  .on('mouseout', d => {
     div.transition()
        .duration(200)
        .style('opacity', 0)
        .attr('data-date', '')
    })

  
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);
  
  svg.append('g')
  .attr('transform', `translate(0, ${innerHeight})`)
  .attr('id', 'x-axis')
  .call(xAxis)
  
  
  svg.append('g')
  .attr('transform', `translate(${margin.left}, 0)`)
  .attr('id', 'y-axis')
  .call(yAxis);
  
};