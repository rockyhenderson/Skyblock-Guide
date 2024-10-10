const dotenv = require("dotenv");
const Hypixel = require("hypixel-api-reborn");
console.log("IM RUNNING");
dotenv.config();

exports.handler = async function (event, context) {
  console.log("Handler started!");

  const username = event.queryStringParameters.username;
  console.log("Username provided:", username);

  // Step 1: Validate the username
  if (!username) {
    console.log("No username provided");
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Username is required" }),
    };
  }

  // Step 2: Fetch the Hypixel API key from the environment variable
  const apiKey = process.env.HYPIXEL_API_KEY;
  console.log("API key fetched:", apiKey ? "Yes" : "No API key");

  if (!apiKey) {
    console.log("API key is missing");
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "API key is missing" }),
    };
  }

  try {
    const hypixel = new Hypixel.Client(apiKey);
    console.log("Hypixel Client initialized");

    // Step 3: Fetch player data
    const player = await hypixel.getPlayer(username);
    console.log("Player data fetched:", player ? "Yes" : "No player data");

    const profiles = await hypixel.getSkyblockProfiles(username);

    // Step 4: Loop through profiles and get relevant data, including skills and wardrobe
    const profileData = [];
    let skillApiDisabled = false;

    for (const profile of profiles) {
      let wardrobeItems = null;
      let equippedArmor = null;

      // Fetch the wardrobe data
      try {
        wardrobeItems = await profile.me.getWardrobe();
        console.log(`Wardrobe data fetched for profile ${profile.profileName}`);
      } catch (err) {
        console.log(`Failed to fetch wardrobe data for profile ${profile.profileName}`);
      }

      // Fetch the equipped armor data
      try {
        equippedArmor = await profile.me.getArmor();
        console.log(`Equipped armor data fetched for profile ${profile.profileName}`);
      } catch (err) {
        console.log(`Failed to fetch equipped armor data for profile ${profile.profileName}`);
      }

      // Try to fetch the skills, if they are not available, set the flag
      let farmingSkill, combatSkill, fishingSkill, miningSkill, foragingSkill, enchantingSkill, alchemySkill, carpentrySkill, runecraftingSkill, tamingSkill, socialSkill;

      try {
        farmingSkill = profile.me.skills.farming;
        combatSkill = profile.me.skills.combat;
        fishingSkill = profile.me.skills.fishing;
        miningSkill = profile.me.skills.mining;
        foragingSkill = profile.me.skills.foraging;
        enchantingSkill = profile.me.skills.enchanting;
        alchemySkill = profile.me.skills.alchemy;
        carpentrySkill = profile.me.skills.carpentry;
        runecraftingSkill = profile.me.skills.runecrafting;
        tamingSkill = profile.me.skills.taming;
        socialSkill = profile.me.skills.social;
      } catch (err) {
        console.log("Skill API may be disabled for profile", profile.profileName);
        skillApiDisabled = true;
      }

      // Prepare the profile data
      profileData.push({
        profileId: profile.profileId,
        profileName: profile.profileName,
        selected: profile.selected,

        farmingSkillLevel: farmingSkill ? farmingSkill.level : null,
        farmingXP: farmingSkill ? farmingSkill.xp : null,

        combatSkillLevel: combatSkill ? combatSkill.level : null,
        combatXP: combatSkill ? combatSkill.xp : null,

        fishingSkillLevel: fishingSkill ? fishingSkill.level : null,
        fishingXP: fishingSkill ? fishingSkill.xp : null,

        miningSkillLevel: miningSkill ? miningSkill.level : null,
        miningXP: miningSkill ? miningSkill.xp : null,

        foragingSkillLevel: foragingSkill ? foragingSkill.level : null,
        foragingXP: foragingSkill ? foragingSkill.xp : null,

        enchantingSkillLevel: enchantingSkill ? enchantingSkill.level : null,
        enchantingXP: enchantingSkill ? enchantingSkill.xp : null,

        alchemySkillLevel: alchemySkill ? alchemySkill.level : null,
        alchemyXP: alchemySkill ? alchemySkill.xp : null,

        carpentrySkillLevel: carpentrySkill ? carpentrySkill.level : null,
        carpentryXP: carpentrySkill ? carpentrySkill.xp : null,

        runecraftingSkillLevel: runecraftingSkill ? runecraftingSkill.level : null,
        runecraftingXP: runecraftingSkill ? runecraftingSkill.xp : null,

        tamingSkillLevel: tamingSkill ? tamingSkill.level : null,
        tamingXP: tamingSkill ? tamingSkill.xp : null,

        socialSkillLevel: socialSkill ? socialSkill.level : null,
        socialXP: socialSkill ? socialSkill.xp : null,

        // Include the wardrobe and equipped armor data
        wardrobeItems: wardrobeItems,
        equippedArmor: equippedArmor,
      });
    }

    // Step 5: Return player level, uuid, and profile data with skills and wardrobe to frontend
    return {
      statusCode: 200,
      body: JSON.stringify({
        playerLevel: player.level,
        playerUUID: player.uuid,
        profiles: profileData,
        skillApiDisabled: skillApiDisabled, // Flag indicating if the skill API is disabled
      }),
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
