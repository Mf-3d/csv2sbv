import * as fs from "fs";
import csvParser from "csv-parser";
import * as util from "util";

function formatTime(time: string): string {
  return time.replace("#", "");
}

/** CSVからSBVに変換する関数。
 *  @function 
 *  
 *  @param inputCsv 変数するCSVファイルのパス。
 *  @param outputSbv 出力するSBVファイルのパス。
 *  @param rowName 取得する列を定義します。
 * 
 *  @example
 *  // コマンドラインから実行する場合
 *  // "node main.js [input] [output]"
 * 
 *  const inputCsvPath = process.argv[2];
    const outputSbvPath = process.argv[3];

    csvToSbv(inputCsvPath, outputSbvPath, {
      startTime: "start",
      endTime: "end",
      text: "text"
    });
 */
function csvToSbv(inputCsv: string, outputSbv: string, rowName: {
  startTime: string,
  endTime: string,
  text: string
} = {
  startTime: "Start Time",
  endTime: "End Time",
  text: "Text"
}) {
  const sbvLines: string[] = [];

  fs.createReadStream(inputCsv)
    .pipe(csvParser())
    .on("data", (row: { [key: string]: string }) => {
      // ---------- BOMを除去
      Object.keys(row).forEach(key => {
        if (key.includes("\ufeff")) {
          row[key.replace(/^\ufeff/,"")] = row[key];

          // 元の要素を削除
          delete row[key];
        }
      });

      Object.values(row).forEach(value => {
        if (value.includes("\ufeff")) {
          row[value.replace(/^\ufeff/,"")] = row[value];

          // 元の要素を削除
          delete row[value];
        }
      });
      // -------------------
      
      const startTime = formatTime(row[rowName.startTime]);
      const endTime = formatTime(row[rowName.endTime]);
      const text = row[rowName.text];

      sbvLines.push(`${startTime},${endTime}`);
      sbvLines.push(text);
      sbvLines.push(""); // 字幕の間に空の行を追加する
    })
    .on("end", () => {
      fs.writeFileSync(outputSbv, sbvLines.join("\n"), "utf8");
      console.log(util.styleText(["bgBlue"], `SBV ファイルが ${outputSbv} に保存されました`));
    });
}

export default csvToSbv;
export { csvToSbv };

// ---------- Example usage

// `process.argv[1] === __filename` で直接呼ばれたか確認する
if (process.argv[1] === __filename) {
  if (!process.argv[2]) {
    const errorMessage = util.styleText("redBright", "\n============ ERROR =============\n  必要な引数が定義されていません。\n================================");
    console.error(errorMessage);
  
    throw new Error("Required arguments were not defined.");
  }

  const inputCsvPath = process.argv[2];
  const outputSbvPath = process.argv[3];
  
  csvToSbv(inputCsvPath, outputSbvPath);

  /*
  csvToSbv(inputCsvPath, outputSbvPath, {
    startTime: "開始位置",
    endTime: "終了位置",
    text: "抽出テキスト"
  });
  */
}