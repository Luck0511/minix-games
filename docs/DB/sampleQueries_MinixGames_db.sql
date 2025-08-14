-- Display some sample queries to test the data

-- 1. Get all players and their registration dates
SELECT playerName, registerDate, isActive FROM player ORDER BY registerDate;

-- 2. Get all games by type
SELECT g.gameName, gt.typeName, gt.minPlayers, gt.maxPlayers 
FROM miniGame g 
JOIN gameType gt ON g.gameType = gt.typeID 
ORDER BY gt.typeName, g.gameName;

-- 3. Get player activity timeline
SELECT p.playerName, 
       CASE 
         WHEN pa.isTournament = 1 THEN CONCAT('Tournament: ', t.tournamentName)
         ELSE CONCAT('Game Session: ', mg.gameName)
       END as activity,
       pa.time
FROM playerActivity pa
JOIN player p ON pa.playerID = p.playerID
LEFT JOIN tournament t ON pa.tournamentID = t.tournamentID
LEFT JOIN session s ON pa.sessionID = s.sessionID
LEFT JOIN miniGame mg ON s.gameID = mg.gameID
ORDER BY pa.time DESC
LIMIT 10;