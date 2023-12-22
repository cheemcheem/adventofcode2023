import { Day, getInputSplitByLine, sumNumbers } from '../common';

const day: Day = {
  part1: async (dayNumber, example) => {
    const availableCubes: Round = {
      cubes: [
        {
          colour: 'red',
          count: 12,
        },
        {
          colour: 'green',
          count: 13,
        },
        {
          colour: 'blue',
          count: 14,
        },
      ],
    };
    const lines = await getInputSplitByLine(dayNumber, example);
    const games = lines.map(lineToGame);
    const possible = games.map((game) => isGamePossible(availableCubes, game));
    return sumNumbers(possible);
  },
  part2: async (dayNumber, example) => {
    const lines = await getInputSplitByLine(dayNumber, example);
    const games = lines.map(lineToGame);
    const requirements = games.map(requirementsForGame);
    const powers = requirements.map((round) => round.cubes.map(({ count }) => count).reduce((a, b) => a * b));
    return sumNumbers(powers);
  },
};

export default day;

interface CubeCount {
  count: number;
  colour: string;
}

interface Round {
  cubes: CubeCount[];
}

interface Game {
  index: number;
  rounds: Round[];
}

const lineToGame = (line: string): Game => {
  const [gameSide, roundsSide] = line.split(':');

  const roundsString = roundsSide.split(';');
  const rounds = roundsString.map((roundString): Round => {
    const cubeCountStrings = roundString.split(',');
    const cubes = cubeCountStrings.map((cubeCountString): CubeCount => {
      const [countString, colour] = cubeCountString.trim().split(' ');
      const count = Number(countString);
      return {
        count,
        colour,
      };
    });
    return {
      cubes,
    };
  });

  const [_, gameIndex] = gameSide.split(' ');
  const index = Number(gameIndex);

  return {
    index,
    rounds,
  };
};

const isRoundPossible = (available: Round, round: Round): boolean => {
  for (const roundCubeCount of round.cubes) {
    const match = available.cubes.find(({ colour }) => {
      return colour === roundCubeCount.colour;
    });
    if (!match) {
      return false;
    }
    if (match.count < roundCubeCount.count) {
      return false;
    }
  }
  return true;
};

const isGamePossible = (available: Round, game: Game): number => {
  for (const round of game.rounds) {
    if (!isRoundPossible(available, round)) {
      return 0;
    }
  }
  return game.index;
};

const requirementsForGame = (game: Game): Round => {
  const requirements: Record<string, CubeCount> = {};

  game.rounds.forEach((round) => {
    round.cubes.forEach((cube) => {
      const requirement = requirements[cube.colour] ?? cube;
      if (requirement.count < cube.count) {
        requirement.count = cube.count;
      }
      requirements[cube.colour] = requirement;
    });
  });

  return {
    cubes: Object.values(requirements),
  };
};
