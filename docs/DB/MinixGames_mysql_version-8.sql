drop database minixgames_db;
create database minixgames_db;
use minixgames_db;

CREATE TABLE `player` (
  `playerID` integer UNIQUE PRIMARY KEY AUTO_INCREMENT,
  `playerName` varchar(32) UNIQUE NOT NULL,
  `password` varchar(255) NOT NULL,
  `registerDate` datetime DEFAULT (now()),
  `isActive` boolean NOT NULL DEFAULT true
);

CREATE TABLE `customGameList` (
  `listID` integer PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `listName` varchar(32) NOT NULL,
  `playerID` integer NOT NULL,
  `isPublic` boolean NOT NULL DEFAULT false,
  `creation` datetime DEFAULT (now()),
  `description` varchar(100)
);

CREATE TABLE `customList_miniGame` (
  `listID` integer NOT NULL,
  `gameID` integer NOT NULL,
  PRIMARY KEY (`listID`, `gameID`)
);

CREATE TABLE `miniGame` (
  `gameID` integer UNIQUE PRIMARY KEY AUTO_INCREMENT,
  `gameName` varchar(100) UNIQUE NOT NULL,
  `gameType` integer NOT NULL,
  `description` varchar(300)
);

CREATE TABLE `gameType` (
  `typeID` integer UNIQUE PRIMARY KEY AUTO_INCREMENT,
  `typeName` varchar(32) NOT NULL,
  `minPlayers` integer NOT NULL,
  `maxPlayers` integer
);

CREATE TABLE `player_session` (
  `playerID` integer NOT NULL,
  `sessionID` integer NOT NULL,
  PRIMARY KEY (`playerID`, `sessionID`)
);

CREATE TABLE `session` (
  `sessionID` integer UNIQUE PRIMARY KEY AUTO_INCREMENT,
  `gameID` integer NOT NULL,
  `startTime` datetime NOT NULL,
  `endTime` datetime NOT NULL
);

CREATE TABLE `player_tournament` (
  `playerID` integer NOT NULL,
  `tournamentID` integer NOT NULL,
  PRIMARY KEY (`playerID`, `tournamentID`)
);

CREATE TABLE `session_tournament` (
  `sessionID` integer NOT NULL,
  `tournamentID` integer NOT NULL,
  `roundNumber` integer NOT NULL,
  PRIMARY KEY (`sessionID`, `tournamentID`)
);

CREATE TABLE `tournament` (
  `tournamentID` integer UNIQUE PRIMARY KEY AUTO_INCREMENT,
  `tournamentName` varchar(32),
  `gamesID` integer NOT NULL,
  `rounds` integer NOT NULL,
  `startTime` datetime NOT NULL,
  `endTime` datetime NOT NULL
);

CREATE TABLE `playerActivity` (
  `logID` integer UNIQUE PRIMARY KEY AUTO_INCREMENT,
  `playerID` integer NOT NULL,
  `sessionID` integer,
  `isTournament` boolean NOT NULL,
  `tournamentID` integer,
  `time` datetime NOT NULL
);

ALTER TABLE `player` COMMENT = 'store users';

ALTER TABLE `customGameList` COMMENT = 'stores custom list of games created by players';

ALTER TABLE `customList_miniGame` COMMENT = 'junction table for many-to-many relationship';

ALTER TABLE `miniGame` COMMENT = 'store games avilable to players';

ALTER TABLE `gameType` COMMENT = 'gameTypes, e.g.: SinglePlayer, Duo, Trio, Squad...';

ALTER TABLE `player_session` COMMENT = 'junction table for many-to-many relationship';

ALTER TABLE `session` COMMENT = 'user games history';

ALTER TABLE `player_tournament` COMMENT = 'junction table for many-to-many relationship';

ALTER TABLE `session_tournament` COMMENT = 'junction table for many-to-many relationship';

ALTER TABLE `tournament` COMMENT = 'torunaments between players';

ALTER TABLE `playerActivity` COMMENT = 'stores player activities, either tournament or single game
CONSTRAINT: (isTournament = true AND tournamentID IS NOT NULL AND sessionID IS NULL) 
OR (isTournament = false AND sessionID IS NOT NULL AND tournamentID IS NULL)
';

ALTER TABLE `session` ADD FOREIGN KEY (`gameID`) REFERENCES `miniGame` (`gameID`);

ALTER TABLE `miniGame` ADD FOREIGN KEY (`gameType`) REFERENCES `gameType` (`typeID`);

ALTER TABLE `tournament` ADD FOREIGN KEY (`gamesID`) REFERENCES `miniGame` (`gameID`);

ALTER TABLE `playerActivity` ADD FOREIGN KEY (`tournamentID`) REFERENCES `tournament` (`tournamentID`);

ALTER TABLE `playerActivity` ADD FOREIGN KEY (`playerID`) REFERENCES `player` (`playerID`);

ALTER TABLE `playerActivity` ADD FOREIGN KEY (`sessionID`) REFERENCES `session` (`sessionID`);

ALTER TABLE `customGameList` ADD FOREIGN KEY (`playerID`) REFERENCES `player` (`playerID`);

ALTER TABLE `player_session` ADD FOREIGN KEY (`playerID`) REFERENCES `player` (`playerID`);

ALTER TABLE `player_session` ADD FOREIGN KEY (`sessionID`) REFERENCES `session` (`sessionID`);

ALTER TABLE `player_tournament` ADD FOREIGN KEY (`playerID`) REFERENCES `player` (`playerID`);

ALTER TABLE `player_tournament` ADD FOREIGN KEY (`tournamentID`) REFERENCES `tournament` (`tournamentID`);

ALTER TABLE `customList_miniGame` ADD FOREIGN KEY (`listID`) REFERENCES `customGameList` (`listID`);

ALTER TABLE `customList_miniGame` ADD FOREIGN KEY (`gameID`) REFERENCES `miniGame` (`gameID`);

ALTER TABLE `session_tournament` ADD FOREIGN KEY (`tournamentID`) REFERENCES `tournament` (`tournamentID`);

ALTER TABLE `session_tournament` ADD FOREIGN KEY (`sessionID`) REFERENCES `session` (`sessionID`);

ALTER TABLE playerActivity 
ADD CONSTRAINT chk_activity_logic 
CHECK (
    (isTournament = true AND tournamentID IS NOT NULL AND sessionID IS NULL) OR
    (isTournament = false AND sessionID IS NOT NULL AND tournamentID IS NULL)
) ENFORCED;
