export enum HTTP_CODE {
  GAME_IN_PROGRESS = 'game in progress',
  GAME_NOT_FOUND = 'game not found',
  NOT_ENOUGH_BALANCE = 'not enough balance',
  INVALID_TOKEN = 'invalid token',
  BALANCE_IS_MISSING = 'balance should not be empty',
  BALANCE_MUST_BE_NUMBER = 'balance must be an integer number',
  BALANCE_MUST_BE_MORE_THAN_ZERO = 'balance must be more then zero',
  INVALID_BODY = 'invalid body',
  WINNING_NUMBER_IS_MISSING = 'winningNumber should not be empty',
  WINNING_NUMBER_MUST_BE_NUMBER = 'winningNumber must be an integer number',
  WINNING_NUMBER_NOT_IN_RANGE = 'winningNumber must be between [0-36] range',
  BAD_REQUEST = 'Bad Request',
}

export enum PRIMITIVES {
  number = 'number',
  string = 'string',
}

export enum GAME_MODE {
  normal = 'normal',
  testing = 'testing',
}

export enum RESULT_TYPE {
  won = 'won',
  lost = 'lost',
}

export enum BET_TYPE {
  odd = 'odd',
  even = 'even',
}

export enum WINNING_COEFFICIENT {
  number = 36,
  even_odd = 2,
}
