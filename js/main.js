let restaurantData = [];
let currentRestaurant = {};
let page = 1;
const perPage = 10;
let map = null;

const avg = (grades) => {
  let avg = 0;
  _.forEach(grades, function (grade) {
    avg += grade.score;
  });
  return (avg / grades.length).toFixed(2);
};

const tableRows = _.template(`
    <% _.forEach(restaurants, function(restaurant) { %>
        <tr data-id=<%- restaurant._id %>>
            <td><%- restaurant.name %></td>
            <td><%- restaurant.cuisine %></td>
            <td><%- restaurant.address.building%> <%- restaurant.address.street %></td>
            <td><%- avg(restaurant.grades) %></td>
        </tr>
    <% }); %>
  `);

const loadRestaurantData = () => {
  fetch(
    `https://afternoon-peak-82019.herokuapp.com/api/restaurants?page=${page}&perPage=${perPage}`,
    { method: "GET" }
  )
    .then((res) => {
      if (!res.ok) {
        throw new Error("Did not receive valid data from server");
      }
      return res.json();
    })
    .then((data) => {
      restaurantData = data;
      const rows = tableRows({ restaurants: restaurantData });
      $("#restaurant-table tbody").html(rows);
      $("#current-page").html(page);
    })
    .catch((err) => {
      console.warn("Error fetching data from server");
    });
};

$(function () {
  loadRestaurantData();

  // event handler on each row in the table
  $("#restaurant-table tbody").on("click", "tr", function () {
    const index = _.findIndex(restaurantData, (restaurant) => {
      return restaurant._id === $(this).attr("data-id");
    });
    currentRestaurant = restaurantData[index];
    $(".modal-title").html(currentRestaurant.name);
    $("#restaurant-address").html(
      currentRestaurant.address.building +
        " " +
        currentRestaurant.address.street
    );
    $("#restaurant-modal").modal({
      backdrop: "static",
      keyboard: false,
    });
  });

  // event handler on the previous page button
  $("#previous-page").on("click", function () {
    if (page === 1) {
      return;
    } else {
      page -= 1;
      loadRestaurantData();
    }
  });

  // event handler on the next page button
  $("#next-page").on("click", function () {
    page += 1;
    loadRestaurantData();
  });

  // shown bs modal for modal window
  $("#restaurant-modal").on("shown.bs.modal", function () {
    map = new L.Map("leaflet", {
      center: [
        currentRestaurant.address.coord[1],
        currentRestaurant.address.coord[0],
      ],
      zoom: 18,
      layers: [
        new L.TileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"),
      ],
    });
    L.marker([
      currentRestaurant.address.coord[1],
      currentRestaurant.address.coord[0],
    ]).addTo(map);
  });

  // hidden bs modal for modal window
  $("#restaurant-modal").on("hidden.bs.modal", function () {
    map.remove();
  });
});
