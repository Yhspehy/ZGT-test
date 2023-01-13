export type StageType = {
  berthesInfo: BerthesInfo[];
  vesselBertherInfo: [];
  yardAreasInfo: YardAreasInfo[];
};

export type BerthesInfo = {
  BTH_CODE: string; //泊位编号
  BTH_TER_ID: string;
  BTH_NAME: string;
  BTH_STPST: string; //起始位置
  BTH_EDPST: string; //结束位置
  BTH_DISPLAY_NAME: string;
};

export type YardAreasInfo = {
  ARE_ID: string; //箱区编号
  ARE_AREANO: string;
  ARE_EDBAY: string; //结束贝位
  ARE_ROWNUM: string; //行
  ARE_TIERNUM: string; //层数
  ARE_STARTX: string; //起始X位置.配置信息读取
  ARE_STARTY: string; //起始Y位置
  ARE_BAYWAY: string;
  ARE_ROWWAY: string;
  yardBayesInfo: YardBayesInfo[];
};

export type YardBayesInfo = {
  YBY_ID: string;
  YBY_ARE_ID: string;
  YBY_BAYNO: string; //贝位
  YBY_STATUS: string;
  YBY_ROWNUM: string; //行数
  YBY_TIERNUM: string; //层数
  YBY_USEFG: string;
  YBY_ARE_AREANO: string; //所属箱区
  YBY_TER_ID: string;
  yardRowsInfo: YardRowsInfo[];
};

export type YardRowsInfo = {
  ARE_ID: string; //箱区
  YBY_ID: string; //贝位编号
  ROWNO: string; //列
  ContainerNum: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8; //集装箱个数
  STATUS: string;
};

export type BayesInfoList = {
  YST_SLOTNO: string;
  STS_EFFG: string;
  YST_AREBAY: string;
  YST_ROWNO: string;
  YST_TIERNO: string;
}[][];
