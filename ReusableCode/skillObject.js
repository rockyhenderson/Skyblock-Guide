function skill(skill){
    this.skill = skill;
    this.experience = findAndLogExp();
    this.skillCap = skillCap();
    this.skillLevel = calculateSkillLevel();
}

function getSkill(){ return this.skill; }
function getExperience(){ return this.experience; }
function getSkillCap(){ return this.skillCap; }
function getSkillLevel(){ return this.skillLevel; }

function setSkill(skill){ 
    if((skill === "Mining" || skill === "Farming" || skill === "Foraging" || skill === "Combat" || skill === "Fishing" || skill === "Enchanting" || skill === "Alchemy" || skill === "Taming" || skill === "Dungeons" || skill === "Carpentery" || skill === "Runecrafting" || skill === "Social") === false){
		throw new Error("Invalid Skill Entered")
	}
    this.skill = skill; 
    setExperience(); 
    setSkillCap(); 
    setSkillLevel(); 

}
function setExperience(){ this.experience = findAndLogExp(); }
function setSkillCap(){ this.skillCap = skillCap(); }
function setSkillLevel(){ this.skillLevel = calculateSkillLevel(); }

function calculateSkillLevel(){
    const thresholds = [
        0, 50, 175, 375, 675, 1175, 1925, 2925, 4425, 6425, 9925, 14925, 22425,
        32425, 47425, 67425, 97425, 147425, 222425, 322425, 522425, 822425, 1222425,
        1722425, 2322425, 3022425, 3822425, 4722425, 5722425, 6822425, 8022425,
        9322425, 10722425, 12222425, 13822425, 15522425, 17322425, 19222425,
        21222425, 23322425, 25522425, 27822425, 30222425, 32722425, 35322425,
        38072425, 40972425, 44072425, 47472425, 51172425, 55172425, 59472425,
        64072425, 68972425, 74172425, 79672425, 85472425, 91572425, 97972425,
        104672425, 111672425,
      ];

        let level = 0;

        for (let i = 0; i < thresholds.length; i++) {
            if (this.experience >= thresholds[i]) {
            level = i;
            } else {
          // Calculate fractional progress between this and previous threshold
            const previousThreshold = thresholds[i - 1];
            const nextThreshold = thresholds[i];
            const progress =
                (this.experience - previousThreshold) / (nextThreshold - previousThreshold);
            level = i - 1 + progress;
            break;
            }
        }

    if(level > this.skillCap){
        return this.skillCap;
    }else{
        return level;
    }
}

function skillCap(){
    switch(this.skill){
        case "Mining": case "Enchanting": case "Combat": case "Taming":
            return 60;
        case "Social": case "Runecrafting":
            return 25;
        case "Farming":
            return 50+goldMedalCount();
        default:
            return 50;
    }
}

function findAndLogExp(){
    const cachedSkyblockData = localStorage.getItem("skyblockData");
    const uuid = localStorage.getItem("uuid");

    console.log("uuid:", uuid);
    console.log("Cached skyblock data:", cachedSkyblockData);

    if (!cachedSkyblockData || !uuid) {
        console.log("No skyblock data or uuid found. Default to 0");
        return 0;
    }

    const skyblockData = JSON.parse(cachedSkyblockData);
    const selectedProfileName = localStorage.getItem("selectedProfile");

    console.log("Selected Profile Name:", selectedProfileName);

  // Find the correct profile based on cute_name
    const profile = skyblockData.profiles.find(
        (p) => p.cute_name === selectedProfileName
    );
    if (!profile) {
        console.log("Profile not found.");
        return null;
    }

    console.log("Found profile:", profile);

  // Find the correct player data using the uuid
    const memberData = profile.members[uuid];
    if (!memberData) {
        console.log("Player data not found in profile.");
        return null;
    }

    console.log("Found member data:", memberData);

  // Get the skill experience
  /*Needs to be changed to be dynamic based on skill */
    const skillExp = memberData[`experience_skill_${this.skill}`] || 0;
    console.log("Farming Experience:", farmingExperience);

    return skillExp;
}

// Function to initialize the appropriate progress bar based on screen size
function initializeProgressBar() { 
    let progressValue = 0;
    // Calculate the progress based on the skill level;
    if (this.level > this.skillCap) {
      progressValue = 1.0; // Full progress if level is capped
    }else{
        progressValue = this.level/this.skillCap;
    }
  
    // Destroy any existing progress bar
    if (bar) {
      bar.destroy();
    }
  
    const container = document.getElementById("progress-bar");
    const circularContainer = document.getElementById("circular-progress-bar");
  
    // Check if the screen is mobile (less than 768px width)
    if (window.matchMedia("(max-width: 768px)").matches) {
      // Hide linear progress bar
      container.style.display = "none";
      circularContainer.style.display = "block"; // Show circular progress bar
  
      // Create a circular progress bar for mobile screens
      bar = new ProgressBar.Circle(circularContainer, {
        strokeWidth: 6,
        easing: "easeInOut",
        duration: 1400,
        color: "#FFEA82",
        trailColor: "#eee",
        trailWidth: 1,
        svgStyle: null,
      });
    } else {
      // Hide circular progress bar
      circularContainer.style.display = "none";
      container.style.display = "block"; // Show linear progress bar
  
      // Create a linear progress bar for larger screens
      bar = new ProgressBar.Line(container, {
        strokeWidth: 4,
        easing: "easeInOut",
        duration: 1400,
        color: "#FFEA82",
        trailColor: "#eee",
        trailWidth: 1,
        svgStyle: { width: "100%", height: "100%" },
        step: function (state, bar) {
          bar.path.setAttribute("stroke-linecap", "round");
        },
      });
    }
  
    // Animate the progress bar with the adjusted progress value
    bar.animate(progressValue);
  }  
  
  // Function to handle the skill level update when profile changes
  let bar = null; // Declare the progress bar variable outside so it can be reused
