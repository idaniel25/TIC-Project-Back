const faker = require('faker');

const generatePlayer = (user_id) => ({
  user_id: user_id,
  name: faker.name.findName(),
  team_id: "",
});

const generateTeam = (user_id) => ({
  user_id: user_id,
  name: faker.lorem.word(5),
  players: [],
});

const generateUserData = (user_id, numTeams, numPlayers) => {
  const teams = Array.from({ length: numTeams }, () => generateTeam(user_id));
  const players = Array.from({ length: numPlayers }, () => generatePlayer(user_id));
  return { teams, players };
};

module.exports = generateUserData;




