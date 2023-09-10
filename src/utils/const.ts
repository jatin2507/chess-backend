export let indexConst:Record<string, string>  = {
    tgp:'Cache:TableGamePlayes',
    gp:'Cache:GamePlayes',
    pi:'Cache:PlayerId',
    wl:'Cache:WaitingList',
}






export let NotificationType = {
    FAIL :{
        PLAYER_NOT_FOUND: 'Player Not Found',
        PLAYER_IS_OFFLINE: 'Player Is Offline',
        ROOM_IS_FULL: 'Room Is Full',
    },
    LOBBY:{
        WAIT_FOR_PLAYER: 'Waiting For Player',
        PLAYER_FOUND: 'Player Found',
    }
}