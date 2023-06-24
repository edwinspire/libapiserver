<script>
    import LinePlot from './plotter.svelte';
    import * as d3 from 'd3';
    import { onMount } from "svelte";

    let data = d3.ticks(-2, 2, 200).map(Math.sin);

  /*  
    const data = [
    {
      path: "/api/testapp/t001/fetch_test/v0.01/dev",
      time: 477,
      method: "GET",
      timestamp: 1687495418047,
    },
    {
      path: "/api/testapp/t001/fetch_test/v0.01/dev",
      time: 393,
      method: "GET",
      timestamp: 1687495418721,
    },
    {
      path: "/api/testapp/t001/fetch_test/v0.01/dev",
      time: 384,
      method: "GET",
      timestamp: 1687495419423,
    },
    {
      path: "/api/testapp/t001/fetch_test/v0.01/dev",
      time: 400,
      method: "GET",
      timestamp: 1687495420060,
    },
    {
      path: "/api/testapp/t001/fetch_test/v0.01/dev",
      time: 567,
      method: "GET",
      timestamp: 1687495420757,
    },
    {
      path: "/api/testapp/t001/fetch_test/v0.01/dev",
      time: 463,
      method: "GET",
      timestamp: 1687495421415,
    },
    {
      path: "/api/testapp/t001/fetch_test/v0.01/dev",
      time: 485,
      method: "GET",
      timestamp: 1687495422024,
    },
  ];
*/
  let svg;

  onMount(() => {
    setInterval(() => {
        //data = data.slice(-200).concat(Math.atan2(Math.floor(Math.random() * 1000) + 1, Math.floor(Math.random() * 1000) + 1));
        //data = data.slice(-200).concat(Math.floor(Math.random() * 1000) + 100);
   //     data.push({time: Math.floor(Math.random() * 1000) + 100, date: Date.now()});
/*
        data.push({
        path: "/api/testapp/t001/fetch_test/v0.01/dev",
        time: Math.floor(Math.random() * 1000) + 1,
        method: "GET",
        timestamp: Date.now(),
      });
      */
//console.log(data);

    }, 500);
  });

  </script>


  <LinePlot data={data} />
