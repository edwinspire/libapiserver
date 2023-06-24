
<script>
    import { onMount } from 'svelte';
    import * as d3 from 'd3';
  
    let data1 = [1, 2, 3, 4, 5];
    let data2 = [6, 7, 8, 9, 100, 2, 7, 1,3];
  
    let svgContainer;
    
    onMount(() => {
      // D3 code to render the data
      const svg = d3.select(svgContainer)
        .attr('width', 400)
        .attr('height', 300);
        
      // Render data1
      svg.selectAll('circle')
        .data(data1)
        .enter()
        .append('circle')
        .attr('cx', (d, i) => i * 50 + 30)
        .attr('cy', 100)
        .attr('r', 10)
        .style('fill', 'red');
        
      // Render data2
      svg.selectAll('rect')
        .data(data2)
        .enter()
        .append('rect')
        .attr('x', (d, i) => i * 50 + 25)
        .attr('y', 120)
        .attr('width', 20)
        .attr('height', 20)
        .style('fill', 'blue');
    });
  </script>
  
  <svg bind:this={svgContainer}></svg>
  