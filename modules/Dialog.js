require("../node_modules/leaflet/dist/leaflet");
require("../node_modules/leaflet/dist/leaflet.css");
const marker = require("../node_modules/leaflet/dist/images/marker-icon.png");
const shadow = require("../node_modules/leaflet/dist/images/marker-shadow.png");

class Dialog {
  constructor(coord0, coord1) {
    this.coord0 = coord0;
    this.coord1 = coord1;
    this.map = null;
  }

  show() {
    this.map = new L.Map("leaflet", {
      center: [this.coord0, this.coord1],
      zoom: 18,
      layers: [
        new L.TileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"),
      ],
    });
    const icon = L.icon({
      iconUrl: marker,
      shadowUrl: shadow,
    });
    L.Marker.prototype.options.icon = icon;
    L.marker([this.coord0, this.coord1]).addTo(this.map);
  }

  hidden() {
    this.map.remove();
  }
}

module.exports = Dialog;
