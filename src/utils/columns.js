export const columns_pinned = [
  { field: "index", pinned: 'left', title: "序号", headerName: '序号', width: 90 },
  {
    field: "yczjbxx",
    headerName: '遥测站基本信息',
    children: [
      {
        field: "cjxx",
        headerName: '基础信息',
        children: [
          { field: "ycmc", pinned: 'left', headerName: '遥测站名称', width: 250, colSpan: (params) => params.data.index == '注'? 2 : 1 },
          { field: "sscz", pinned: 'left', headerName: '所属测站编码', width: 240 },
          { field: "ycxm", pinned: 'left', headerName: '遥测项目', width: 120 },
          { field: "ssfzx",  headerName: '所属水旱情分中心名称', width: 130 },
          { field: "sszd", headerName: '所属站队', width: 140 },
          { field: "shi", headerName: '所在市', width: 100 },
          { field: "xian", headerName: '所在县(市、区)', width: 120 },
          { field: "shfzx", headerName: '是否在山洪灾害防治县', width: 130 },
          { field: "shxly", headerName: '是否在山洪灾害小流域防治单元', width: 150 },
          { field: "shxlym", headerName: '山洪灾害小流域编码', width: 130 },
        ]
      },
      {
        field: "fzxx",
        headerName: '辅助信息',
        children: [
          { field: "zcxx", headerName: '主从站信息', width: 130 },
          { field: "zdxx", headerName: '低水站信息', width: 130 },
          { field: "fzxx", headerName: '其他辅助站信息', width: 120 }
        ]
      },
    ]
  }, {
    field: "cgqmkxx",
    headerName: '传感器模块信息',
    children: [
      {
        field: "createdTime",
        headerName: '雨量传感器',
        children: [
          { field: "ylsccj", headerName: '生产厂家', width: 110, colSpan: (params) => params.data.index == '注'? 2 : 1 },
          { field: "ylxh", headerName: '型号', width: 110 },
          { field: "yllx", headerName: '类型', width: 110 },
          { field: "ylwc", headerName: '测量误差', width: 200 },
          { field: "yltm", headerName: '雨量计装配时间（年/月/日）', width: 240 },
        ]
      },
      {
        field: "createdTime",
        headerName: '水位传感器',
        children: [
          { field: "swonecj", headerName: '水位计1 生产厂家', width: 110, colSpan: (params) => params.data.index == '注'? 8 : 1 },
          { field: "swonexh", headerName: '水位计1型号', width: 180 },
          { field: "swonelx", headerName: '水位计1类型', width: 130 },
          { field: "swonetm", headerName: '水位计1装配时间（年/月/日）', width: 160 },
          { field: "swtwocj", headerName: '水位计2 生产厂家', width: 110 },
          { field: "swtwoxh", headerName: '水位计2型号', width: 180 },
          { field: "swtwolx", headerName: '水位计2类型', width: 130 },
          { field: "swtwotm", headerName: '水位计2装配时间（年/月/日）', width: 160 },
          { field: "zgsw", headerName: '最高可测水位值（m）', width: 130, colSpan: (params) => params.data.index == '注'? 4 : 1 },
          { field: "zgfxjc", headerName: '是否满足防汛监测需要', width: 130 },
          { field: "zdsw", headerName: '最低可测 水位值（m）', width: 130 },
          { field: "zdfxjc", headerName: '是否满足抗旱监测需要', width: 130 },
        ]
      },
      {
        field: "createdTime",
        headerName: '墒情传感器',
        children: [
          { field: "sqcj", headerName: '墒情传感器生产厂家', width: 130, colSpan: (params) => params.data.index == '注'? 4 : 1 },
          { field: "sqxh", headerName: '墒情传感器型号', width: 110 },
          { field: "sqlx", headerName: '墒情传感器类型', width: 110 },
          { field: "sqtm", headerName: '墒情传感器装配时间（年/月/日）', width: 160 },
        ]
      },
    ]
  }, {
    field: "yczdjmkxx",
    headerName: '遥测终端机（RTU）模块信息',
    children: [
      {
        field: "createdTime",
        headerName: '硬件情况',
        children: [
          { field: "rtucj", headerName: '生产厂家', width: 120, colSpan: (params) => params.data.index == '注'? 4 : 1 },
          { field: "rtuxh", headerName: '型号', width: 130 },
          { field: "rtutm", headerName: 'RTU装配时间（年/月/日）', width: 160 },
        ]
      },
      {
        field: "createdTime",
        headerName: '软件情况',
        children: [
          { field: "rjbbh", headerName: '当前软件版本号', width: 110 },
        ]
      },
    ]
  }, {
    field: "txmkxx",
    headerName: '通信模块信息',
    children: [
      {
        field: "dbtx",
        headerName: '短波通信',
        children: [
          { field: "duanbo", headerName: '短波/超短波', width: 100, colSpan: (params) => params.data.index == '注'? 3 : 1 },
        ]
      },
      {
        field: "ydtx",
        headerName: '移动通信',
        children: [
          { field: "twog", headerName: '2G', width: 100 },
          { field: "fourg", headerName: '4G/5G', width: 100 },
          { field: "txfws", headerName: '通信服务商', width: 200 },
          { field: "wlwk", headerName: '是否是物联网卡', width: 130 },
          { field: "txkhm", headerName: '通信卡号码', width: 140 },
          { field: "yczm", headerName: '遥测站码', width: 240 },
        ]
      },
      {
        field: "wxtx",
        headerName: '卫星通信',
        children: [
          { field: "bdstcd", headerName: '北斗信道测站编码', width: 200 },
          { field: "bdkh", headerName: '北斗卡号', width: 200 },
          { field: "bdtwo", headerName: '北斗卫星（二号系统）', width: 150, colSpan: (params) => params.data.index == '注'? 2 : 1 },
          { field: "bdthree", headerName: '北斗卫星（三号系统）', width: 150 },
          { field: "bdcj", headerName: '北斗卫星通信终端生产厂家', width: 350, colSpan: (params) => params.data.index == '注'? 3 : 1 },
          { field: "bdxh", headerName: '北斗卫星通信终端型号', width: 130 },
          { field: "bdtm", headerName: '北斗卫星通信终端装配时间（年/月/日）', width: 200 },
          { field: "wxtm", headerName: '卫星信道通信增值服务费到期时间（年/月/日）', width: 220, colSpan: (params) => params.data.index == '注'? 3 : 1 },
          { field: "wxzt", headerName: '卫星信道通信增值服务费缴纳主体', width: 160 },
          { field: "wxdx", headerName: '卫星信道通信增值服务费缴纳对象', width: 160 },
        ]
      },
      {
        field: "syjtxjdmc",
        headerName: '上一级通信节点名称',
        children: [
          { field: "txdmc", headerName: '短波/超短波（或其他短传信道）通信目的地名称', width: 240, colSpan: (params) => params.data.index == '注'? 4 : 1 },
          { field: "ydtxone", headerName: '移动通信第一目的地名称', width: 180 },
          { field: "ydtxtwo", headerName: '移动通信第二目的地名称', width: 180 },
          { field: "wxtx", headerName: '卫星通信', width: 140 },
        ]
      },
    ]
  }, {
    field: "gdmkxx",
    headerName: '供电模块信息',
    children: [
      {
        field: "gdms",
        headerName: '供电模式',
        children: [
          { field: "sd", headerName: '市电', width: 80, colSpan: (params) => params.data.index == '注'? 2 : 1 },
          { field: "xdc", headerName: '蓄电池', width: 350 }
        ]
      }, {
        field: "xdcjfdcqk",
        headerName: '蓄电池及浮充情况',
        children: [
          { field: "dclx", headerName: '电池类型', width: 200 },
          { field: "dcgg", headerName: '电池规格', width: 200 },
          { field: "dctm", headerName: '当前电池装配时间（年/月/日）', width: 160 },
          { field: "tyngg", headerName: '太阳能充电板规格', width: 120 },
          { field: "tynfs", headerName: '太阳能充电控制器安装方式', width: 150 },
          { field: "tyndl", headerName: '太阳能充电控制器额定充电电流', width: 150 },
        ]
      }
    ]
  }, {
    field: "fzmkxx",
    headerName: '辅助模块信息',
    children: [
      {
        field: "flxs",
        headerName: '防雷形式',
        children: [
          { field: "jdfl", headerName: '接地防雷', width: 130, colSpan: (params) => params.data.index == '注'? 2 : 1 },
          { field: "xfsbl", headerName: '悬浮式避雷', width: 130 },
        ]
      }
    ]
  },
  { field: "cjdw", headerName: '承建单位', width: 350 },
  { field: "ywdw", headerName: '运维单位', width: 250 },
  {
    field: "ssxm",
    headerName: '所属项目',
    children: [
      { field: "xmmc", headerName: '项目名称', width: 130, colSpan: (params) => params.data.index == '注'? 3 : 1 },
      { field: "xmbh", headerName: '项目编号', width: 130 },
      { field: "mztm", headerName: '免费质保服务到期时间（年/月/日）', width: 180 },
    ]
  },
  {
    field: "cjdw",
    headerName: '升级改造计划',
    children: [
      { field: "sjmc", headerName: '计划升级改造所属项目名称', width: 150, colSpan: (params) => params.data.index == '注'? 2 : 1 },
      { field: "sjtm", headerName: '计划升级改造所属项目实施时间（年/月/日）', width: 200 },
    ]
  },
  { field: "yctm", headerName: '遥测设备首次装配时间（年/月/日）', width: 200 },
  {
    field: "ycztp",
    headerName: '遥测站图片（最新拍摄原图，应包含拍摄时间，缩放至合适尺寸）',
    children: [
      { field: "gchj", headerName: '观测环境', width: 540 },
      { field: "zdqm", headerName: '站点全貌', width: 540 },
      { field: "ylj", headerName: '雨量计', width: 540 },
      { field: "swjone", headerName: '水位计1', width: 110, colSpan: (params) => params.data.index == '注'? 2 : 1 },
      { field: "swjtwo", headerName: '水位计2', width: 110 },
      { field: "rtu", headerName: 'RTU', width: 250 },
      { field: "xdctwo", headerName: '蓄电池', width: 300 },
    ]
  },
  { field: "bz", headerName: '备注', width: 120 },
  { field: "qt", headerName: '其他', width: 120 },
  {
    field: "tbzlkz",
    headerName: '填报质量控制',
    children: [
      { field: "tbtm", headerName: '填报时间（年/月/日）', width: 130, colSpan: (params) => params.data.index == '注'? 5 : 1 },
      {
        field: "tbr",
        headerName: '填报人',
        children: [
          { field: "tbname", headerName: '姓名', width: 80 },
          { field: "tbtel", headerName: '联系方式', width: 120 },
        ]
      },
      {
        field: "shr",
        headerName: '审核人',
        children: [
          { field: "shname", headerName: '姓名', width: 80 },
          { field: "shtel", headerName: '联系方式', width: 120 },
        ]
      },
    ]
  },
  { field: "check", headerName: '校核结果', width: 550,tooltipField: "check" },
  { field: "remark", headerName: '备注', width: 200,tooltipField: "remark" }
];

export const columns = [
  { field: "index", title: "序号", headerName: '序号', width: 90, noCellStyle: true },
  {
    field: "yczjbxx",
    headerName: '遥测站基本信息',
    children: [
      {
        field: "cjxx",
        headerName: '基础信息',
        children: [
          { field: "ycmc", headerName: '遥测站名称', width: 180, colSpan: (params) => params.data.index == '注'? 2 : 1 },
          { field: "sscz", headerName: '所属测站编码', width: 140 },
          { field: "ycxm", headerName: '遥测项目', width: 120 },
          { 
            field: "ssfzx",  
            headerName: '所属水旱情分中心名称', 
            width: 150
          },
          { field: "sszd", headerName: '所属站队', width: 130 },
          { field: "shi", headerName: '所在市', width: 100 },
          { field: "xian", headerName: '所在县(市、区)', width: 150 },
          { field: "shfzx", headerName: '是否在山洪灾害防治县', width: 200 },
          { field: "shxly", headerName: '是否在山洪灾害小流域防治单元', width: 245 },
          { field: "shxlym", headerName: '山洪灾害小流域编码', width: 180 },
        ]
      },
      {
        field: "fzxx",
        headerName: '辅助信息',
        children: [
          { field: "zcxx", headerName: '主从站信息', width: 130 },
          { field: "zdxx", headerName: '低水站信息', width: 130 },
          { field: "fzxx", headerName: '其他辅助站信息', width: 120 }
        ]
      },
    ]
  }, {
    field: "cgqmkxx",
    headerName: '传感器模块信息',
    children: [
      {
        field: "createdTime",
        headerName: '雨量传感器',
        children: [
          { field: "ylsccj", headerName: '生产厂家', width: 110, colSpan: (params) => params.data.index == '注'? 2 : 1 },
          { field: "ylxh", headerName: '型号', width: 110 },
          { field: "yllx", headerName: '类型', width: 110 },
          { field: "ylwc", headerName: '测量误差', width: 200 },
          { field: "yltm", headerName: '雨量计装配时间（年/月/日）', width: 240 },
        ]
      },
      {
        field: "createdTime",
        headerName: '水位传感器',
        children: [
          { field: "swonecj", headerName: '水位计1 生产厂家', width: 110, colSpan: (params) => params.data.index == '注'? 8 : 1 },
          { field: "swonexh", headerName: '水位计1型号', width: 180 },
          { field: "swonelx", headerName: '水位计1类型', width: 130 },
          { field: "swonetm", headerName: '水位计1装配时间（年/月/日）', width: 160 },
          { field: "swtwocj", headerName: '水位计2 生产厂家', width: 110 },
          { field: "swtwoxh", headerName: '水位计2型号', width: 180 },
          { field: "swtwolx", headerName: '水位计2类型', width: 130 },
          { field: "swtwotm", headerName: '水位计2装配时间（年/月/日）', width: 160 },
          { field: "zgsw", headerName: '最高可测水位值（m）', width: 130, colSpan: (params) => params.data.index == '注'? 4 : 1 },
          { field: "zgfxjc", headerName: '是否满足防汛监测需要', width: 130 },
          { field: "zdsw", headerName: '最低可测 水位值（m）', width: 130 },
          { field: "zdfxjc", headerName: '是否满足抗旱监测需要', width: 130 },
        ]
      },
      {
        field: "createdTime",
        headerName: '墒情传感器',
        children: [
          { field: "sqcj", headerName: '墒情传感器生产厂家', width: 130, colSpan: (params) => params.data.index == '注'? 4 : 1 },
          { field: "sqxh", headerName: '墒情传感器型号', width: 110 },
          { field: "sqlx", headerName: '墒情传感器类型', width: 110 },
          { field: "sqtm", headerName: '墒情传感器装配时间（年/月/日）', width: 160 },
        ]
      },
    ]
  }, {
    field: "yczdjmkxx",
    headerName: '遥测终端机（RTU）模块信息',
    children: [
      {
        field: "createdTime",
        headerName: '硬件情况',
        children: [
          { field: "rtucj", headerName: '生产厂家', width: 120, colSpan: (params) => params.data.index == '注'? 4 : 1 },
          { field: "rtuxh", headerName: '型号', width: 130 },
          { field: "rtutm", headerName: 'RTU装配时间（年/月/日）', width: 160 },
        ]
      },
      {
        field: "createdTime",
        headerName: '软件情况',
        children: [
          { field: "rjbbh", headerName: '当前软件版本号', width: 110 },
        ]
      },
    ]
  }, {
    field: "txmkxx",
    headerName: '通信模块信息',
    children: [
      {
        field: "dbtx",
        headerName: '短波通信',
        children: [
          { field: "duanbo", headerName: '短波/超短波', width: 100, colSpan: (params) => params.data.index == '注'? 3 : 1 },
        ]
      },
      {
        field: "ydtx",
        headerName: '移动通信',
        children: [
          { field: "twog", headerName: '2G', width: 100 },
          { field: "fourg", headerName: '4G/5G', width: 100 },
          { field: "txfws", headerName: '通信服务商', width: 200 },
          { field: "wlwk", headerName: '是否是物联网卡', width: 130 },
          { field: "txkhm", headerName: '通信卡号码', width: 140 },
          { field: "yczm", headerName: '遥测站码', width: 240 },
        ]
      },
      {
        field: "wxtx",
        headerName: '卫星通信',
        children: [
          { field: "bdstcd", headerName: '北斗信道测站编码', width: 200 },
          { field: "bdkh", headerName: '北斗卡号', width: 200 },
          { field: "bdtwo", headerName: '北斗卫星（二号系统）', width: 150, colSpan: (params) => params.data.index == '注'? 2 : 1 },
          { field: "bdthree", headerName: '北斗卫星（三号系统）', width: 150 },
          { field: "bdcj", headerName: '北斗卫星通信终端生产厂家', width: 350, colSpan: (params) => params.data.index == '注'? 3 : 1 },
          { field: "bdxh", headerName: '北斗卫星通信终端型号', width: 130 },
          { field: "bdtm", headerName: '北斗卫星通信终端装配时间（年/月/日）', width: 200 },
          { field: "wxtm", headerName: '卫星信道通信增值服务费到期时间（年/月/日）', width: 220, colSpan: (params) => params.data.index == '注'? 3 : 1 },
          { field: "wxzt", headerName: '卫星信道通信增值服务费缴纳主体', width: 160 },
          { field: "wxdx", headerName: '卫星信道通信增值服务费缴纳对象', width: 160 },
        ]
      },
      {
        field: "syjtxjdmc",
        headerName: '上一级通信节点名称',
        children: [
          { field: "txdmc", headerName: '短波/超短波（或其他短传信道）通信目的地名称', width: 240, colSpan: (params) => params.data.index == '注'? 4 : 1 },
          { field: "ydtxone", headerName: '移动通信第一目的地名称', width: 180 },
          { field: "ydtxtwo", headerName: '移动通信第二目的地名称', width: 180 },
          { field: "wxtx", headerName: '卫星通信', width: 140 },
        ]
      },
    ]
  }, {
    field: "gdmkxx",
    headerName: '供电模块信息',
    children: [
      {
        field: "gdms",
        headerName: '供电模式',
        children: [
          { field: "sd", headerName: '市电', width: 80, colSpan: (params) => params.data.index == '注'? 2 : 1 },
          { field: "xdc", headerName: '蓄电池', width: 350 }
        ]
      }, {
        field: "xdcjfdcqk",
        headerName: '蓄电池及浮充情况',
        children: [
          { field: "dclx", headerName: '电池类型', width: 200 },
          { field: "dcgg", headerName: '电池规格', width: 200 },
          { field: "dctm", headerName: '当前电池装配时间（年/月/日）', width: 160 },
          { field: "tyngg", headerName: '太阳能充电板规格', width: 120 },
          { field: "tynfs", headerName: '太阳能充电控制器安装方式', width: 150 },
          { field: "tyndl", headerName: '太阳能充电控制器额定充电电流', width: 150 },
        ]
      }
    ]
  }, {
    field: "fzmkxx",
    headerName: '辅助模块信息',
    children: [
      {
        field: "flxs",
        headerName: '防雷形式',
        children: [
          { field: "jdfl", headerName: '接地防雷', width: 130, colSpan: (params) => params.data.index == '注'? 2 : 1 },
          { field: "xfsbl", headerName: '悬浮式避雷', width: 130 },
        ]
      }
    ]
  },
  { field: "cjdw", headerName: '承建单位', width: 350 },
  { field: "ywdw", headerName: '运维单位', width: 250 },
  {
    field: "ssxm",
    headerName: '所属项目',
    children: [
      { field: "xmmc", headerName: '项目名称', width: 130, colSpan: (params) => params.data.index == '注'? 3 : 1 },
      { field: "xmbh", headerName: '项目编号', width: 130 },
      { field: "mztm", headerName: '免费质保服务到期时间（年/月/日）', width: 180 },
    ]
  },
  {
    field: "cjdw",
    headerName: '升级改造计划',
    children: [
      { field: "sjmc", headerName: '计划升级改造所属项目名称', width: 150, colSpan: (params) => params.data.index == '注'? 2 : 1 },
      { field: "sjtm", headerName: '计划升级改造所属项目实施时间（年/月/日）', width: 200 },
    ]
  },
  { field: "yctm", headerName: '遥测设备首次装配时间（年/月/日）', width: 200 },
  {
    field: "ycztp",
    headerName: '遥测站图片（最新拍摄原图，应包含拍摄时间，缩放至合适尺寸）',
    children: [
      { field: "gchj", headerName: '观测环境', width: 540 },
      { field: "zdqm", headerName: '站点全貌', width: 540 },
      { field: "ylj", headerName: '雨量计', width: 540 },
      { field: "swjone", headerName: '水位计1', width: 110, colSpan: (params) => params.data.index == '注'? 2 : 1 },
      { field: "swjtwo", headerName: '水位计2', width: 110 },
      { field: "rtu", headerName: 'RTU', width: 250 },
      { field: "xdctwo", headerName: '蓄电池', width: 300 },
    ]
  },
  { field: "bz", headerName: '备注', width: 120 },
  { field: "qt", headerName: '其他', width: 120 },
  {
    field: "tbzlkz",
    headerName: '填报质量控制',
    children: [
      { field: "tbtm", headerName: '填报时间（年/月/日）', width: 130, colSpan: (params) => params.data.index == '注'? 5 : 1 },
      {
        field: "tbr",
        headerName: '填报人',
        children: [
          { field: "tbname", headerName: '姓名', width: 80 },
          { field: "tbtel", headerName: '联系方式', width: 120 },
        ]
      },
      {
        field: "shr",
        headerName: '审核人',
        children: [
          { field: "shname", headerName: '姓名', width: 80 },
          { field: "shtel", headerName: '联系方式', width: 120 },
        ]
      },
    ]
  },
  { field: "check", headerName: '校核结果', width: 550,tooltipField: "check" },
  {
    field: "operation", headerName: '类型', width: 100, pinned: 'right', noCellStyle: true,
    cellRenderer: (params) => {
      if(params.value == 'I') {
        return `
          <span style="background-color:#22c55e;color:#fff;padding: 5px 10px;border-radius: 5px;">新增</span>
        `
      } else if(params.value == 'D') {
        return `<span style="background-color:#ef4444;color:#fff;padding: 5px 10px;border-radius: 5px;">删除</span>`
      }
      
      return `<span style="background-color:#f97316;color:#fff;padding: 5px 10px;border-radius: 5px;">修改</span>`
    }
  }
];