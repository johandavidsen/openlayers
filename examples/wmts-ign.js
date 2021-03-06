import Map from '../src/ol/Map.js';
import View from '../src/ol/View.js';
import {defaults as defaultControls} from '../src/ol/control.js';
import {getWidth} from '../src/ol/extent.js';
import TileLayer from '../src/ol/layer/Tile.js';
import {fromLonLat, get as getProjection} from '../src/ol/proj.js';
import WMTS from '../src/ol/source/WMTS.js';
import WMTSTileGrid from '../src/ol/tilegrid/WMTS.js';


const map = new Map({
  target: 'map',
  controls: defaultControls({
    attributionOptions: {
      collapsible: false
    }
  }),
  view: new View({
    zoom: 5,
    center: fromLonLat([5, 45])
  })
});

const resolutions = [];
const matrixIds = [];
const proj3857 = getProjection('EPSG:3857');
const maxResolution = getWidth(proj3857.getExtent()) / 256;

for (let i = 0; i < 18; i++) {
  matrixIds[i] = i.toString();
  resolutions[i] = maxResolution / Math.pow(2, i);
}

const tileGrid = new WMTSTileGrid({
  origin: [-20037508, 20037508],
  resolutions: resolutions,
  matrixIds: matrixIds
});

// API key valid for 'openlayers.org' and 'localhost'.
// Expiration date is 06/29/2018.
const key = '2mqbg0z6cx7ube8gsou10nrt';

const ign_source = new WMTS({
  url: 'https://wxs.ign.fr/' + key + '/wmts',
  layer: 'GEOGRAPHICALGRIDSYSTEMS.MAPS',
  matrixSet: 'PM',
  format: 'image/jpeg',
  projection: 'EPSG:3857',
  tileGrid: tileGrid,
  style: 'normal',
  attributions: '<a href="http://www.geoportail.fr/" target="_blank">' +
        '<img src="https://api.ign.fr/geoportail/api/js/latest/' +
        'theme/geoportal/img/logo_gp.gif"></a>'
});

const ign = new TileLayer({
  source: ign_source
});

map.addLayer(ign);
