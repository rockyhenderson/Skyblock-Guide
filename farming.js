document.addEventListener("DOMContentLoaded", function () {
  // Read the data from localStorage
  const cachedSkyblockData = localStorage.getItem("skyblockData");
  if (cachedSkyblockData) {
    const skyblockData = JSON.parse(cachedSkyblockData);
    console.log(skyblockData); // Output: defaultProfile
  } else {
    console.log("No skyblock data found in local storage.");
  }

  let x = 0.5;
  var bar = new ProgressBar.Line("#progress-bar", {
    strokeWidth: 4,
    easing: "easeInOut",
    duration: 1400,
    color: "#FFEA82",
    trailColor: "#eee",
    trailWidth: 1,
    svgStyle: { width: "100%", height: "100%" },
    step: function (state, bar) {
      bar.path.setAttribute("stroke-linecap", "round"); // Round the edges of the bar
    },
  });

  bar.animate(x); // Number from 0.0 to 1.0
});
