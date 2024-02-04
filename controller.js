const admin = require("./firebaseAdmin");
const generateUserData = require("./generateData");
const db = admin.firestore();

const getTeams = async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) {
      return res.status(400).json({ error: "User ID is missing." });
    }
    const snapshot = await db
      .collection("teams")
      .where("user_id", "==", user_id)
      .get();
    const teams = [];
    snapshot.forEach((doc) => {
      teams.push({ id: doc.id, ...doc.data() });
    });
    res.status(200).json(teams);
  } catch (error) {
    console.error("Error retrieving teams:", error);
    res.status(500).json({ error: "Error retrieving teams" });
  }
};

const getPlayers = async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) {
      return res.status(400).json({ error: "User ID is missing." });
    }
    const snapshot = await db
      .collection("players")
      .where("user_id", "==", user_id)
      .get();
    const players = [];
    snapshot.forEach((doc) => {
      players.push({ id: doc.id, ...doc.data() });
    });
    res
      .status(200)
      .json(players);
  } catch (error) {
    console.error("Error retrieving players:", error);
    res.status(500).json({ error: "Error retrieving players" });
  }
};

const createTeam = async (req, res) => {
  try {
    const { name, user_id } = req.body;
    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "Team name cannot be empty." });
    }
    if (!user_id) {
      return res.status(400).json({ error: "User ID is missing." });
    }
    const existingTeam = await db.collection("teams").where("name", "==", name).get();
    if (!existingTeam.empty) {
      return res.status(409).json({ error: "A team with the same name already exists" });
    }
    const teamRef = await db
      .collection("teams")
      .add({ name, players: [], user_id });
    const teamDoc = await teamRef.get();
    const team = teamDoc.data();
    team.id = teamDoc.id;

    res.status(201).json(team);
  } catch (error) {
    console.error("Error creating the team:", error);
    res.status(500).json({ error: "Error creating the team." });
  }
};

const createTeamFaker = async (name, user_id) => {
  try {
    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "Team name cannot be empty." });
    }
    if (!user_id) {
      return res.status(400).json({ error: "User ID is missing." });
    }
    const teamRef = await db
      .collection("teams")
      .add({ name, players: [], user_id });
    const teamDoc = await teamRef.get();
    const team = teamDoc.data();
    team.id = teamDoc.id;

    return team;
  } catch (error) {
    console.error("Error creating the faker team:", error);
    return null;
  }
};

const updateTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "Team name cannot be empty." });
    }
    if (!id) {
      return res.status(400).json({ error: "ID is missing." });
    }
    const teamDoc = await db.collection("teams").doc(id).get();
    if (!teamDoc.exists) {
      return res
        .status(404)
        .json({ error: "The specified team does not exist." });
    }
    await db.collection("teams").doc(id).update({ name });

    res
      .status(200)
      .json({ message: "The team has been successfully updated." });
  } catch (error) {
    console.error("Error updating the team:", error);
    res.status(500).json({ error: "Error updating the team." });
  }
};

const deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "ID is missing." });
    }
    const teamDoc = await db.collection("teams").doc(id).get();
    if (!teamDoc.exists) {
      return res
        .status(404)
        .json({ error: "The specified team does not exist." });
    }
    const playersSnapshot = await db
      .collection("players")
      .where("team_id", "==", id)
      .get();
    const updatePlayerPromises = playersSnapshot.docs.map(async (playerDoc) => {
      await db.collection("players").doc(playerDoc.id).update({ team_id: "" });
    });
    await Promise.all(updatePlayerPromises);
    await db.collection("teams").doc(id).delete();

    res.status(200).json(id);
  } catch (error) {
    console.error("Error deleting the team:", error);
    res.status(500).json({ error: "Error deleting the team." });
  }
};

const createPlayer = async (req, res) => {
  try {
    const { name, user_id } = req.body;
    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "Player name cannot be empty." });
    }
    if (!user_id) {
      return res.status(400).json({ error: "User ID is missing." });
    }
    const playerRef = await db
      .collection("players")
      .add({ name, team_id: "", user_id });
    const playerDoc = await playerRef.get();
    const player = playerDoc.data();
    player.id = playerDoc.id;

    res.status(201).json(player);
  } catch (error) {
    console.error("Error creating the player:", error);
    res.status(500).json({ error: "Error creating the player." });
  }
};

const createPlayerFaker = async (name, user_id) => {
  try {
    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "Player name cannot be empty." });
    }
    if (!user_id) {
      return res.status(400).json({ error: "User ID is missing." });
    }
    const playerRef = await db
      .collection("players")
      .add({ name, team_id: "", user_id });
    const playerDoc = await playerRef.get();
    const player = playerDoc.data();
    player.id = playerDoc.id;

    return player;
  } catch (error) {
    console.error("Error creating the faker player:", error);
    return null;
  }
};

const updatePlayer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, team_id } = req.body;
    if (!id) {
      return res.status(400).json({ error: "Player ID is missing." });
    }
    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "Player name cannot be empty." });
    }
    if (!team_id) {
      return res.status(400).json({ error: "Team ID is missing." });
    }
    const playerDoc = await db.collection("players").doc(id).get();
    if (!playerDoc.exists) {
      return res
        .status(404)
        .json({ error: "The specified player does not exist." });
    }
    const player = playerDoc.data();
    const newTeamId = team_id || "";
    const playerRef = db.collection("players").doc(id);
    if (player.team_id) {
      await db
        .collection("teams")
        .doc(player.team_id)
        .update({
          players: admin.firestore.FieldValue.arrayRemove(playerRef),
        });
    }
    await db.collection("players").doc(id).update({ name, team_id: newTeamId });
    if (newTeamId) {
      await db
        .collection("teams")
        .doc(newTeamId)
        .update({
          players: admin.firestore.FieldValue.arrayUnion(playerRef),
        });
    }

    res
      .status(200)
      .json({ message: "The player has been successfully updated." });
  } catch (error) {
    console.error("Error updating the player:", error);
    res.status(500).json({ error: "Error updating the player." });
  }
};

const deletePlayer = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Player ID is missing." });
    }
    const playerDoc = await db.collection("players").doc(id).get();
    if (!playerDoc.exists) {
      return res
        .status(404)
        .json({ error: "The specified player does not exist." });
    }
    const player = playerDoc.data();
    await db.collection("players").doc(id).delete();

    if (player.team_id) {
      await db
        .collection("teams")
        .doc(player.team_id)
        .update({
          players: admin.firestore.FieldValue.arrayRemove(
            db.collection("players").doc(id)
          ),
        });
    }

    res.status(200).json(id);
  } catch (error) {
    console.error("Error deleting the player:", error);
    res.status(500).json({ error: "Error deleting the player." });
  }
};

const deletePlayerFromTeam = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Player ID is missing." });
    }
    const playerDoc = await db.collection("players").doc(id).get();
    if (!playerDoc.exists) {
      return res
        .status(404)
        .json({ error: "The specified player does not exist." });
    }

    const playerData = playerDoc.data();
    await db
      .collection("teams")
      .doc(playerData.team_id)
      .update({
        players: admin.firestore.FieldValue.arrayRemove(id),
      });

    await db.collection("players").doc(id).update({
      team_id: "",
    });

    res
      .status(200)
      .json(id);
  } catch (error) {
    console.error("Error deleting the player from the team:", error);
    res.status(500).json({ error: "Error deleting the player from the team." });
  }
};

const generateData = async (req, res) => {
  try {
    const { user_id } = req.body;
    if (!user_id) {
      return res.status(400).json({ error: "User ID is missing." });
    }
    const { teams, players } = generateUserData(user_id, 2, 2);

    const teamsPromises = teams.map((team) =>
      createTeamFaker(team.name, user_id)
    );
    await Promise.all(teamsPromises);

    const playersPromises = players.map((player) =>
      createPlayerFaker(player.name, user_id)
    );
    await Promise.all(playersPromises);

    res.status(200).json({ message: "Data generated and added successfully!" });
  } catch (error) {
    console.error("Error generating and adding data:", error.message);
    res.status(500).json({ error: "Error generating and adding data." });
  }
};

module.exports = {
  getTeams,
  getPlayers,
  createTeam,
  updateTeam,
  deleteTeam,
  createPlayer,
  updatePlayer,
  deletePlayer,
  deletePlayerFromTeam,
  generateData,
};
