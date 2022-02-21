import parse from "minimist";

export default function parseArgv(argv) {
  const args = parse(argv);

  return {
    sourceFile: args["_"][2],
    destination: args.dest || args.d || `${Date.now()}`,
    sourceDocumentIndex: args.document,
  };
}
