<template>
  <div class="map" ref="mapDivRef"></div>
</template>

<script>
import {ref, onMounted} from "vue";

export default {
  name: "GMap",
  props: {
    center: {lat: Number, lng: Number},
    zoom: Number,
    mapType: String,
    disableUI: Boolean,
    officeLocation: Object,
  },
  setup(props, {emit}) {
    const map = ref(null);
    const mapDivRef = ref(null);

    onMounted(() => {
      const key = process.env.VUE_APP_GOOGLE_MAPS_KEY;

      const googleMapScript = document.createElement("SCRIPT");
      googleMapScript.setAttribute(
          "src",
          `https://maps.googleapis.com/maps/api/js?key=${key}&callback=initMap`
      );
      googleMapScript.setAttribute("defer", "");
      googleMapScript.setAttribute("async", "");
      document.head.appendChild(googleMapScript);
    });

    const initMap = () => {
      map.value = new window.google.maps.Map(mapDivRef.value, {
        mapTypeId: props.mapType || "hybrid",
        zoom: props.zoom || 8,
        disableDefaultUI: props.disableUI || false,
        center: props.center || {lat: 0, lng: 0},
      });

      map.value.addListener("click", (mapsMouseEvent) => {
        const clickedLocation = mapsMouseEvent.latLng.toJSON();
        const officeLocation = props.officeLocation;

        const service = new window.google.maps.DistanceMatrixService();
        service.getDistanceMatrix(
            {
              origins: [new window.google.maps.LatLng(clickedLocation.lat, clickedLocation.lng)],
              destinations: [new window.google.maps.LatLng(officeLocation.lat, officeLocation.lng)],
              travelMode: "DRIVING",
            },
            (response, status) => {
              if (status === "OK" && response.rows[0].elements[0].status === "OK") {
                const distance = response.rows[0].elements[0].distance.text;
                emit("mapClick", {location: clickedLocation, distance: distance});
              } else {
                console.error("Error calculating distance:", status);
              }
            }
        );
      });
    };

    window.initMap = initMap;

    return {
      mapDivRef,
    };
  },
};
</script>

<style lang="css" scoped>
.map {
  width: 100%;
  height: 500px;
  background-color: azure;
}
</style>
