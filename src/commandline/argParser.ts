import yargs from 'yargs';

export const parseArgs = async (args: string[]) =>
  await yargs(args)
    .options({
      day: {
        type: 'number',
        optional: true,
        nullable: false,
        describe: 'Run a day in the advent of code.',
        alias: 'd',
        choices: Array.from(Array(25)).map((_, day) => day + 1),
      },
      part: {
        type: 'number',
        optional: true,
        describe: 'Run part 1 or part 2 of a day.',
        alias: 'p',
        choices: [1, 2],
      },
      example: {
        type: 'number',
        optional: true,
        describe: 'Run example input (usually 1 or 2) rather than real input for the given part/day.',
        alias: 'e',
      },
    })
    .version(false)
    .check((argv) => {
      if (argv.part && !(argv.day || argv.latest)) {
        throw new Error("Can't provide part option without providing day or latest option as well.");
      }

      if (Object.keys(argv).includes('day') && !argv.day) {
        throw new Error("Can't provide empty day option.");
      }

      if (Object.keys(argv).includes('part') && !argv.part) {
        throw new Error("Can't provide empty part option.");
      }

      return true;
    })
    .help()
    .usage('$0 run')
    .usage('$0 run -e')
    .usage('$0 run -d [day]')
    .usage('$0 run -d [day] -e')
    .usage('$0 run -d [day] -p [part]')
    .usage('$0 run -d [day] -p [part] -e')
    .usage('$0 run -d [day] -p [part] -e [ex]')
    .showHelpOnFail(true, "This can't be run with these options.")
    .parse();
