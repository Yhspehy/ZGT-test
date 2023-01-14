import type {
  AreaSettingInfo,
  YardBayesInfo,
  YardAreasInfo,
  YardRowsInfo,
  ContainerNumType,
} from "@/views/type";

export function mockData(areaList: AreaSettingInfo[], addYardRows = true) {
  const start = Date.now();

  // 当前的箱子数量
  let currentNum = 0;

  // 最后结果
  const result: YardAreasInfo[] = [];
  // id
  let areaId = 0;
  let bayeId = 0;

  // 添加箱区
  for (let i = 0; i < areaList.length; i++) {
    areaId++;
    const areaInfo = areaList[i];
    const yardBayesInfo: YardBayesInfo[] = [];
    const _areaId = "C_" + areaId;

    // 添加贝位
    const endBay = parseInt(areaInfo.ARE_EDBAY);
    for (let j = 1; j <= endBay; j = j + 2) {
      bayeId++;
      const _bayeId = "C_" + bayeId;

      // 添加层
      const yardRowsInfo: YardRowsInfo[] = [];
      if (addYardRows) {
        const rowNum = parseInt(areaInfo.ARE_ROWNUM);
        for (let k = 0; k < rowNum; k++) {
          const num = Math.floor(Math.random() * 8) as ContainerNumType;
          yardRowsInfo.push({
            ARE_ID: _areaId,
            YBY_ID: _bayeId,
            ROWNO: k + "",
            ContainerNum: num,
            STATUS: "1",
          });
          currentNum += num;
        }
      }

      yardBayesInfo.push({
        YBY_ID: _bayeId,
        YBY_ARE_ID: _areaId,
        YBY_BAYNO: j < 10 ? "0" + j : j + "",
        YBY_STATUS: "1",
        YBY_ROWNUM: areaInfo.ARE_ROWNUM,
        YBY_TIERNUM: "3",
        YBY_USEFG: "Y",
        YBY_ARE_AREANO: areaInfo.ARE_EDBAY,
        YBY_TER_ID: "2",
        yardRowsInfo,
      });
    }

    result.push({
      ARE_ID: _areaId,
      ARE_AREANO: areaInfo.ARE_AREANO,
      ARE_EDBAY: areaInfo.ARE_EDBAY,
      ARE_ROWNUM: areaInfo.ARE_ROWNUM,
      ARE_TIERNUM: "3",
      ARE_STARTX: areaInfo.ARE_STARTX,
      ARE_STARTY: areaInfo.ARE_STARTY,
      ARE_BAYWAY: areaInfo.ARE_BAYWAY,
      ARE_ROWWAY: "UD",
      yardBayesInfo,
    });
  }

  console.log(`当前箱子总数：${currentNum}`);
  console.log("mock time: " + (Date.now() - start) + "ms");
  return result;
}

export const defaultData =
  '[{"ARE_ID":"306","ARE_AREANO":"G1","ARE_EDBAY":"17","ARE_ROWNUM":"4","ARE_TIERNUM":"3","ARE_STARTX":"320","ARE_STARTY":"50","ARE_BAYWAY":"RL","ARE_ROWWAY":"UD"},{"ARE_ID":"307","ARE_AREANO":"G2","ARE_EDBAY":"13","ARE_ROWNUM":"7","ARE_TIERNUM":"3","ARE_STARTX":"400","ARE_STARTY":"50","ARE_BAYWAY":"RL","ARE_ROWWAY":"UD"},{"ARE_ID":"366","ARE_AREANO":"LM","ARE_EDBAY":"15","ARE_ROWNUM":"8","ARE_TIERNUM":"3","ARE_STARTX":"0","ARE_STARTY":"150","ARE_BAYWAY":"RL","ARE_ROWWAY":"UD"},{"ARE_ID":"364","ARE_AREANO":"A2","ARE_EDBAY":"15","ARE_ROWNUM":"8","ARE_TIERNUM":"3","ARE_STARTX":"0","ARE_STARTY":"110","ARE_BAYWAY":"RL","ARE_ROWWAY":"UD"},{"ARE_ID":"331","ARE_AREANO":"E4","ARE_EDBAY":"61","ARE_ROWNUM":"3","ARE_TIERNUM":"3","ARE_STARTX":"180","ARE_STARTY":"135","ARE_BAYWAY":"RL","ARE_ROWWAY":"UD"},{"ARE_ID":"336","ARE_AREANO":"C1","ARE_EDBAY":"41","ARE_ROWNUM":"9","ARE_TIERNUM":"3","ARE_STARTX":"0","ARE_STARTY":"210","ARE_BAYWAY":"RL","ARE_ROWWAY":"UD"},{"ARE_ID":"341","ARE_AREANO":"E6","ARE_EDBAY":"15","ARE_ROWNUM":"8","ARE_TIERNUM":"4","ARE_STARTX":"150","ARE_STARTY":"230","ARE_BAYWAY":"RL","ARE_ROWWAY":"UD"},{"ARE_ID":"342","ARE_AREANO":"E7","ARE_EDBAY":"15","ARE_ROWNUM":"8","ARE_TIERNUM":"4","ARE_STARTX":"150","ARE_STARTY":"180","ARE_BAYWAY":"RL","ARE_ROWWAY":"DU"},{"ARE_ID":"441","ARE_AREANO":"KA","ARE_EDBAY":"13","ARE_ROWNUM":"7","ARE_TIERNUM":"3","ARE_STARTX":"400","ARE_STARTY":"80","ARE_BAYWAY":"LR","ARE_ROWWAY":"DU"},{"ARE_ID":"461","ARE_AREANO":"F2","ARE_EDBAY":"65","ARE_ROWNUM":"2","ARE_TIERNUM":"2","ARE_STARTX":"420","ARE_STARTY":"180","ARE_BAYWAY":"RL","ARE_ROWWAY":"DU"},{"ARE_ID":"346","ARE_AREANO":"X1","ARE_EDBAY":"29","ARE_ROWNUM":"9","ARE_TIERNUM":"7","ARE_STARTX":"400","ARE_STARTY":"200","ARE_BAYWAY":"RL","ARE_ROWWAY":"DU"},{"ARE_ID":"421","ARE_AREANO":"A3","ARE_EDBAY":"17","ARE_ROWNUM":"9","ARE_TIERNUM":"5","ARE_STARTX":"70","ARE_STARTY":"150","ARE_BAYWAY":"RL","ARE_ROWWAY":"UD"},{"ARE_ID":"381","ARE_AREANO":"A1","ARE_EDBAY":"15","ARE_ROWNUM":"8","ARE_TIERNUM":"3","ARE_STARTX":"0","ARE_STARTY":"43","ARE_BAYWAY":"RL","ARE_ROWWAY":"UD"},{"ARE_ID":"382","ARE_AREANO":"A4","ARE_EDBAY":"29","ARE_ROWNUM":"1","ARE_TIERNUM":"2","ARE_STARTX":"0","ARE_STARTY":"80","ARE_BAYWAY":"RL","ARE_ROWWAY":"UD"},{"ARE_ID":"349","ARE_AREANO":"E2","ARE_EDBAY":"41","ARE_ROWNUM":"7","ARE_TIERNUM":"7","ARE_STARTX":"220","ARE_STARTY":"180","ARE_BAYWAY":"RL","ARE_ROWWAY":"DU"},{"ARE_ID":"334","ARE_AREANO":"E5","ARE_EDBAY":"41","ARE_ROWNUM":"4","ARE_TIERNUM":"3","ARE_STARTX":"180","ARE_STARTY":"50","ARE_BAYWAY":"RL","ARE_ROWWAY":"UD"},{"ARE_ID":"323","ARE_AREANO":"E1","ARE_EDBAY":"41","ARE_ROWNUM":"8","ARE_TIERNUM":"7","ARE_STARTX":"220","ARE_STARTY":"230","ARE_BAYWAY":"RL","ARE_ROWWAY":"UD"},{"ARE_ID":"347","ARE_AREANO":"X2","ARE_EDBAY":"29","ARE_ROWNUM":"9","ARE_TIERNUM":"7","ARE_STARTX":"520","ARE_STARTY":"200","ARE_BAYWAY":"RL","ARE_ROWWAY":"DU"},{"ARE_ID":"385","ARE_AREANO":"E3","ARE_EDBAY":"49","ARE_ROWNUM":"6","ARE_TIERNUM":"4","ARE_STARTX":"180","ARE_STARTY":"80","ARE_BAYWAY":"RL","ARE_ROWWAY":"UD"},{"ARE_ID":"333","ARE_AREANO":"F1","ARE_EDBAY":"69","ARE_ROWNUM":"9","ARE_TIERNUM":"5","ARE_STARTX":"420","ARE_STARTY":"140","ARE_BAYWAY":"RL","ARE_ROWWAY":"DU"},{"ARE_AREANO":"X8","ARE_STARTY":"100","ARE_STARTX":"50","ARE_EDBAY":"65","ARE_ROWNUM":"10","ARE_BAYWAY":"RL"},{"ARE_AREANO":"X9","ARE_STARTY":"29","ARE_STARTX":"50","ARE_EDBAY":"53","ARE_ROWNUM":"10","ARE_BAYWAY":"LR"},{"ARE_AREANO":"X6","ARE_STARTY":"20","ARE_STARTX":"500","ARE_EDBAY":"57","ARE_ROWNUM":"6","ARE_BAYWAY":"RL"},{"ARE_AREANO":"X5","ARE_STARTY":"60","ARE_STARTX":"460","ARE_EDBAY":"63","ARE_ROWNUM":"6","ARE_BAYWAY":"RL"},{"ARE_AREANO":"X4","ARE_STARTY":"100","ARE_STARTX":"470","ARE_EDBAY":"47","ARE_ROWNUM":"8","ARE_BAYWAY":"RL"}]';
