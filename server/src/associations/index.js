//all associations here

export const defineAssociations = (dbObject) => {
    //destruct object to get models (no extra import required)
    const {
        CustomGameList,
        CustomList_minigame,
        GameType,
        MiniGame,
        Player,
        Player_session,
        Player_tournament,
        PlayerActivity,
        PlayerScore,
        Session,
        Session_tournament,
        Tournament
    } = dbObject;

    //===One-to-one rel===

    //===One-to-many rel===

    /** CUSTOM LIST **/
    Player.hasMany(CustomGameList, {
        foreignKey: 'playerID',
        as: 'lists'
    })
    CustomGameList.belongsTo(Player, {
        foreignKey: 'playerID',
        as: 'player'
    })

    /** SESSION WINNER **/
    Player.hasMany(Session, {
        foreignKey: 'winnerID',
        as: 'wonSessions'
    })
    Session.belongsTo(Player, {
        foreignKey: 'winnerID',
        as: 'winner'
    })

    /** TOURNAMENT WINNER **/
    Player.hasMany(Tournament, {
        foreignKey: 'winnerID',
        as: 'wonTournament'
    })
    Tournament.belongsTo(Player, {
        foreignKey: 'winnerID',
        as: 'winningPlayer'
    })

    /** PLAYER SCORES **/
    Player.hasMany(PlayerScore, {
        foreignKey: 'playerID',
        as: 'scores'
    })
    PlayerScore.belongsTo(Player, {
        foreignKey: 'playerID',
        as: 'player'
    })

    /** SESSION SCORES **/
    Session.hasMany(PlayerScore, {
        foreignKey: 'sessionID',
        as: 'scores'
    })
    PlayerScore.belongsTo(Session, {
        foreignKey: 'sessionID',
        as: 'session'
    })

    /** GAME TYPES **/
    GameType.hasMany(MiniGame, {
        foreignKey: 'gameType',
        as: 'games'
    })
    MiniGame.belongsTo(GameType, {
        foreignKey: 'gameType',
        as: 'type'
    })

    /** SESSION GAME **/
    MiniGame.hasMany(Session, {
        foreignKey: 'gameID',
        as: 'sessions'
    })
    Session.belongsTo(MiniGame, {
        foreignKey: 'gameID',
        as: 'game'
    })

    /** PLAYER-ACTIVITY **/
    //player
    Player.hasMany(PlayerActivity, {
        foreignKey: 'playerID',
        as: 'players',
    })
    PlayerActivity.belongsTo(Player, {
        foreignKey: 'playerID',
        as: 'player'
    })
    //session
    Session.hasMany(PlayerActivity, {
        foreignKey: 'sessionID',
        as: 'sessions'
    })
    PlayerActivity.belongsTo(Session, {
        foreignKey: 'sessionID',
        as: 'session'
    })
    //tournament
    Tournament.hasMany(PlayerActivity, {
        foreignKey: 'tournamentID',
        as: 'tournaments'
    })
    PlayerActivity.belongsTo(Tournament, {
        foreignKey: 'tournamentID',
        as: 'tournament'
    })

    //===Many-to-many rel===

    /** JUNCTION PLAYER - SESSION **/
    Player.belongsToMany(Session, {
        through: Player_session,
        foreignKey: 'playerID',
        otherKey: 'sessionID',
        as: 'sessions'
    })
    Session.belongsToMany(Player, {
        through: Player_session,
        foreignKey: 'sessionID',
        otherKey: 'playerID',
        as: 'players'
    })

    /** JUNCTION PLAYER - TOURNAMENT **/
    Player.belongsToMany(Tournament, {
        through: Player_tournament,
        foreignKey: 'playerID',
        otherKey: 'tournamentID',
        as: 'tournaments'
    })
    Tournament.belongsToMany(Player, {
        through: Player_tournament,
        foreignKey: 'tournamentID',
        otherKey: 'playerID',
        as: 'players'
    })

    /** JUNCTION SESSION - TOURNAMENT **/
    Session.belongsToMany(Tournament, {
        through: Session_tournament,
        foreignKey: 'sessionID',
        otherKey: 'tournamentID',
        as: 'tournaments'
    })
    Tournament.belongsToMany(Session, {
        through: Session_tournament,
        foreignKey: 'tournamentID',
        otherKey: 'sessionID',
        as: 'sessions'
    })

    /** JUNCTION CUSTOM-LIST - MINIGAME **/
    CustomGameList.belongsToMany(MiniGame, {
        through: CustomList_minigame,
        foreignKey: 'listID',
        otherKey: 'gameID',
        as: 'lists'
    })
    MiniGame.belongsToMany(CustomGameList, {
        through: CustomList_minigame,
        foreignKey: 'gameID',
        otherKey: 'listID',
        as: 'games'
    })
}