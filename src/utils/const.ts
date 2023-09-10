export let indexConst: Record<string, string> = {
	tgp: 'Cache:TableGamePlayes',
	gp: 'Cache:GamePlayes',
	pi: 'Cache:PlayerId',
	wl: 'Cache:WaitingList',
};

export let NotificationType = {
	FAIL: {
		PLAYER_NOT_FOUND: 'Player Not Found',
		PLAYER_IS_OFFLINE: 'Player Is Offline',
		ROOM_IS_FULL: 'Room Is Full',
		TOKEN_NOT_FOUND: 'Token Not Found',
		TOKEN_NOT_IS_VALID: 'Token Not Is Valid',
		USER_NOT_FOUND: 'User Not Found',

		OPPONENT_IS_DISCONNECTED: 'Opponent Is Disconnected',
	},
	LOBBY: {
		WAIT_FOR_PLAYER: 'Waiting For Player',
		PLAYER_FOUND: 'Player Found',
	},
};
