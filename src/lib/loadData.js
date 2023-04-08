import characterData from "../data/characters.json" assert {type: "json"};
import seriesData from "../data/series.json" assert {type: "json"};

characterData.data = characterData.data.map(x => {
    return { name: x.name.toLowerCase().replace(/\s/g, '').replace("'", "").replace("’", ""), series: x.series.toLowerCase().replace(/\s/g, '').replace("'", "").replace("’", ""), wl: x.wl };
});

seriesData.data = seriesData.data.map(x => {
    return { series: x.series.toLowerCase().replace(/\s/g, ''), wl: x.wl };
});

export { characterData, seriesData };