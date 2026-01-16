function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Bubble map</h1><a href="https://d3js.org/">D3</a> › <a href="/@d3/gallery">Gallery</a></div>

# 美國機場 Bubble Map

以泡泡標示全美機場位置，點擊泡泡可查看機場資訊。資料來源： [OurAirports](https://ourairports.com/)`
)}

function _chart(airports,d3,topojson,us)
{
  const width = 975;
  const height = 610;

  const projection = d3.geoAlbersUsa();
  const path = d3.geoPath(projection);

  // Create the SVG container. Its dimensions correspond to the bounding-box
  // of the pre-projected US shapefile. 
  const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "width: 100%; height: auto; height: intrinsic;");

  const nation = topojson.feature(us, us.objects.nation);
  const statesGeo = topojson.feature(us, us.objects.states).features;
  const statesMesh = topojson.mesh(us, us.objects.states, (a, b) => a !== b);
  projection.fitSize([width, height], nation);

  // Create the cartographic background layers.
  svg.append("path")
      .datum(nation)
      .attr("fill", "#eee")
      .attr("d", path);

  const statePaths = svg.append("g")
    .selectAll("path")
    .data(statesGeo)
    .join("path")
      .attr("fill", "#ddd")
      .attr("stroke", "white")
      .attr("stroke-linejoin", "round")
      .attr("d", path);

  svg.append("path")
      .datum(statesMesh)
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-linejoin", "round")
      .attr("d", path);

  const radiusByType = new Map([
    ["large_airport", 6],
    ["medium_airport", 4],
    ["small_airport", 2.5],
    ["heliport", 2],
    ["seaplane_base", 2],
    ["balloonport", 2],
    ["closed", 1.5]
  ]);

  const tooltip = d3.select("body")
    .append("div")
    .attr("class", "airport-tooltip")
    .style("position", "absolute")
    .style("pointer-events", "none")
    .style("background", "rgba(0, 0, 0, 0.75)")
    .style("color", "#fff")
    .style("padding", "8px 10px")
    .style("border-radius", "6px")
    .style("font", "12px/1.4 sans-serif")
    .style("opacity", 0);

  const points = airports
    .map((airport) => {
      const coords = projection([airport.lon, airport.lat]);
      return coords ? { ...airport, coords } : null;
    })
    .filter(Boolean);

  const stateById = new Map(statesGeo.map((state) => [state.id, state]));
  const statePathById = new Map();
  statePaths.each(function(state) {
    statePathById.set(state.id, d3.select(this));
  });

  let activeStateId = null;

  const resetStateHighlight = () => {
    if (activeStateId == null) return;
    const path = statePathById.get(activeStateId);
    if (path) {
      path.attr("fill", "#ddd");
    }
    activeStateId = null;
  };

  svg.append("g")
      .attr("fill", "#1f77b4")
      .attr("fill-opacity", 0.7)
      .attr("stroke", "#fff")
      .attr("stroke-width", 0.5)
    .selectAll()
    .data(points)
    .join("circle")
      .attr("cx", d => d.coords[0])
      .attr("cy", d => d.coords[1])
      .attr("r", d => radiusByType.get(d.type) ?? 2)
      .on("mouseenter", (event, d) => {
        const stateFeature = statesGeo.find((state) =>
          d3.geoContains(state, [d.lon, d.lat])
        );
        if (stateFeature && stateFeature.id !== activeStateId) {
          resetStateHighlight();
          activeStateId = stateFeature.id;
          statePathById.get(activeStateId)?.attr("fill", "#d62828");
        }

        tooltip
          .style("opacity", 1)
          .html(`<strong>${d.name}</strong><br/>
          IATA: ${d.iata || "—"} / ICAO: ${d.icao || "—"}<br/>
          ${d.city || "—"}, ${d.state || "—"}<br/>
          州別：${stateFeature?.properties?.name || "—"}`);
      })
      .on("mousemove", (event) => {
        tooltip
          .style("left", `${event.pageX + 12}px`)
          .style("top", `${event.pageY + 12}px`);
      })
      .on("mouseleave", () => {
        tooltip.style("opacity", 0);
        resetStateHighlight();
      });

  return svg.node();
}


function _3(md){return(
md`資料透過 OurAirports 的公開資料集載入，包含機場名稱、IATA、ICAO、城市、州與經緯度。`
)}

function _airports(d3){return(
d3.csv("https://raw.githubusercontent.com/davidmegginson/ourairports-data/master/airports.csv", d => ({
  name: d.name,
  iata: d.iata_code,
  icao: d.ident,
  city: d.municipality,
  state: d.iso_region?.replace("US-", ""),
  lat: d.latitude_deg ? +d.latitude_deg : null,
  lon: d.longitude_deg ? +d.longitude_deg : null,
  type: d.type,
  country: d.iso_country
}))
  .then((rows) =>
    rows.filter(d =>
      d.country === "US" &&
      d.type === "large_airport" &&
      d.iata &&
      /international/i.test(d.name) &&
      Number.isFinite(d.lat) &&
      Number.isFinite(d.lon)
    )
  )
)}

function _5(md){return(
md`地圖幾何資料來自 [TopoJSON U.S. Atlas](https://github.com/topojson/us-atlas)。`
)}

function _us(d3){return(
d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json")
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("chart")).define("chart", ["airports","d3","topojson","us"], _chart);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer("airports")).define("airports", ["d3"], _airports);
  main.variable(observer()).define(["md"], _5);
  main.variable(observer("us")).define("us", ["d3"], _us);
  return main;
}
