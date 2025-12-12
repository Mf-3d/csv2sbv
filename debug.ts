import csvToSbv from "./main";

const inputCsvPath = process.argv[2];
const outputSbvPath = process.argv[3];

csvToSbv(inputCsvPath, outputSbvPath, {
  startTime: "start",
  endTime: "end",
  text: "text"
});