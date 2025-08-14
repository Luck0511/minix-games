-- Dummy Data for MinixGames Database
-- Run this after creating the database structure

-- Insert Game Types
INSERT INTO `gameType` (`typeName`, `minPlayers`, `maxPlayers`) VALUES
('Solo', 1, 1),
('Duo', 2, 2),
('Trio', 3, 3),
('Squad', 4, 4),
('Battle Royale', 1, 100),
('Team Deathmatch', 6, 12),
('Free For All', 2, 8);

-- Insert Mini Games
INSERT INTO `miniGame` (`gameName`, `gameType`, `description`) VALUES
('Speed Clicker', 1, 'Click as fast as you can in 60 seconds'),
('Memory Match', 1, 'Match pairs of cards in minimum moves'),
('2048 Challenge', 1, 'Reach 2048 by combining numbered tiles'),
('Duo Puzzle Race', 2, 'Solve puzzles faster than your partner'),
('Word Battle', 2, 'Create words from random letters'),
('Triple Threat Trivia', 3, 'Answer trivia questions as a team'),
('Squad Strategy', 4, 'Tactical team-based strategy game'),
('Ultimate Survivor', 5, 'Last player standing wins'),
('Color Wars', 6, 'Team-based color territory capture'),
('Quick Draw', 7, 'Fast-paced drawing and guessing game');

-- Insert Players
INSERT INTO `player` (`playerName`, `password`, `registerDate`, `isActive`) VALUES
('GamerPro123', 'hashed_password_1', '2024-01-15 10:30:00', true),
('SpeedRunner99', 'hashed_password_2', '2024-01-20 14:22:00', true),
('PuzzleMaster', 'hashed_password_3', '2024-02-01 09:15:00', true),
('StrategyKing', 'hashed_password_4', '2024-02-10 16:45:00', true),
('QuickFingers', 'hashed_password_5', '2024-02-15 11:30:00', true),
('BrainTeaser', 'hashed_password_6', '2024-03-01 13:20:00', true),
('TeamPlayer', 'hashed_password_7', '2024-03-05 08:10:00', true),
('SoloChamp', 'hashed_password_8', '2024-03-10 19:30:00', true),
('DeletedUser9', 'deleted_password', '2024-01-10 12:00:00', false), -- Soft deleted user
('NewPlayer10', 'hashed_password_10', '2024-03-15 20:15:00', true);

-- Insert Custom Game Lists
INSERT INTO `customGameList` (`listName`, `playerID`, `isPublic`, `creation`, `description`) VALUES
('My Favorites', 1, true, '2024-01-16 10:00:00', 'My top favorite games'),
('Quick Games', 2, false, '2024-01-21 15:00:00', 'Games that can be played quickly'),
('Brain Games', 3, true, '2024-02-02 09:30:00', 'Games that challenge the mind'),
('Team Fun', 4, true, '2024-02-11 17:00:00', 'Best games for team play'),
('Solo Adventures', 8, false, '2024-03-11 20:00:00', 'Perfect for single player');

-- Link games to custom lists (many-to-many)
INSERT INTO `customList_miniGame` (`listID`, `gameID`) VALUES
-- My Favorites list
(1, 1), (1, 2), (1, 8),
-- Quick Games list  
(2, 1), (2, 10),
-- Brain Games list
(3, 2), (3, 3), (3, 6),
-- Team Fun list
(4, 4), (4, 7), (4, 9),
-- Solo Adventures list
(5, 1), (5, 2), (5, 3);

-- Insert Game Sessions
INSERT INTO `session` (`gameID`, `startTime`, `endTime`) VALUES
-- Solo sessions
(1, '2024-03-16 10:00:00', '2024-03-16 10:01:30'), -- Speed Clicker
(2, '2024-03-16 10:15:00', '2024-03-16 10:20:45'), -- Memory Match
(3, '2024-03-16 11:00:00', '2024-03-16 11:15:30'), -- 2048 Challenge

-- Multiplayer sessions
(4, '2024-03-16 14:00:00', '2024-03-16 14:10:00'), -- Duo Puzzle Race
(6, '2024-03-16 15:00:00', '2024-03-16 15:25:00'), -- Triple Threat Trivia
(7, '2024-03-16 16:00:00', '2024-03-16 16:45:00'), -- Squad Strategy
(8, '2024-03-16 18:00:00', '2024-03-16 18:12:30'), -- Ultimate Survivor
(9, '2024-03-16 19:00:00', '2024-03-16 19:20:00'), -- Color Wars

-- Tournament sessions
(10, '2024-03-17 10:00:00', '2024-03-17 10:05:00'), -- Quick Draw Round 1
(10, '2024-03-17 10:10:00', '2024-03-17 10:15:00'), -- Quick Draw Round 2  
(10, '2024-03-17 10:20:00', '2024-03-17 10:25:00'); -- Quick Draw Final

-- Link players to sessions (many-to-many)
INSERT INTO `player_session` (`playerID`, `sessionID`) VALUES
-- Solo games
(1, 1), -- GamerPro123 played Speed Clicker
(3, 2), -- PuzzleMaster played Memory Match  
(8, 3), -- SoloChamp played 2048

-- Multiplayer games
(1, 4), (2, 4), -- Duo Puzzle Race
(3, 5), (4, 5), (6, 5), -- Triple Threat Trivia
(4, 6), (5, 6), (6, 6), (7, 6), -- Squad Strategy
(1, 7), (2, 7), (3, 7), (4, 7), (5, 7), -- Ultimate Survivor (5 players)
(6, 8), (7, 8), (8, 8), (10, 8), (1, 8), (2, 8), -- Color Wars (6 players)

-- Tournament participants
(1, 9), (2, 9), (3, 9), (4, 9), (5, 9), (6, 9), -- Round 1
(1, 10), (3, 10), (5, 10), -- Round 2 (winners)
(1, 11), (5, 11); -- Final

-- Insert Tournaments
INSERT INTO `tournament` (`tournamentName`, `gamesID`, `rounds`, `startTime`, `endTime`) VALUES
('Quick Draw Championship', 10, 3, '2024-03-17 10:00:00', '2024-03-17 10:25:00'),
('Speed Masters Cup', 1, 2, '2024-03-18 14:00:00', '2024-03-18 14:30:00');

-- Link sessions to tournaments
INSERT INTO `session_tournament` (`sessionID`, `tournamentID`, `roundNumber`) VALUES
(9, 1, 1),  -- Quick Draw Round 1
(10, 1, 2), -- Quick Draw Round 2
(11, 1, 3); -- Quick Draw Final

-- Link players to tournaments
INSERT INTO `player_tournament` (`playerID`, `tournamentID`) VALUES
(1, 1), (2, 1), (3, 1), (4, 1), (5, 1), (6, 1); -- Quick Draw Championship participants

-- Insert Player Activities (unified activity log)
INSERT INTO `playerActivity` (`playerID`, `sessionID`, `isTournament`, `tournamentID`, `time`) VALUES
-- Solo session activities
(1, 1, false, NULL, '2024-03-16 10:00:00'), -- GamerPro123 Speed Clicker
(3, 2, false, NULL, '2024-03-16 10:15:00'), -- PuzzleMaster Memory Match
(8, 3, false, NULL, '2024-03-16 11:00:00'), -- SoloChamp 2048

-- Multiplayer session activities  
(1, 4, false, NULL, '2024-03-16 14:00:00'), -- Duo Puzzle Race
(2, 4, false, NULL, '2024-03-16 14:00:00'),
(3, 5, false, NULL, '2024-03-16 15:00:00'), -- Triple Threat Trivia
(4, 5, false, NULL, '2024-03-16 15:00:00'),
(6, 5, false, NULL, '2024-03-16 15:00:00'),

-- Tournament activities
(1, NULL, true, 1, '2024-03-17 10:00:00'), -- GamerPro123 in Quick Draw Championship
(2, NULL, true, 1, '2024-03-17 10:00:00'), -- SpeedRunner99 in Quick Draw Championship
(3, NULL, true, 1, '2024-03-17 10:00:00'), -- PuzzleMaster in Quick Draw Championship
(4, NULL, true, 1, '2024-03-17 10:00:00'), -- StrategyKing in Quick Draw Championship
(5, NULL, true, 1, '2024-03-17 10:00:00'), -- QuickFingers in Quick Draw Championship
(6, NULL, true, 1, '2024-03-17 10:00:00'); -- BrainTeaser in Quick Draw Championship