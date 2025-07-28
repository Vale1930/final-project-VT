let spotifyData = [];
let selected = null;
let chart3Type = "line";

const artistImages = {
    "Drake": "https://cdn.britannica.com/37/231937-050-9228ECA1/Drake-rapper-2019.jpg",
    "Taylor Swift": "https://m.media-amazon.com/images/M/MV5BYWYwYzYzMjUtNWE0MS00NmJlLTljNGMtNzliYjg5NzQ1OWY5XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    "Bad Bunny": "https://ntvb.tmsimg.com/assets/assets/1039037_v9_bf.jpg",
    "Karol G": "https://media1.popsugar-assets.com/files/thumbor/Y_ORI47Amv3bsrCQjoo7EY5HiTc=/fit-in/3592x4840/filters:format_auto():extract_cover():upscale()/2023/07/17/948/n/49003296/8c13a64864b5b665154c16.02872620_GettyImages-.jpg",
    "The Weeknd": "https://m.media-amazon.com/images/M/MV5BMzU4NzVjNWItZWU1Mi00ODM5LThjMGMtNTE5MzJjMGExYjg3XkEyXkFqcGc@._V1_.jpg",
    "Billie Eilish": "https://revistamundodiners.com/wp-content/uploads/2023/12/word-image-23-854x1024.jpg",
    "Travis Scott": "https://www.hola.com/horizon/original_aspect_ratio/504b3d8e889d-travis-scott-inicios-musica1.jpg",
    "Ariana Grande": "https://cdn.britannica.com/92/211792-050-E764F875/American-singer-Ariana-Grande-2018.jpg",
    "Future": "https://www.billboard.com/wp-content/uploads/2022/11/cover-future-billboard-2022-bb15-david-needleman-01-1240.jpg?w=200",
    "Peso Pluma": "https://media.vogue.mx/photos/679fe0ca95841def067c3a1b/2:3/w_2560%2Cc_limit/peso-pluma-con-traje-negro-eh-los-grammys-2025.jpg"
};


const albumImages = {
    "Un Verano Sin Ti": "https://cdn-images.dzcdn.net/images/cover/b29d1070377b784384c2456093f96a66/0x1900-000000-80-0-0.jpg",
    "The Tortured Poets Department": "https://www.slugmag.com/wp/wp-content/uploads/2024/05/The-Anthology_Cover.webp",
    "For All The Dogs": "https://substackcdn.com/image/fetch/$s_!h1wD!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F8acd1188-ea90-4ce4-a0b6-f5367e8d4f67_3000x2160.jpeg",
    "Nadie sabe lo que va a pasar mañana": "https://www.miamihispano.com/wp-content/uploads/2023/10/Bad-Bunny-estreno-su-nuevo-album-Nadie-Sabe-Lo-Que-Va-A-Pasar-Manana.jpg",
    "Utopia": "https://highxtar.com/wp-content/uploads/2023/08/Thumb_UTOPIA_2023_Web_Nueva-1-1440x1080.jpg",
    "Full Circle: The Live Anthology": "https://i.scdn.co/image/ab67616d0000b2732833ffde5c801c239b228452",
    "We Don'T Trust You": "https://cdn-images.dzcdn.net/images/cover/2d20cf6d65607e406213afbb3b62ce0d/0x1900-000000-80-0-0.jpg",
    "Her Loss": "https://m.media-amazon.com/images/I/818t7kCCXKL._UF1000,1000_QL80_.jpg",
    "Hit Me Hard And Soft": "https://media.glamour.mx/photos/66146addbb25fa27aa0df85c/4:3/w_3000,h_2250,c_limit/hit-me-hard-and-soft-bllie-eilish.jpg",
    "Papercuts": "https://www.deejay.de/images/xl/3/5//1046635b.jpg",

};

document.getElementById('toggle-theme').onclick = () => {
    document.body.classList.toggle('light-mode');
    document.getElementById('toggle-theme').innerText =
        document.body.classList.contains('light-mode') ? '☀️' : '🌙';
};

function showSection(sectionId) {
    document.getElementById('dashboard-section').style.display = "none";
    document.getElementById('topsongs-section').style.display = "none";
    document.getElementById('topartists-section').style.display = "none";
    document.getElementById('trends-section').style.display = "none";
    document.getElementById('treemap-section').style.display = "none";
    document.getElementById(sectionId).style.display = "grid";
    clearSelected();

    // Renderiza la gráfica SOLO si entramos a su sección
    if (sectionId === 'topartists-section') renderChart1(spotifyData, "#chart1-solo", null);
    if (sectionId === 'topsongs-section') renderChart2(spotifyData, "#chart2-solo", null);
    if (sectionId === 'trends-section') renderTrendsChart();
    if (sectionId === 'treemap-section') renderExplicitTreemap(spotifyData, "#treemap-explicit", "#treemap-title");
}


function activateMenu(navId) {
    ['nav-dashboard', 'nav-topsongs', 'nav-topartists', 'nav-trends', 'nav-treemap'].forEach(id => {
        document.getElementById(id).classList.remove('active');
    });
    document.getElementById(navId).classList.add('active');
}

['nav-dashboard', 'nav-topsongs', 'nav-topartists', 'nav-trends', 'nav-treemap'].forEach(id => {
    document.getElementById(id).onclick = () => {
        showSection(id.replace('nav-', '') + '-section');
        activateMenu(id);
    }
});

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.card-link').forEach(card => {
        card.addEventListener('click', function () {
            const target = this.getAttribute('data-target');
            showSection(target);
            if (target === 'topartists-section') activateMenu('nav-topartists');
            if (target === 'topsongs-section') activateMenu('nav-topsongs');
            if (target === 'trends-section') activateMenu('nav-trends');
            if (target === 'treemap-section') activateMenu('nav-treemap');
            if (target === 'dashboard-section') activateMenu('nav-dashboard');
        });
    });
});


const tooltip = document.getElementById('tooltip');
function showTooltip(html, x, y) {
    tooltip.innerHTML = html;
    tooltip.style.display = "block";
    tooltip.style.left = `${x + 16}px`;
    tooltip.style.top = `${y + 18}px`;
}
function hideTooltip() { tooltip.style.display = "none"; }
function clearSelected() {
    document.getElementById("selected-info").innerHTML = "";
    selected = null;
}

function renderChart1(data, selector = "#chart1", titleSelector = "#title1") {
    d3.select(selector).selectAll("*").remove();
    if (!data || data.length === 0) return;
    if (titleSelector && document.querySelector(titleSelector))
        document.querySelector(titleSelector).textContent = "Top 10 Artistas por Spotify Streams";

    const streamsByArtist = d3.rollups(
        data,
        v => d3.sum(v, d => +d['Spotify Streams'] || 0),
        d => d['Artist']
    );
    const top10 = streamsByArtist
        .sort((a, b) => d3.descending(a[1], b[1]))
        .slice(0, 10)
        .map(([artist, totalStreams]) => ({ artist, totalStreams }));

    const margin = { top: 20, right: 18, bottom: 35, left: 110 },
        width = 800 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    const svg = d3.select(selector).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const y = d3.scaleBand()
        .domain(top10.map(d => d.artist))
        .range([0, height])
        .padding(0.2);

    const x = d3.scaleLinear()
        .domain([0, d3.max(top10, d => d.totalStreams) * 1.08])
        .range([0, width]);

    svg.append("g")
        .call(d3.axisLeft(y))
        .attr("font-size", "13px")
        .attr("color", "#b3b3b3");

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).ticks(5).tickFormat(d3.format(".2s")))
        .attr("font-size", "12px")
        .attr("color", "#b3b3b3");

    svg.selectAll(".bar")
        .data(top10)
        .enter()
        .append("rect")
        .attr("x", 0)
        .attr("y", d => y(d.artist))
        .attr("width", 0)
        .attr("height", y.bandwidth())
        .attr("rx", 7)
        .attr("fill", "#1db954")
        .style("cursor", "pointer")
        .transition()
        .duration(900)
        .delay((d, i) => i * 80)
        .attr("width", d => x(d.totalStreams));

    svg.selectAll("rect")
        .data(top10)
        .on("mousemove", function (event, d) {
            showTooltip(`<b>${d.artist}</b><br>Streams: ${d3.format(",")(d.totalStreams)}`, event.pageX, event.pageY);
            d3.select(this).attr("fill", "#159d43");
        })
        .on("mouseleave", function () {
            hideTooltip();
            d3.select(this).attr("fill", "#1db954");
        })

        .on("click", function (event, d) {
            selected = d;
            const artistImg = artistImages[d.artist] || "";
            document.getElementById("selected-info").innerHTML = `
        <div class="selected-card" style="background:#111; border-radius:22px; max-width:370px; margin-left:auto; margin-top:20px; box-shadow: 0 6px 28px #000c;">
            <div style="display:flex; flex-direction:column; align-items:center; padding:20px 20px 14px 20px;">
                ${artistImg ? `<img src="${artistImg}" alt="${d.artist}" style="width:95%;max-width:250px;border-radius:22px;box-shadow:0 3px 22px #0007;margin-bottom:18px;">` : ""}
                <div style="font-size:1.55rem; font-weight:700; color:#fff; margin-bottom:7px;">${d.artist}</div>
                <div style="font-size:1.2rem; color:#f1c40f; font-weight:600;">
                    Streams: ${d3.format(",")(d.totalStreams)}
                </div>
            </div>
        </div>
    `;
        });

}

function renderChart2(data, selector = "#chart2", titleSelector = "#title2") {
    d3.select(selector).selectAll("*").remove();
    if (!data || data.length === 0) return;
    if (titleSelector && document.querySelector(titleSelector))
        document.querySelector(titleSelector).textContent = "Top 10 álbumes más escuchados hasta 2024";

    const albumsGrouped = d3.rollups(
        data,
        v => ({
            totalStreams: d3.sum(v, d => +d['Spotify Streams'] || 0)
        }),
        d => d['Album Name']
    ).map(([albumName, sums]) => ({
        album: albumName,
        "Spotify Streams": sums.totalStreams,
        total: sums.totalStreams
    }));

    const topAlbums = albumsGrouped
        .sort((a, b) => d3.descending(a.total, b.total))
        .slice(0, 10);

    const platforms = [
        "Spotify Streams"
    ];

    const colors = {
        "Spotify Streams": "#1db954"
    };

    const margin = { top: 36, right: 20, bottom: 60, left: 54 },
        width = 900 - margin.left - margin.right,
        height = 480 - margin.top - margin.bottom;

    const svg = d3.select(selector).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const x0 = d3.scaleBand()
        .domain(topAlbums.map(d => d.album))
        .range([0, width])
        .paddingInner(0.18);

    const x1 = d3.scaleBand()
        .domain(platforms)
        .range([0, x0.bandwidth()])
        .padding(0.13);

    const y = d3.scaleLinear()
        .domain([0, d3.max(topAlbums, d => d3.max(platforms, p => d[p])) * 1.10])
        .nice()
        .range([height, 0]);

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(
            d3.axisBottom(x0)
                .tickFormat(d => d.length > 14 ? d.slice(0, 14) + "…" : d)
        )
        .attr("font-size", "14px")
        .selectAll("text")
        .attr("transform", "rotate(-15)")
        .style("text-anchor", "end");

    svg.append("g")
        .call(d3.axisLeft(y).ticks(10).tickFormat(d3.format(".2s")))
        .attr("font-size", "13px");

    svg.selectAll("g.album-group")
        .data(topAlbums)
        .enter()
        .append("g")
        .attr("class", "album-group")
        .attr("transform", d => `translate(${x0(d.album)},0)`)
        .selectAll("rect")
        .data(d => platforms.map(p => ({ key: p, value: d[p], album: d.album })))
        .enter()
        .append("rect")
        .attr("x", d => x1(d.key))
        .attr("y", y(0))
        .attr("width", x1.bandwidth())
        .attr("height", 0)
        .attr("fill", d => colors[d.key])
        .style("cursor", "pointer")
        .on("mousemove", function (event, d) {
            showTooltip(
                `<b>${d.album}</b><br><span style="color:${colors[d.key]}">${d.key}</span>: ${d3.format(",")(d.value)}`,
                event.pageX, event.pageY
            );
            d3.select(this).attr("fill", "#1db954");
        })
        .on("mouseleave", function (event, d) {
            hideTooltip();
            d3.select(this).attr("fill", colors[d.key]);
        })
        .on("click", function (event, d) {
            selected = d;
            const albumTop = albumImages[d.album] || "";
            document.getElementById("album-info").innerHTML = `
        ${albumTop ? `<img src="${albumTop}" alt="${d.album}" style="width:95%;max-width:250px;border-radius:22px;box-shadow:0 3px 22px #0007;margin-bottom:18px;">` : ""}
        <div style="font-size:1.55rem; font-weight:700; color:#fff; margin-bottom:7px; text-align:center;">${d.album}</div>
        <div style="font-size:1.2rem; color:#f1c40f; font-weight:600; text-align:center;">
            Streams: ${d3.format(",")(d.value || d["Spotify Streams"] || d.total || 0)}
        </div>
    `;
        })

        .transition()
        .duration(900)
        .delay((_, i) => i * 60)
        .attr("y", d => y(d.value))
        .attr("height", d => height - y(d.value));

    const legend = svg.append("g")
        .attr("transform", `translate(12, -26)`);
    platforms.forEach((p, i) => {
        legend.append("rect")
            .attr("x", i * 200)
            .attr("width", 20)
            .attr("height", 20)
            .attr("fill", colors[p]);
        legend.append("text")
            .attr("x", i * 200 + 28)
            .attr("y", 15)
            .text(p)
            .attr("fill", "#ededed")
            .attr("font-size", 16)
            .style("font-weight", "bold");
    });

    svg.append("line")
        .attr("x1", 0)
        .attr("x2", width)
        .attr("y1", y(0))
        .attr("y2", y(0))
        .attr("stroke", "#555")
        .attr("stroke-width", 1);
}

function renderChart3(data, selector = "#chart3", titleSelector = "#title3", explain = false) {
    d3.select(selector).selectAll("*").remove();
    if (!data || data.length === 0) return;
    if (titleSelector && document.querySelector(titleSelector))
        document.querySelector(titleSelector).textContent = "Evolución de Streams por Año de Lanzamiento (Línea)";

    const byYear = d3.rollups(
        data.filter(d => d['Release Date']),
        v => d3.sum(v, d => +d['Spotify Streams'] || 0),
        d => {
            let year = new Date(d['Release Date']).getFullYear();
            if (!isFinite(year) || year < 2008) return null;
            return year;
        }
    )
        .filter(([y, _]) => y && y >= 2008 && y <= 2024)
        .sort((a, b) => a[0] - b[0])
        .map(([year, streams]) => ({ year, streams }));

    if (byYear.length === 0) {
        d3.select(selector)
            .append("div")
            .attr("class", "nodata")
            .html("No hay datos suficientes para mostrar la gráfica.");
        return;
    }

    if (explain) {
        d3.select(selector)
            .append("div")
            .attr("class", "explanation")
            .style("margin-bottom", "10px")
            .style("color", "#1db954")
            .style("font-size", "1.05rem")
            .html(`<b>Why since 2008?</b> <br>
                <span style="color:#b3b3b3">
Spotify was launched in 2008 and revolutionized the music industry by offering unlimited streaming.  
This chart shows the evolution of the total number of streams per year based on the release year of songs on the platform, from its beginnings to the current year.
</span>
`);
    }

    const margin = { top: 30, right: 25, bottom: 35, left: 60 },
        width = 800 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    const svg = d3.select(selector).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear()
        .domain([2008, 2024])
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(byYear, d => d.streams) * 1.11])
        .range([height, 0]);

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat(d3.format("d")))
        .attr("font-size", "12px")
        .attr("color", "#b3b3b3");
    svg.append("g")
        .call(d3.axisLeft(y).ticks(7).tickFormat(d3.format(".2s")))
        .attr("font-size", "12px")
        .attr("color", "#b3b3b3");

    const line = d3.line()
        .x(d => x(d.year))
        .y(d => y(d.streams))
        .curve(d3.curveMonotoneX);

    let path = svg.append("path")
        .datum(byYear)
        .attr("fill", "none")
        .attr("stroke", "#1db954")
        .attr("stroke-width", 3)
        .attr("d", line);

    if (byYear.length > 0) {
        const totalLength = path.node().getTotalLength();
        path
            .attr("stroke-dasharray", totalLength + " " + totalLength)
            .attr("stroke-dashoffset", totalLength)
            .transition()
            .duration(1200)
            .attr("stroke-dashoffset", 0);
    }

    svg.selectAll("circle")
        .data(byYear)
        .enter()
        .append("circle")
        .attr("cx", d => x(d.year))
        .attr("cy", d => y(d.streams))
        .attr("r", 0)
        .attr("fill", d => d.year === 2008 ? "#fa233b" : "#f1c40f")
        .attr("stroke", "#191414")
        .attr("stroke-width", 1.4)
        .style("cursor", "pointer")
        .transition()
        .delay((d, i) => i * 60)
        .duration(300)
        .attr("r", 6);

    svg.selectAll("circle")
        .data(byYear)
        .on("mousemove", function (event, d) {
            showTooltip(
                `<b>Year:</b> ${d.year}<br><b>Streams:</b> ${d3.format(",")(d.streams)}` + (d.year === 2008 ? "<br><span style='color:#fa233b'>Spotify launch year!</span>" : ""),
                event.pageX, event.pageY
            );
            d3.select(this).attr("fill", "#fa233b");
        })
        .on("mouseleave", function (event, d) {
            hideTooltip();
            d3.select(this).attr("fill", d.year === 2008 ? "#fa233b" : "#f1c40f");
        })
        .on("click", function (event, d) {
            selected = d;
            document.getElementById("selected-info").innerHTML = `
                <div class="selected-card">
                    <b>Year:</b> ${d.year}<br>
                    <b>Total Streams:</b> ${d3.format(",")(d.streams)}
                    ${d.year === 2008 ? "<br><b style='color:#fa233b'>Spotify launch year!</b>" : ""}
                </div>
            `;
        });
}


function renderChart3Bar(data, selector = "#chart3", titleSelector = "#title3", explain = false) {
    d3.select(selector).selectAll("*").remove();
    if (!data || data.length === 0) return;
    if (titleSelector && document.querySelector(titleSelector))
        document.querySelector(titleSelector).textContent = "Evolución de Streams por Año de Lanzamiento (Barras)";

    const byYear = d3.rollups(
        data.filter(d => d['Release Date']),
        v => d3.sum(v, d => +d['Spotify Streams'] || 0),
        d => {
            let year = new Date(d['Release Date']).getFullYear();
            if (!isFinite(year) || year < 2008) return null;
            return year;
        }
    )
        .filter(([y, _]) => y && y >= 2008 && y <= 2024)
        .sort((a, b) => a[0] - b[0])
        .map(([year, streams]) => ({ year, streams }));

    if (byYear.length === 0) {
        d3.select(selector)
            .append("div")
            .attr("class", "nodata")
            .html("No hay datos suficientes para mostrar la gráfica.");
        return;
    }

    if (explain) {
        d3.select(selector)
            .append("div")
            .attr("class", "explanation")
            .style("margin-bottom", "10px")
            .style("color", "#1db954")
            .style("font-size", "1.05rem")
            .html(`<b>Why since 2008?</b> <br>
                <span style="color:#b3b3b3">
Spotify was launched in 2008 and revolutionized the music industry by offering unlimited streaming.  
This chart shows the evolution of the total number of streams per year based on the release year of songs on the platform, from its beginnings to the current year.
</span>
`);
    }

    const margin = { top: 30, right: 25, bottom: 35, left: 60 },
        width = 800 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    const svg = d3.select(selector).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
        .domain(byYear.map(d => d.year))
        .range([0, width])
        .padding(0.18);

    const y = d3.scaleLinear()
        .domain([0, d3.max(byYear, d => d.streams) * 1.11])
        .nice()
        .range([height, 0]);

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat(d3.format("d")))
        .attr("font-size", "12px")
        .attr("color", "#b3b3b3");

    svg.append("g")
        .call(d3.axisLeft(y).ticks(7).tickFormat(d3.format(".2s")))
        .attr("font-size", "12px")
        .attr("color", "#b3b3b3");

    svg.selectAll(".bar-year")
        .data(byYear)
        .enter()
        .append("rect")
        .attr("class", "bar-year")
        .attr("x", d => x(d.year))
        .attr("width", x.bandwidth())
        .attr("y", y(0))
        .attr("height", 0)
        .attr("fill", d => d.year === 2008 ? "#fa233b" : "#1db954")
        .style("cursor", "pointer")
        .on("mousemove", function (event, d) {
            showTooltip(
                `<b>Year:</b> ${d.year}<br><b>Streams:</b> ${d3.format(",")(d.streams)}` + (d.year === 2008 ? "<br><span style='color:#fa233b'>Spotify launch year!>" : ""),
                event.pageX, event.pageY
            );
            d3.select(this).attr("fill", "#fae14f");
        })
        .on("mouseleave", function (event, d) {
            hideTooltip();
            d3.select(this).attr("fill", d.year === 2008 ? "#fa233b" : "#1db954");
        })
        .on("click", function (event, d) {
            selected = d;
            document.getElementById("selected-info").innerHTML = `
                <div class="selected-card">
                    <b>Selected year:</b> ${d.year}<br>
                    <b>Total Streams:</b> ${d3.format(",")(d.streams)}
                    ${d.year === 2008 ? "<br><b style='color:#fa233b'>Spotify launch year!</b>" : ""}
                </div>
            `;
        })
        .transition()
        .duration(900)
        .delay((d, i) => i * 40)
        .attr("y", d => y(d.streams))
        .attr("height", d => height - y(d.streams));
}


function renderExplicitTreemap(data, selector = "#treemap-explicit") {

    d3.select(selector).selectAll("*").remove();

    const nestedTreemap = d3.rollups(
        data.filter(d => d.Year && !isNaN(+d.Year) && +d.Year >= 2009 && +d.Year <= 2024),
        v => d3.mean(v, d => +d["Explicit Track"]),
        d => d.Year
    ).map(([year, avg]) => ({ year, value: avg }));

    if (nestedTreemap.length === 0) {
        d3.select(selector)
            .append("div")
            .style("color", "red")
            .style("padding", "1em")
            .text("No hay datos para graficar.");
        return;
    }

    const widthTM = 900, heightTM = 540;
    const root = d3.hierarchy({ children: nestedTreemap }).sum(d => d.value);

    d3.treemap()
        .size([widthTM, heightTM])
        .padding(3)
        .round(true)(root);

    const svgTM = d3
        .select(selector)
        .append("svg")
        .attr("width", widthTM)
        .attr("height", heightTM);

    const colorTM = d3.scaleLinear().domain([0, 1]).range(["#102615", "#1db954"]);

    const node = svgTM.selectAll("g")
        .data(root.leaves())
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", d => `translate(${d.x0},${d.y0})`);

    node.append("rect")
        .attr("width", d => d.x1 - d.x0)
        .attr("height", d => d.y1 - d.y0)
        .attr("fill", d => colorTM(d.data.value))
        .on("mousemove", function (event, d) {
            showTooltip(
                `<b>Year:</b> ${d.data.year}<br>
        <b>Porcentage "Explicit":</b> ${d.data.value.toLocaleString(undefined, { style: "percent", maximumFractionDigits: 1 })}`,
                event.pageX, event.pageY
            );
            d3.select(this).attr("stroke", "#fff").attr("stroke-width", 4);
        })
        .on("mouseleave", function () {
            hideTooltip();
            d3.select(this).attr("stroke", "#232323").attr("stroke-width", 2.2);
        });

    node.append("text")
        .attr("x", 10)
        .attr("y", 24)
        .text(d => d.data.year)
        .attr("font-size", "1.13rem")
        .attr("fill", "#fff")
        .attr("font-weight", 700);

    node.append("text")
        .attr("x", 10)
        .attr("y", 44)
        .text(d => d.data.value !== null ? d.data.value.toLocaleString(undefined, { style: "percent", maximumFractionDigits: 1 }) : "0.0%")
        .attr("font-size", "1.02rem")
        .attr("fill", "#b3b3b3")
        .attr("font-weight", 400);
}


function loadAndRender() {
    d3.csv("spotify_songs.csv", d3.autoType).then(data => {
        spotifyData = data;
        showSection('dashboard-section');
        activateMenu('nav-dashboard');
    }).catch(err => {
        document.getElementById("dashboard-section").innerHTML = "<div style='color:red;padding:2em'>Error cargando el archivo CSV: " + err + "</div>";
    });
}


document.addEventListener('DOMContentLoaded', loadAndRender);

document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById("toggle-chart-type");
    if (btn) {
        btn.onclick = function () {
            chart3Type = chart3Type === "line" ? "bar" : "line";
            btn.textContent = chart3Type === "line" ? "Bar chart" : "Line chart";
            if (document.getElementById('trends-section').style.display !== "none") {
                renderTrendsChart();
            }
        };
    }
});

function renderTrendsChart() {
    if (chart3Type === "line") {
        renderChart3(spotifyData, "#chart3-solo", null, true);
    } else {
        renderChart3Bar(spotifyData, "#chart3-solo", null, true);
    }
}

