<script>
  import { onMount } from "svelte";
  import * as d3 from "d3";

  var margin = { top: 10, right: 30, bottom: 30, left: 60 },
    width = 1000 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
  var svg;
  var xAxis;
  var yAxis;
  var line;
  var DataSet = [];
  var DataLine;
  var brushElement;
  var x = () => {};
  var y = () => {};
  let yTicks = [];

  setInterval(async () => {
    if (DataSet.length < 50) {
      DataSet.push({
        time: Math.floor(Math.random() * 1000) + 100,
        date: Date.now(),
      });
      Load();
    }
  }, 500);

  onMount(async () => {
    //Read the data
    Load();
  });

  function Load() {
    //  DataSet = data;
    // Add X axis --> it is a date format
    x = d3
      .scaleTime()
      .domain(
        d3.extent(DataSet, function (d) {
          return d.date;
        })
      )
      .range([0, width]);

    d3.select(xAxis).call(d3.axisBottom(x));

    // Add Y axis
    let extentY = [
      0,
      d3.max(DataSet, function (d) {
        return +d.time;
      }),
    ];

    y = d3.scaleLinear().domain(extentY).range([height, 0]);
    d3.select(yAxis).call(d3.axisLeft(y));

    // y ticks count to label by 5's
    yTicks = [];
    for (
      var i = Math.round(extentY[0]);
      i < Math.round(extentY[1] + 1);
      i = i + 5000
    ) {
      yTicks.push(Math.floor(i / 5000) * 5000);
    }

    // Add brushing
    var brush = d3
      .brushX() // Add the brush feature using the d3.brush function
      .extent([
        [0, 0],
        [width, height],
      ]) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
      .on("end", updateChart); // Each time the brush selection changes, trigger the 'updateChart' function
    // Add the brushing
    d3.select(brushElement).call(brush);

    DataLine = d3
      .line()
      .x(function (d) {
        return x(d.date);
      })
      .y(function (d) {
        return y(d.time);
      })(DataSet);

    // A function that set idleTimeOut to null
    var idleTimeout;
    function idled() {
      idleTimeout = null;
    }

    // A function that update the chart for given boundaries
    function updateChart(event) {
      // What are the selected boundaries?
      let extent = event.selection;

      // If no selection, back to initial coordinate. Otherwise, update X axis domain
      if (!extent) {
        if (!idleTimeout) return (idleTimeout = setTimeout(idled, 350)); // This allows to wait a little bit
        x.domain([4, 8]);
      } else {
        x.domain([x.invert(extent[0]), x.invert(extent[1])]);
        d3.select(brushElement).call(brush.move, null); // This remove the grey brush area as soon as the selection has been done
      }

      // Update axis and line position
      d3.select(xAxis).transition().duration(1000).call(d3.axisBottom(x));
      d3.select(line).select(".line").transition().duration(1000).attr("d", "");

      DataLine = d3
        .line()
        .x(function (d) {
          return x(d.date);
        })
        .y(function (d) {
          return y(d.time);
        })(data);
    }
  }
</script>

<div>
  <b
    >Monitoreo respuesta WebService de Registro de depósito (SAP) (milisegundos)</b
  >
</div>
<div bind:this={svg}>
  <svg
    class="svg"
    on:dblclick={() => {
      x.domain(
        d3.extent(DataSet, function (d) {
          return d.date;
        })
      );
      d3.select(xAxis).transition().call(d3.axisBottom(x));
      d3.select(line).select(".line").transition();

      DataLine = d3
        .line()
        .x(function (d) {
          return x(d.date);
        })
        .y(function (d) {
          return y(d.time);
        })(DataSet);
    }}
    ><g transform="translate(60,10)"
      ><g
        bind:this={xAxis}
        transform="translate(0,{height})"
        fill="none"
        font-size="10"
        font-family="sans-serif"
        text-anchor="middle"
        ><path class="domain" stroke="#000" d="M0.5,6V0.5H370.5V6" /><g
          class="tick"
          opacity="1"
          transform="translate(50.890625, 0)"
          ><line stroke="#000" y2="6" /><text fill="#000" y="9" dy="0.71em"
            >FECHA</text
          ></g
        ></g
      ><g fill="none" font-size="10" font-family="sans-serif" text-anchor="end"
        ><path class="domain" stroke="#000" d="M-6,{height}.5H0.5V0.5H-6" />

        {#each yTicks as yvalue}
          <g class="tick" opacity="1" transform="translate(0,{y(yvalue)})">
            <line stroke="#000" x2="-5" />
            <text dy="0.32em" fill="#000" x="-9">
              {yvalue / 1000} seg
            </text>
          </g>
        {/each}
      </g><defs
        ><clipPath id="clip"><rect {width} {height} x="0" y="0" /></clipPath
        ></defs
      ><g clip-path="url(#clip)"
        ><path
          bind:this={line}
          class="line"
          fill="none"
          stroke="steelblue"
          stroke-width="1.5"
          d={DataLine}
        /><g
          bind:this={brushElement}
          on:end={() => {
            alert("ok");
          }}
          class="brush"
          fill="none"
          pointer-events="all"
          style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);"
        /></g
      ></g
    ></svg
  >
</div>

<style>
  .svg {
    width: 1000px;
    height: 800px;
  }
</style>
