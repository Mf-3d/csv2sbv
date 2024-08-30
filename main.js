"use strict";
exports.__esModule = true;
var fs = require("fs");
var csvParser = require("csv-parser");
var util = require("util");
function formatTime(time) {
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
 *  const inputCsvPath = process.argv[2];
    const outputSbvPath = process.argv[3];

    csvToSbv(inputCsvPath, outputSbvPath, {
      startTime: "start",
      endTime: "end",
      text: "text"
    });
 */
function csvToSbv(inputCsv, outputSbv, rowName) {
    if (rowName === void 0) { rowName = {
        startTime: "Start Time",
        endTime: "End Time",
        text: "Text"
    }; }
    var sbvLines = [];
    fs.createReadStream(inputCsv)
        .pipe(csvParser())
        .on("data", function (row) {
        // ---------- BOMを除去
        Object.keys(row).forEach(function (key) {
            if (key.includes("\ufeff")) {
                row[key.replace(/^\ufeff/, "")] = row[key];
                // 元の要素を削除
                delete row[key];
            }
        });
        Object.values(row).forEach(function (value) {
            if (value.includes("\ufeff")) {
                row[value.replace(/^\ufeff/, "")] = row[value];
                // 元の要素を削除
                delete row[value];
            }
        });
        // -------------------
        var startTime = formatTime(row[rowName.startTime]);
        var endTime = formatTime(row[rowName.endTime]);
        var text = row[rowName.text];
        sbvLines.push("".concat(startTime, ",").concat(endTime));
        sbvLines.push(text);
        sbvLines.push(""); // 字幕の間に空の行を追加する
    })
        .on("end", function () {
        fs.writeFileSync(outputSbv, sbvLines.join("\n"), "utf8");
        console.log(util.styleText(["bgBlue"], "SBV \u30D5\u30A1\u30A4\u30EB\u304C ".concat(outputSbv, " \u306B\u4FDD\u5B58\u3055\u308C\u307E\u3057\u305F")));
    });
}
// ---------- Example usage

// `process.argv[1] === __filename` で直接呼ばれたか確認する
if (process.argv[1] === __filename) {
    if (!process.argv[2]) {
        var errorMessage = util.styleText("redBright", "\n============ ERROR =============\n  必要な引数が定義されていません。\n================================");
        console.error(errorMessage);
        throw new Error("Required arguments were not defined.");
    }
    var inputCsvPath = process.argv[2];
    var outputSbvPath = process.argv[3];
    csvToSbv(inputCsvPath, outputSbvPath);
    // csvToSbv(inputCsvPath, outputSbvPath, {
    //   startTime: "開始位置",
    //   endTime: "終了位置",
    //   text: "抽出テキスト"
    // });
}
