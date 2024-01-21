const faker = require('faker');

const generatePlayer = (user_id) => ({
  user_id: user_id,
  name: faker.name.findName(),
  team_id: "", // Înainte de a fi adăugat la o echipă
});

const generateTeam = (user_id) => ({
  user_id: user_id,
  name: faker.company.companyName(),
  players: [],
});

const generateUserData = (user_id, numTeams, numPlayers) => {
  const teams = Array.from({ length: numTeams }, () => generateTeam(user_id));
  const players = Array.from({ length: numPlayers }, () => generatePlayer(user_id));
  return { teams, players };
};

module.exports = generateUserData;




