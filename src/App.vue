<template>
  <div class="page">
    <Toast position="top-center" group="tc">
      <template #container="{ message, closeCallback }">
        <div style="padding: 8px 15px;display: flex; align-items: center;">
          <i class="pi pi-times-circle" style="color: 'var(--p-red-500)'; margin-right: 5px;"></i>
          {{ message.summary }}
        </div>
      </template>
    </Toast>
    <Toast position="top-center" group="cg">
      <template #container="{ message, closeCallback }">
        <div style="padding: 8px 15px;display: flex; align-items: center;">
          <i class="pi pi-check" style="color: 'var(--p-red-500)'; margin-right: 5px;"></i>
          {{ message.summary }}
        </div>
      </template>
    </Toast>
    <ConfirmPopup></ConfirmPopup>
    <ConfirmPopup group="headless">
       <template #message="slotProps">
        <div style="padding: 10px 15px;">
          <p>
            <i class="pi pi-info-circle"></i>
            {{ slotProps.message.message }}
          </p>
          <InputText v-model="remark" type="text" placeholder="" />
        </div>
      </template>
    </ConfirmPopup>
    <div class="page-head">
      <div class="point-title">
        <span class="point"></span>
        <span class="point-label">设备信息填报</span>
      </div>
      <div>
        <Button label="刷新" size="small" @click="getList" :disabled="isLoading" style="padding: 5px 25px;" />
        <Button label="新增" size="small" severity="info" @click="addModel" style="padding: 5px 25px; margin: 0 15px;" />
        <!-- admin 省局用户 -->
        <!-- v-if="permission == 'admin'" -->
        <Button label="数据审核" size="small" severity="warn" @click="toCheck" style="padding: 5px 25px; margin-right: 15px;" />
        <Button label="二次审核" size="small" severity="help" @click="toSecondCheck" style="padding: 5px 25px; margin-right: 15px;" />
        <Button label="导出" size="small" severity="success" v-if="tableData.length" @click="handleExport" style="padding: 5px 25px;"  />
      </div>
    </div>
    <div class="page-main">
      <ag-grid-vue
        class="ag-theme-alpine"
        style="flex: 1;"
        :rowData="tableData" 
        :columnDefs="column" 
        @grid-ready="onGridReady"
        :defaultColDef="defColOption"
        @cellEditingStopped="stopEdit"
        :rowClassRules="rowClassRules"
        :getRowHeight="getRowHeight"
        theme="legacy"
        :pinnedTopRowData="pinnedTopRowData"
      >
      </ag-grid-vue>
    </div>

    <Dialog v-model:visible="dialogVisible" :header="detailTitle" :style="{ width: '980px' }" maximizable modal
      :contentStyle="{ height: '650px' }">
      <div class="dialogForm">
        <p class="title">遥测站基本信息</p>
        <p class="title t2">基本信息</p>
        <div class="dialogForm-row">
          <div class="dialogForm-item">
            <span class="dialogForm-item-title">
              所属水旱情分中心名称:
            </span>
            <div class="dialogForm-item-main">
              <InputText v-model="addForm.ssfzx" type="text" placeholder="" />
            </div>
          </div>
          <div class="dialogForm-item">
            <span class="dialogForm-item-title">所属站队:</span>
            <div class="dialogForm-item-main">
              <InputText v-model="addForm.sszd" type="text" placeholder="" />
            </div>
          </div>
        </div>
        <div class="dialogForm-row">
          <div class="dialogForm-item">
            <span class="dialogForm-item-title">遥测站名称:</span>
            <div class="dialogForm-item-main">
              <InputText v-model="addForm.ycmc" type="text" placeholder="" />
            </div>
          </div>
          <div class="dialogForm-item">
            <span class="dialogForm-item-title"> 所属测站编码: </span>
            <div class="dialogForm-item-main">
              <InputText v-model="addForm.sscz" type="text" placeholder="" />
            </div>
          </div>
        </div>
        <div class="dialogForm-row">
          <div class="dialogForm-item">
            <span class="dialogForm-item-title">遥测项目:</span>
            <div class="dialogForm-item-main">
              <InputText v-model="addForm.ycxm" type="text" placeholder="" />
            </div>
          </div>
          <div class="dialogForm-item">
            <span class="dialogForm-item-title">所在市:</span>
            <div class="dialogForm-item-main">
              <InputText v-model="addForm.shi" type="text" placeholder="" />
            </div>
          </div>
        </div>
        <div class="dialogForm-row">
          <div class="dialogForm-item">
            <span class="dialogForm-item-title">
              所在县(市、区):
            </span>
            <div class="dialogForm-item-main">
              <InputText v-model="addForm.xian" type="text" placeholder="" />
            </div>
          </div>
          <div class="dialogForm-item">
            <span class="dialogForm-item-title">是否在山洪灾害防治县:</span>
            <div class="dialogForm-item-main">
              <InputText v-model="addForm.shfzx" type="text" placeholder="" />
            </div>
          </div>
        </div>
        <div class="dialogForm-row">
          <div class="dialogForm-item">
            <span class="dialogForm-item-title">
              是否在山洪灾害小流域防治单元:
            </span>
            <div class="dialogForm-item-main">
              <InputText v-model="addForm.shxly" type="text" placeholder="" />
            </div>
          </div>
          <div class="dialogForm-item">
            <span class="dialogForm-item-title">山洪灾害小流域编码:</span>
            <div class="dialogForm-item-main">
              <InputText v-model="addForm.shxlym" type="text" placeholder="" />
            </div>
          </div>
        </div>
        <p class="title t2">辅助信息</p>
        <div class="dialogForm-row">
          <div class="dialogForm-item">
            <span class="dialogForm-item-title"> 主从站信息: </span>
            <div class="dialogForm-item-main">
              <InputText v-model="addForm.zcxx" type="text" placeholder="" />
            </div>
          </div>
          <div class="dialogForm-item">
            <span class="dialogForm-item-title">低水站信息:</span>
            <div class="dialogForm-item-main">
              <InputText v-model="addForm.zdxx" type="text" placeholder="" />
            </div>
          </div>
        </div>
        <div class="dialogForm-row">
          <div class="dialogForm-item">
            <span class="dialogForm-item-title"> 其他辅助站信息: </span>
            <div class="dialogForm-item-main">
              <InputText v-model="addForm.fzxx" type="text" placeholder="" />
            </div>
          </div>
          <div class="dialogForm-item"></div>
        </div>
        <p class="title">传感器模块信息</p>
        <p class="title t2">雨量传感器</p>
        <div class="dialogForm-row">
          <div class="dialogForm-item">
            <span class="dialogForm-item-title"> 生产厂家: </span>
            <div class="dialogForm-item-main">
              <!-- <InputText v-model="addForm.ylsccj" type="text" placeholder="" /> -->
              <Select v-model="addForm.ylsccj" :options="selectData.ylsccj" optionLabel="name" optionValue="name" @update:modelValue="changeYijiValue(addForm.ylsccj, selectData.ylsccj, 'ylxh')" style="width: 285px;" />
            </div>
          </div>
          <div class="dialogForm-item">
            <span class="dialogForm-item-title">型号:</span>
            <div class="dialogForm-item-main">
              <!-- <InputText v-model="addForm.ylxh" type="text" placeholder="" /> -->
              <Select v-model="addForm.ylxh" :options="form.ylxh" optionLabel="name" optionValue="name" @update:modelValue="changeErjiValue(addForm.ylxh, form.ylxh, 'yllx')" style="width: 285px;" />
            </div>
          </div>
        </div>
        <div class="dialogForm-row">
          <div class="dialogForm-item">
            <span class="dialogForm-item-title"> 类型: </span>
            <div class="dialogForm-item-main">
              <InputText v-model="addForm.yllx" type="text" placeholder="" />
              <!-- <Select v-model="addForm.yllx" :options="form.yllx" optionLabel="name" optionValue="name" style="width: 285px;" /> -->
            </div>
          </div>
          <div class="dialogForm-item">
            <span class="dialogForm-item-title">测量误差:</span>
            <div class="dialogForm-item-main">
              <InputText v-model="addForm.ylwc" type="text" placeholder="" />
            </div>
          </div>
        </div>
        <div class="dialogForm-row">
          <div class="dialogForm-item">
            <span class="dialogForm-item-title"> 雨量计装配时间（年/月/日）: </span>
            <div class="dialogForm-item-main">
              <!-- <InputText v-model="addForm.yltm" type="text" placeholder="" /> -->
              <DatePicker v-model="addForm.yltm" dateFormat="yymmdd" class="w285" :manualInput="true" @input="handleInput($event, 'yltm')" />
            </div>
          </div>
          <div class="dialogForm-item"></div>
        </div>
        <p class="title t2">水位传感器</p>
        <div class="dialogForm-row">
          <div class="dialogForm-item">
            <span class="dialogForm-item-title"> 水位计1生产厂家: </span>
            <div class="dialogForm-item-main">
              <!-- <InputText v-model="addForm.swonecj" type="text" placeholder="" /> -->
              <Select v-model="addForm.swonecj" :options="selectData.swcj" optionLabel="name" optionValue="name" @update:modelValue="changeYijiValue(addForm.swonecj, selectData.swcj, 'swonexh')" style="width: 285px;" />
            </div>
          </div>
          <div class="dialogForm-item">
            <span class="dialogForm-item-title">水位计1型号:</span>
            <div class="dialogForm-item-main">
              <!-- <InputText v-model="addForm.swonexh" type="text" placeholder="" /> -->
              <Select v-model="addForm.swonexh" :options="form.swonexh" optionLabel="name" optionValue="name" @update:modelValue="changeErjiValue(addForm.swonexh, form.swonexh, 'swonelx')" style="width: 285px;" />
            </div>
          </div>
        </div>
        <div class="dialogForm-row">
          <div class="dialogForm-item">
            <span class="dialogForm-item-title"> 水位计1类型: </span>
            <div class="dialogForm-item-main">
              <InputText v-model="addForm.swonelx" type="text" placeholder="" />
            </div>
          </div>
          <div class="dialogForm-item">
            <span class="dialogForm-item-title">水位计1装配时间（年/月/日）:</span>
            <div class="dialogForm-item-main">
              <!-- <InputText v-model="addForm.swonetm" type="text" placeholder="" /> -->
              <DatePicker v-model="addForm.swonetm" dateFormat="yymmdd" class="w285" :manualInput="true" @input="handleInput($event, 'swonetm')" />
            </div>
          </div>
        </div>
        <div class="dialogForm-row">
          <div class="dialogForm-item">
            <span class="dialogForm-item-title"> 水位计2生产厂家: </span>
            <div class="dialogForm-item-main">
              <!-- <InputText v-model="addForm.swtwocj" type="text" placeholder="" /> -->
              <Select v-model="addForm.swtwocj" :options="selectData.swcj" optionLabel="name" optionValue="name" @update:modelValue="changeYijiValue(addForm.swtwocj, selectData.swcj, 'swtwoxh')" style="width: 285px;" />
            </div>
          </div>
          <div class="dialogForm-item">
            <span class="dialogForm-item-title">水位计2型号:</span>
            <div class="dialogForm-item-main">
              <!-- <InputText v-model="addForm.swtwoxh" type="text" placeholder="" /> -->
              <Select v-model="addForm.swtwoxh" :options="form.swtwoxh" optionLabel="name" optionValue="name" @update:modelValue="changeErjiValue(addForm.swtwoxh, form.swtwoxh, 'swtwolx')" style="width: 285px;" />
            </div>
          </div>
        </div>
        <div class="dialogForm-row">
          <div class="dialogForm-item">
            <span class="dialogForm-item-title"> 水位计2类型: </span>
            <div class="dialogForm-item-main">
              <InputText v-model="addForm.swtwolx" type="text" placeholder="" />
            </div>
          </div>
          <div class="dialogForm-item">
            <span class="dialogForm-item-title">水位计2装配时间（年/月/日）:</span>
            <div class="dialogForm-item-main">
              <!-- <InputText v-model="addForm.swtwotm" type="text" placeholder="" /> -->
              <DatePicker v-model="addForm.swtwotm" dateFormat="yymmdd" class="w285" :manualInput="true" @input="handleInput($event, 'swtwotm')" />
            </div>
          </div>
        </div>
        <div class="dialogForm-row">
          <div class="dialogForm-item">
            <span class="dialogForm-item-title"> 最高可测水位值（m）: </span>
            <div class="dialogForm-item-main">
              <InputText v-model="addForm.zgsw" type="text" placeholder="" />
            </div>
          </div>
          <div class="dialogForm-item">
            <span class="dialogForm-item-title">是否满足防汛监测需要:</span>
            <div class="dialogForm-item-main">
              <InputText v-model="addForm.zgfxjc" type="text" placeholder="" />
            </div>
          </div>
        </div>
        <div class="dialogForm-row">
          <div class="dialogForm-item">
            <span class="dialogForm-item-title"> 最低可测水位值（m）: </span>
            <div class="dialogForm-item-main">
              <InputText v-model="addForm.zdsw" type="text" placeholder="" />
            </div>
          </div>
          <div class="dialogForm-item">
            <span class="dialogForm-item-title">是否满足抗旱监测需要:</span>
            <div class="dialogForm-item-main">
              <InputText v-model="addForm.zdfxjc" type="text" placeholder="" />
            </div>
          </div>
        </div>
        <p class="title t2">墒情传感器</p>
        <div class="dialogForm-row">
          <div class="dialogForm-item">
            <span class="dialogForm-item-title"> 墒情传感器生产厂家: </span>
            <div class="dialogForm-item-main">
              <!-- <InputText v-model="addForm.sqcj" type="text" placeholder="" /> -->
              <Select v-model="addForm.sqcj" :options="selectData.sqcj" optionLabel="name" optionValue="name" @update:modelValue="changeYijiValue(addForm.sqcj, selectData.sqcj, 'sqxh')" style="width: 285px;" />
            </div>
          </div>
          <div class="dialogForm-item">
            <span class="dialogForm-item-title">墒情传感器型号:</span>
            <div class="dialogForm-item-main">
              <!-- <InputText v-model="addForm.sqxh" type="text" placeholder="" /> -->
              <Select v-model="addForm.sqxh" :options="form.sqxh" optionLabel="name" optionValue="name" @update:modelValue="changeErjiValue(addForm.sqxh, form.sqxh, 'sqlx')" style="width: 285px;" />
            </div>
          </div>
        </div>
        <div class="dialogForm-row">
          <div class="dialogForm-item">
            <span class="dialogForm-item-title"> 墒情传感器类型: </span>
            <div class="dialogForm-item-main">
              <InputText v-model="addForm.sqlx" type="text" placeholder="" />
            </div>
          </div>
          <div class="dialogForm-item">
            <span class="dialogForm-item-title">墒情传感器装配时间（年/月/日）:</span>
            <div class="dialogForm-item-main">
              <!-- <InputText v-model="addForm.sqtm" type="text" placeholder="" /> -->
              <DatePicker v-model="addForm.sqtm" dateFormat="yymmdd" class="w285" :manualInput="true" @input="handleInput($event, 'sqtm')" />
            </div>
          </div>
        </div>
        <p class="title">遥测终端机（RTU）模块信息</p>
        <p class="title t2">硬件情况</p>
        <div class="dialogForm-row">
          <div class="dialogForm-item">
            <span class="dialogForm-item-title"> 生产厂家: </span>
            <div class="dialogForm-item-main">
              <!-- <InputText v-model="addForm.rtucj" type="text" placeholder="" /> -->
              <Select v-model="addForm.rtucj" :options="selectData.rtucj" optionLabel="name" optionValue="name" @update:modelValue="changeYijiValue(addForm.rtucj, selectData.rtucj, 'rtuxh')" style="width: 285px;" />
            </div>
          </div>
          <div class="dialogForm-item">
            <span class="dialogForm-item-title">型号:</span>
            <div class="dialogForm-item-main">
              <!-- <InputText v-model="addForm.rtuxh" type="text" placeholder="" /> -->
              <Select v-model="addForm.rtuxh" :options="form.rtuxh" optionLabel="name" optionValue="name" style="width: 285px;" />
            </div>
          </div>
        </div>
        <div class="dialogForm-row">
          <div class="dialogForm-item">
            <span class="dialogForm-item-title"> RTU装配时间（年/月/日）: </span>
            <div class="dialogForm-item-main">
              <!-- <InputText v-model="addForm.rtutm" type="text" placeholder="" /> -->
              <DatePicker v-model="addForm.rtutm" dateFormat="yymmdd" class="w285" :manualInput="true" @input="handleInput($event, 'rtutm')" />
            </div>
          </div>
          <div class="dialogForm-item"></div>
        </div>
        <p class="title t2">软件情况</p>
        <div class="dialogForm-row">
          <div class="dialogForm-item">
            <span class="dialogForm-item-title">当前软件版本号:</span>
            <div class="dialogForm-item-main">
              <InputText v-model="addForm.rjbbh" type="text" placeholder="" />
            </div>
          </div>
          <div class="dialogForm-item"></div>
        </div>
        <p class="title">通信模块信息</p>
        <p class="title t2">短波通信</p>
        <div class="dialogForm-row">
          <div class="dialogForm-item">
            <span class="dialogForm-item-title"> 短波/超短波: </span>
            <div class="dialogForm-item-main">
              <InputText v-model="addForm.duanbo" type="text" placeholder="" />
            </div>
          </div>
          <div class="dialogForm-item"></div>
        </div>
        <p class="title t2">移动通信</p>
        <div class="dialogForm-row">
          <div class="dialogForm-item">
            <span class="dialogForm-item-title">2G:</span>
            <div class="dialogForm-item-main">
              <InputText v-model="addForm.twog" type="text" placeholder="" />
            </div>
          </div>
          <div class="dialogForm-item">
            <span class="dialogForm-item-title"> 4G/5G: </span>
            <div class="dialogForm-item-main">
              <InputText v-model="addForm.fourg" type="text" placeholder="" />
            </div>
          </div>
        </div>
        <div class="dialogForm-row">
          <div class="dialogForm-item">
            <span class="dialogForm-item-title">通信服务商:</span>
            <div class="dialogForm-item-main">
              <InputText v-model="addForm.txfws" type="text" placeholder="" />
            </div>
          </div>
          <div class="dialogForm-item">
            <span class="dialogForm-item-title"> 是否是物联网卡: </span>
            <div class="dialogForm-item-main">
              <InputText v-model="addForm.wlwk" type="text" placeholder="" />
            </div>
          </div>
        </div>
        <div class="dialogForm-row">
          <div class="dialogForm-item">
            <span class="dialogForm-item-title">通信卡号码:</span>
            <div class="dialogForm-item-main">
              <InputText v-model="addForm.txkhm" type="text" placeholder="" />
            </div>
          </div>
          <div class="dialogForm-item">
            <span class="dialogForm-item-title"> 遥测站码: </span>
            <div class="dialogForm-item-main">
              <InputText v-model="addForm.yczm" type="text" placeholder="" />
            </div>
          </div>
        </div>
        <p class="title t2">卫星通信</p>
        <div class="dialogForm-row">
          <div class="dialogForm-item">
            <span class="dialogForm-item-title">北斗信道测站编码:</span>
            <div class="dialogForm-item-main">
              <InputText v-model="addForm.bdstcd" type="text" placeholder="" />
            </div>
          </div>
          <div class="dialogForm-item">
            <span class="dialogForm-item-title">北斗卡号:</span>
            <div class="dialogForm-item-main">
              <InputText v-model="addForm.bdkh" type="text" placeholder="" />
            </div>
          </div>
        </div>
        <div class="dialogForm-row">
          <div class="dialogForm-item">
            <span class="dialogForm-item-title"> 北斗卫星（二号系统）: </span>
            <div class="dialogForm-item-main">
              <InputText v-model="addForm.bdtwo" type="text" placeholder="" />
            </div>
          </div>
          <div class="dialogForm-item">
            <span class="dialogForm-item-title">北斗卫星（三号系统）:</span>
            <div class="dialogForm-item-main">
              <InputText v-model="addForm.bdthree" type="text" placeholder="" />
            </div>
          </div>
        </div>
        <div class="dialogForm-row">
          <div class="dialogForm-item">
            <span class="dialogForm-item-title"> 北斗卫星通信终端生产厂家: </span>
            <div class="dialogForm-item-main">
              <!-- <InputText v-model="addForm.bdcj" type="text" placeholder="" /> -->
              <Select v-model="addForm.bdcj" :options="selectData.bdcj" optionLabel="name" optionValue="name" @update:modelValue="changeYijiValue(addForm.bdcj, selectData.bdcj, 'bdxh')" style="width: 285px;" />
            </div>
          </div>
          <div class="dialogForm-item">
            <span class="dialogForm-item-title"> 北斗卫星通信终端型号:</span>
            <div class="dialogForm-item-main">
              <!-- <InputText v-model="addForm.bdxh" type="text" placeholder="" /> -->
              <Select v-model="addForm.bdxh" :options="form.bdxh" optionLabel="name" optionValue="name" style="width: 285px;" />
            </div>
          </div>
        </div>
        <div class="dialogForm-row">
          <div class="dialogForm-item">
            <span class="dialogForm-item-title"> 北斗卫星通信终端装配时间（年/月/日）: </span>
            <div class="dialogForm-item-main">
              <!-- <InputText v-model="addForm.bdtm" type="text" placeholder="" /> -->
              <DatePicker v-model="addForm.bdtm" dateFormat="yymmdd" class="w285" :manualInput="true" @input="handleInput($event, 'bdtm')" />
            </div>
          </div>
          <div class="dialogForm-item">
            <span class="dialogForm-item-title"> 卫星信道通信增值服务费到期时间（年/月/日）:</span>
            <div class="dialogForm-item-main">
              <!-- <InputText v-model="addForm.wxtm" type="text" placeholder="" /> -->
              <DatePicker v-model="addForm.wxtm" dateFormat="yymmdd" class="w285" :manualInput="true" @input="handleInput($event, 'wxtm')" />
            </div>
          </div>
        </div>
        <div class="dialogForm-row">
          <div class="dialogForm-item">
            <span class="dialogForm-item-title"> 卫星信道通信增值服务费缴纳主体: </span>
            <div class="dialogForm-item-main">
              <InputText v-model="addForm.wxzt" type="text" placeholder="" />
            </div>
          </div>
          <div class="dialogForm-item">
            <span class="dialogForm-item-title"> 卫星信道通信增值服务费缴纳对象:</span>
            <div class="dialogForm-item-main">
              <InputText v-model="addForm.wxdx" type="text" placeholder="" />
            </div>
          </div>
        </div>
        <p class="title t2">上一级通信节点名称</p>
        <div class="dialogForm-row">
          <div class="dialogForm-item">
            <span class="dialogForm-item-title"> 短波/超短波（或其他短传信道）通信目的地名称: </span>
            <div class="dialogForm-item-main">
              <InputText v-model="addForm.txdmc" type="text" placeholder="" />
            </div>
          </div>
          <div class="dialogForm-item">
            <span class="dialogForm-item-title"> 移动通信第一目的地名称:</span>
            <div class="dialogForm-item-main">
              <InputText v-model="addForm.ydtxone" type="text" placeholder="" />
            </div>
          </div>
        </div>
        <div class="dialogForm-row">
          <div class="dialogForm-item">
            <span class="dialogForm-item-title"> 移动通信第二目的地名称: </span>
            <div class="dialogForm-item-main">
              <InputText v-model="addForm.ydtxtwo" type="text" placeholder="" />
            </div>
          </div>
          <div class="dialogForm-item">
            <span class="dialogForm-item-title"> 卫星通信:</span>
            <div class="dialogForm-item-main">
              <InputText v-model="addForm.wxtx" type="text" placeholder="" />
            </div>
          </div>
        </div>
        <p class="title t2">供电模块信息</p>
        <div class="dialogForm-row">
          <div class="dialogForm-item">
            <span class="dialogForm-item-title"> 市电: </span>
            <div class="dialogForm-item-main">
              <InputText v-model="addForm.sd" type="text" placeholder="" />
            </div>
          </div>
          <div class="dialogForm-item">
            <span class="dialogForm-item-title"> 蓄电池:</span>
            <div class="dialogForm-item-main">
              <InputText v-model="addForm.xdc" type="text" placeholder="" />
            </div>
          </div>
        </div>
        <p class="title t2">蓄电池及浮充情况</p>
        <div class="dialogForm-row">
          <div class="dialogForm-item">
            <span class="dialogForm-item-title"> 电池类型: </span>
            <div class="dialogForm-item-main">
              <InputText v-model="addForm.dclx" type="text" placeholder="" />
            </div>
          </div>
          <div class="dialogForm-item">
            <span class="dialogForm-item-title"> 电池规格:</span>
            <div class="dialogForm-item-main">
              <InputText v-model="addForm.dcgg" type="text" placeholder="" />
            </div>
          </div>
        </div>
        <div class="dialogForm-row">
          <div class="dialogForm-item">
            <span class="dialogForm-item-title"> 当前电池装配时间（年/月/日）: </span>
            <div class="dialogForm-item-main">
              <!-- <InputText v-model="addForm.dctm" type="text" placeholder="" /> -->
              <DatePicker v-model="addForm.dctm" dateFormat="yymmdd" class="w285" :manualInput="true" @input="handleInput($event, 'dctm')" />
            </div>
          </div>
          <div class="dialogForm-item">
            <span class="dialogForm-item-title"> 太阳能充电板规格:</span>
            <div class="dialogForm-item-main">
              <InputText v-model="addForm.tyngg" type="text" placeholder="" />
            </div>
          </div>
        </div>
        <div class="dialogForm-row">
          <div class="dialogForm-item">
            <span class="dialogForm-item-title"> 太阳能充电控制器安装方式: </span>
            <div class="dialogForm-item-main">
              <InputText v-model="addForm.tynfs" type="text" placeholder="" />
            </div>
          </div>
          <div class="dialogForm-item">
            <span class="dialogForm-item-title"> 太阳能充电控制器额定充电电流:</span>
            <div class="dialogForm-item-main">
              <InputText v-model="addForm.tyndl" type="text" placeholder="" />
            </div>
          </div>
        </div>
        <p class="title">辅助模块信息</p>
        <p class="title t2">防雷形式</p>
        <div class="dialogForm-row">
          <div class="dialogForm-item">
            <span class="dialogForm-item-title"> 接地防雷: </span>
            <div class="dialogForm-item-main">
              <InputText v-model="addForm.jdfl" type="text" placeholder="" />
            </div>
          </div>
          <div class="dialogForm-item">
            <span class="dialogForm-item-title"> 悬浮式避雷:</span>
            <div class="dialogForm-item-main">
              <InputText v-model="addForm.xfsbl" type="text" placeholder="" />
            </div>
          </div>
        </div>
        <p class="title">承建单位</p>
        <div class="dialogForm-row">
          <div class="dialogForm-item">
            <span class="dialogForm-item-title"> 承建单位: </span>
            <div class="dialogForm-item-main">
              <!-- <InputText v-model="addForm.cjdw" type="text" placeholder="" /> -->
              <Select v-model="addForm.cjdw" :options="selectData.cjdw" optionLabel="name" optionValue="name" style="width: 285px;" />
            </div>
          </div>
          <div class="dialogForm-item">
            
          </div>
        </div>
        <p class="title">运维单位</p>
        <div class="dialogForm-row">
          <div class="dialogForm-item">
            <span class="dialogForm-item-title"> 运维单位: </span>
            <div class="dialogForm-item-main">
              <InputText v-model="addForm.ywdw" type="text" placeholder="" />
            </div>
          </div>
          <div class="dialogForm-item">
            
          </div>
        </div>
        <p class="title">所属项目</p>
        <div class="dialogForm-row">
          <div class="dialogForm-item">
            <span class="dialogForm-item-title"> 项目名称: </span>
            <div class="dialogForm-item-main">
              <!-- <InputText v-model="addForm.xmmc" type="text" placeholder="" /> -->
              <Select v-model="addForm.xmmc" :options="selectData.xmmc" optionLabel="name" optionValue="name" @update:modelValue="changeErjiValue(addForm.xmmc, selectData.xmmc, 'xmbh')" style="width: 285px;" />
            </div>
          </div>
          <div class="dialogForm-item">
            <span class="dialogForm-item-title"> 项目编号: </span>
            <div class="dialogForm-item-main">
              <InputText v-model="addForm.xmbh" type="text" placeholder="" />
            </div>
          </div>
        </div>
        <div class="dialogForm-row">
          <div class="dialogForm-item">
            <span class="dialogForm-item-title"> 免费质保服务到期时间（年/月/日）: </span>
            <div class="dialogForm-item-main">
              <!-- <InputText v-model="addForm.mztm" type="text" placeholder="" /> -->
              <DatePicker v-model="addForm.mztm" dateFormat="yymmdd" class="w285" :manualInput="true" @input="handleInput($event, 'mztm')" />
            </div>
          </div>
          <div class="dialogForm-item">
           
          </div>
        </div>
        <p class="title">升级改造计划</p>
        <div class="dialogForm-row">
          <div class="dialogForm-item">
            <span class="dialogForm-item-title"> 计划升级改造所属项目名称: </span>
            <div class="dialogForm-item-main">
              <InputText v-model="addForm.sjmc" type="text" placeholder="" />
            </div>
          </div>
          <div class="dialogForm-item">
            <span class="dialogForm-item-title"> 计划升级改造所属项目实施时间（年/月/日）: </span>
            <div class="dialogForm-item-main">
              <!-- <InputText v-model="addForm.sjtm" type="text" placeholder="" /> -->
              <DatePicker v-model="addForm.sjtm" dateFormat="yymmdd" class="w285" :manualInput="true" @input="handleInput($event, 'sjtm')" />
            </div>
          </div>
        </div>
        <p class="title">遥测设备首次装配时间</p>
        <div class="dialogForm-row">
          <div class="dialogForm-item">
            <span class="dialogForm-item-title"> 时间（年/月/日）: </span>
            <div class="dialogForm-item-main">
              <!-- <InputText v-model="addForm.yctm" type="text" placeholder="" /> -->
              <DatePicker v-model="addForm.yctm" dateFormat="yymmdd" class="w285" :manualInput="true" @input="handleInput($event, 'yctm')" />
            </div>
          </div>
          <div class="dialogForm-item">
     
          </div>
        </div>
        <p class="title">遥测站图片（最新拍摄原图，应包含拍摄时间，缩放至合适尺寸）</p>
        <div class="dialogForm-row">
          <div class="dialogForm-item">
            <span class="dialogForm-item-title"> 观测环境: </span>
            <div class="dialogForm-item-main">
              <InputText v-model="addForm.gchj" type="text" placeholder="" />
            </div>
          </div>
          <div class="dialogForm-item">
            <span class="dialogForm-item-title"> 站点全貌: </span>
            <div class="dialogForm-item-main">
              <InputText v-model="addForm.zdqm" type="text" placeholder="" />
            </div>
          </div>
        </div>
        <div class="dialogForm-row">
          <div class="dialogForm-item">
            <span class="dialogForm-item-title"> 雨量计: </span>
            <div class="dialogForm-item-main">
              <InputText v-model="addForm.ylj" type="text" placeholder="" />
            </div>
          </div>
          <div class="dialogForm-item">
            <span class="dialogForm-item-title"> 水位计1: </span>
            <div class="dialogForm-item-main">
              <InputText v-model="addForm.swjone" type="text" placeholder="" />
            </div>
          </div>
        </div>
        <div class="dialogForm-row">
          <div class="dialogForm-item">
            <span class="dialogForm-item-title"> 水位计2: </span>
            <div class="dialogForm-item-main">
              <InputText v-model="addForm.swjtwo" type="text" placeholder="" />
            </div>
          </div>
          <div class="dialogForm-item">
            <span class="dialogForm-item-title"> RTU: </span>
            <div class="dialogForm-item-main">
              <InputText v-model="addForm.rtu" type="text" placeholder="" />
            </div>
          </div>
        </div>
        <div class="dialogForm-row">
          <div class="dialogForm-item">
            <span class="dialogForm-item-title"> 蓄电池: </span>
            <div class="dialogForm-item-main">
              <InputText v-model="addForm.xdctwo" type="text" placeholder="" />
            </div>
          </div>
          <div class="dialogForm-item">
            
          </div>
        </div>
        <p class="title">备注及其他</p>
        <div class="dialogForm-row">
          <div class="dialogForm-item">
            <span class="dialogForm-item-title"> 备注: </span>
            <div class="dialogForm-item-main">
              <InputText v-model="addForm.bz" type="text" placeholder="" />
            </div>
          </div>
          <div class="dialogForm-item">
            <span class="dialogForm-item-title"> 其他: </span>
            <div class="dialogForm-item-main">
              <InputText v-model="addForm.qt" type="text" placeholder="" />
            </div>
          </div>
        </div>
        <p class="title">填报质量控制</p>
        <div class="dialogForm-row">
          <div class="dialogForm-item">
            <span class="dialogForm-item-title"> 填报时间（年/月/日）: </span>
            <div class="dialogForm-item-main">
              <!-- <InputText v-model="addForm.tbtm" type="text" placeholder="" /> -->
              <DatePicker v-model="addForm.tbtm" dateFormat="yymmdd" class="w285" :manualInput="true" @input="handleInput($event, 'tbtm')" />
            </div>
          </div>
          <div class="dialogForm-item"></div>
        </div>
        <p class="title">填报人</p>
        <div class="dialogForm-row">
          <div class="dialogForm-item">
            <span class="dialogForm-item-title"> 姓名: </span>
            <div class="dialogForm-item-main">
              <InputText v-model="addForm.tbname" type="text" placeholder="" />
            </div>
          </div>
          <div class="dialogForm-item">
            <span class="dialogForm-item-title"> 联系方式: </span>
            <div class="dialogForm-item-main">
              <InputText v-model="addForm.tbtel" type="text" placeholder="" />
            </div>
          </div>
        </div>
        <p class="title">审核人</p>
        <div class="dialogForm-row">
          <div class="dialogForm-item">
            <span class="dialogForm-item-title"> 姓名: </span>
            <div class="dialogForm-item-main">
              <InputText v-model="addForm.shname" type="text" placeholder="" />
            </div>
          </div>
          <div class="dialogForm-item">
            <span class="dialogForm-item-title"> 联系方式: </span>
            <div class="dialogForm-item-main">
              <InputText v-model="addForm.shtel" type="text" placeholder="" />
            </div>
          </div>
          
        </div>
      </div>
      <template #footer>
        <Button label="取消" size="small" severity="secondary" @click="dialogVisible = false"
          style="padding-left: 25px; padding-right: 25px;margin-right: 15px;" />
        <Button label="提交" size="small" :disabled="isSubmiting" @click="handleSubmit"
          style="padding-left: 25px; padding-right: 25px;" />
      </template>
    </Dialog>
    <Dialog v-model:visible="dialogVisible_check" header="数据校核" :style="{ width: '1200px' }" maximizable modal
      :contentStyle="{ height: '650px' }">
      <ag-grid-vue
        class="ag-theme-alpine"
        style="flex: 1;height:100%;"
        :rowData="tableData_check"
        :columnDefs="columns_check"
        @grid-ready="onGridReady_check"
        :defaultColDef="defColOption"
        :getRowHeight="getRowHeight"
        :tooltipShowDelay="0"
        theme="legacy"
      >
      </ag-grid-vue>
      <!-- <template #footer>
        <Button label="取消" size="small" severity="secondary" @click="dialogVisible = false" style="padding: 5px 25px;margin-right: 15px;" />
        <Button label="提交" size="small" :disabled="isSubmiting" @click="handleSubmit" style="padding: 5px 25px;" />
      </template> -->
    </Dialog>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from "primevue/useconfirm";
import { AgGridVue } from "ag-grid-vue3";
import {columns, columns_pinned} from "./utils/columns.js";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

defineOptions({
  name: 'index'
})

const toast = useToast()
const confirm = useConfirm();

// const tableTheme = ref(themeBalham)
const tableData = ref([])
const column = ref([])
const isLoading = ref(false)
const dialogVisible = ref(false)
const isSubmiting = ref(false)
const detailTitle = ref('设备信息修改')
const permission = ref('');

// 校核数据
let gridApi_check;
const tableData_check = ref([])
const columns_check = ref([])
const dialogVisible_check = ref(false)
const remark = ref('');

let gridApi;
const defColOption = {
  sortable: false,
  suppressSizeToFit: true,
  // wrapText: true, 
  // autoHeight: true,
  // editable: true,
  editable: cellEditable,
  filter: "agSetColumnFilter"
}

const selectData = ref({})
const form = ref({
  ylxh: [], // 雨量传感器成产型号
  swonexh: [], // 水位传感器1型号
  swtwoxh: [], // 水位传感器2型号
  sqxh: [], // 墒情传感器型号
  rtuxh: [], // 遥测终端机rtu 型号
  bdxh: [], // 北斗卫星型号
})

const addForm = ref({
  // id: null,
  ssfzx: "",
  sszd: "",
  ycmc: "",shi: "",xian: "",shfzx: "",shxly: "",shxlym: "",
  sscz: "",ycxm: "",zcxx: "",zdxx: "",fzxx: "",ylsccj: "",ylxh: "",yllx: "",ylwc: "",yltm: "",swonecj: "",swonexh: "",swonelx: "",swonetm: "",
  swtwocj: "", swtwoxh: "",
  swtwolx: "", swtwotm: "",
  zgsw: "", zgfxjc: "",
  zdsw: "", zdfxjc: "", sqcj: "", sqxh: "", sqlx: "", sqtm: "", 
  rtucj: "", rtuxh: "", rtutm: "", rjbbh: "", duanbo: "", twog: "", fourg: "", txfws: "",
  wlwk: "", txkhm: "", yczm: "", bdstcd: "", bdkh: "", bdtwo: "", bdthree: "", bdcj: "", bdxh: "", bdtm: "", wxtm: "", wxzt: "",
  wxdx: "", txdmc: "", ydtxone: "", ydtxtwo: "", wxtx: "", 

  sd: "", dclx: "", xdc: "", dcgg: "",
  dctm: "", tyngg: "", tynfs: "", tyndl: "", 
  jdfl: "", xfsbl: "", cjdw: "", ywdw: "", xmmc: "", xmbh: "",
  mztm: "", sjmc: "", sjtm: "", yctm: "", 
  gchj: "", zdqm: "", ylj: "", swjone: "", swjtwo: "", rtu: "", xdctwo: "", 
  bz: "", qt: "", tbtm: "", tbname: "", tbtel: "", shname: "", shtel: "",
})

watch(() => dialogVisible_check.value, (newVal) => {
  if(!newVal) {
    getList()
  }
})

// 表格数据编辑
const paramsClick = async (data) => {
  let formData = JSON.parse(JSON.stringify(data));
  if(formData.ylsccj) {
    let params = selectData.value.ylsccj.find(item => item.name == formData.ylsccj);

    if(params?.id) form.value.ylxh = await updateErji(params.id)
  }
  if(formData.swonecj) {
    let params = selectData.value.swcj.find(item => item.name == formData.swonecj);

    if(params?.id) form.value.swonexh = await updateErji(params.id)
  }
  if(formData.swtwocj) {
    let params = selectData.value.swcj.find(item => item.name == formData.swtwocj);
    if(params?.id) form.value.swtwoxh = await updateErji(params.id)
  }
  if(formData.sqcj) {
    let params = selectData.value.sqcj.find(item => item.name == formData.sqcj);
    if(params?.id) form.value.sqxh = await updateErji(params.id)
  }
  if(formData.rtucj) {
    let params = selectData.value.rtucj.find(item => item.name == formData.rtucj);
    if(params?.id) form.value.rtuxh = await updateErji(params.id)
  }
  if(formData.bdcj) {
    let params = selectData.value.bdcj.find(item => item.name == formData.bdcj);
    if(params?.id) form.value.bdxh = await updateErji(params.id)
  }
  
  formData.yltm = (formData.yltm && formData.yltm != '无') ? new Date(dayjs(formData.yltm).format("YYYY-MM-DD")) : formData.yltm;
  formData.swonetm = (formData.swonetm && formData.swonetm != '无') ? new Date(dayjs(formData.swonetm).format("YYYY-MM-DD")) : formData.swonetm;
  formData.swtwotm = (formData.swtwotm && formData.swtwotm != '无') ? new Date(dayjs(formData.swtwotm).format("YYYY-MM-DD")) : formData.swtwotm;
  formData.sqtm = (formData.sqtm && formData.sqtm != '无') ? new Date(dayjs(formData.sqtm).format("YYYY-MM-DD")) : formData.sqtm;
  formData.rtutm = (formData.rtutm && formData.rtutm != '无') ? new Date(dayjs(formData.rtutm).format("YYYY-MM-DD")) : formData.rtutm;
  formData.bdtm = (formData.bdtm && formData.bdtm != '无') ? new Date(dayjs(formData.bdtm).format("YYYY-MM-DD")) : formData.bdtm;
  formData.wxtm = (formData.wxtm && formData.wxtm != '无') ? new Date(dayjs(formData.wxtm).format("YYYY-MM-DD")) : formData.wxtm;
  formData.dctm = (formData.dctm && formData.dctm != '无') ? new Date(dayjs(formData.dctm).format("YYYY-MM-DD")) : formData.dctm;
  formData.mztm = (formData.mztm && formData.mztm != '无') ? new Date(dayjs(formData.mztm).format("YYYY-MM-DD")) : formData.mztm;
  formData.sjtm = (formData.sjtm && formData.sjtm != '无') ? new Date(dayjs(formData.sjtm).format("YYYY-MM-DD")) : formData.sjtm;
  formData.yctm = (formData.yctm && formData.yctm != '无') ? new Date(dayjs(formData.yctm).format("YYYY-MM-DD")) : formData.yctm;
  formData.tbtm = (formData.tbtm && formData.tbtm != '无') ? new Date(dayjs(formData.tbtm).format("YYYY-MM-DD")) : formData.tbtm;
  
  addForm.value = formData;
  dialogVisible.value = true;
}

// 表给数据删除
const handleRemove = (data) => {
  if(!data) return;
  confirm.require({
    message: '是否确认删除?',
    icon: 'pi pi-info-circle',
    rejectProps: {
        label: '取消',
        severity: 'secondary',
        outlined: true
    },
    acceptProps: {
        label: '删除',
        severity: 'danger'
    },
    accept: () => {
      data.tailid = data.id;
      data.operation = 'D';
      
      axios.post('http://10.34.1.25:8010/cj/shebei/insertSheBeiReview', data).then(res => {
        if(res.data.code === 0) {
          toast.add({ severity:'success', summary: '数据添加审核中，等待审核', detail: '', group: 'cg', life: 3000 });
        } else {
          toast.add({ severity: 'warn', summary: res.data.msg, detail: '', group: 'tc', life: 3000 });
        }
      })
    },
    reject: () => {
      // toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
    }
  });
}

// 新增
const addModel = () => {
  addForm.value = {
    ssfzx: "",
    sszd: "",
    ycmc: "",shi: "",xian: "",shfzx: "",shxly: "",shxlym: "",
    sscz: "",ycxm: "",zcxx: "",zdxx: "",fzxx: "",ylsccj: "",ylxh: "",yllx: "",ylwc: "",yltm: "",swonecj: "",swonexh: "",swonelx: "",swonetm: "",
    swtwocj: "", swtwoxh: "",
    swtwolx: "", swtwotm: "",
    zgsw: "", zgfxjc: "",
    zdsw: "", zdfxjc: "", sqcj: "", sqxh: "", sqlx: "", sqtm: "", 
    rtucj: "", rtuxh: "", rtutm: "", rjbbh: "", duanbo: "", twog: "", fourg: "", txfws: "",
    wlwk: "", txkhm: "", yczm: "", bdstcd: "", bdkh: "", bdtwo: "", bdthree: "", bdcj: "", bdxh: "", bdtm: "", wxtm: "", wxzt: "",
    wxdx: "", txdmc: "", ydtxone: "", ydtxtwo: "", wxtx: "", 
    sd: "", dclx: "", xdc: "", dcgg: "",
    dctm: "", tyngg: "", tynfs: "", tyndl: "", 
    jdfl: "", xfsbl: "", cjdw: "", ywdw: "", xmmc: "", xmbh: "",
    mztm: "", sjmc: "", sjtm: "", yctm: "", 
    gchj: "", zdqm: "", ylj: "", swjone: "", swjtwo: "", rtu: "", xdctwo: "", 
    bz: "", qt: "", tbtm: "", tbname: "", tbtel: "", shname: "", shtel: "",
  };
  dialogVisible.value = true;
}

const updateRemark = (data) => {
  axios.post('http://10.34.1.25:8010/cj/shebei/updateRemark', {id: data.id, remark: data.remark}).then(res => {
      
  })
}

// 审核-批准
const handleApprove = (data, isSecondCheck) => {
  if(isSecondCheck) {
    axios.post("http://10.34.1.25:8010/cj/shebei//agreeSheBeiSecondReview", data).then(res => {
      if(res.data.code === 0) {
        toast.add({ severity:'success', summary: '批准成功', detail: '', group: 'cg', life: 3000 });
        toSecondCheck();
      }
    });
  } else {
    axios.post("http://10.34.1.25:8010/cj/shebei/agreeSheBeiReview", data).then(res => {
      if(res.data.code === 0) {
        toast.add({ severity:'success', summary: '批准成功', detail: '', group: 'cg', life: 3000 });
        toCheck();

        updateRemark({id: data.tailid, remark: ''})
        // dialogVisible.value = false;
      }
    });
  }
}

// 审核-拒绝
const handleReject = (data, isSecondCheck) => {
  if(isSecondCheck) {
    axios.post("http://10.34.1.25:8010/cj/shebei/deleteSheBeiSecondReview", {id: data.id}).then(res => {
      if(res.data.code === 0) {
        toast.add({ severity:'success', summary: '删除成功', detail: '', group: 'cg', life: 3000 });
        toSecondCheck();
      }
    });
    return;
  }
  confirm.require({ 
    group: 'headless', 
    message: '请输入拒绝原因?',
    rejectProps: {
      icon: 'pi pi-times',
      label: '取消',
      outlined: true
    },
    acceptProps: {
      icon: 'pi pi-check',
      label: '提交'
    },
    accept: () => {
      if(!remark.value) {
        return  toast.add({ severity: 'warn', summary: '请输入拒绝原因', detail: '', group: 'tc', life: 3000 });
      }

      axios.post("http://10.34.1.25:8010/cj/shebei/deleteSheBeiReview", {id: data.id}).then(res => {
        if(res.data.code === 0) {
          toast.add({ severity:'success', summary: '删除成功', detail: '', group: 'cg', life: 3000 });
          toCheck();

          updateRemark({id: data.tailid, remark: remark.value});
          // dialogVisible_check.value = false;
        }
      });
    },
    reject: () => {
      remark.value = '';
    }
  })
  // if(!data.id) return
  
}

const handleModify = (data) => {
  axios.post("http://10.34.1.25:8010/cj/shebei/insertSheBeiSecondReview", data).then(res => {
    if (res.data.code === 0) {
      toast.add({ severity:'success', summary: '错误修改成功', detail: '', group: 'cg', life: 3000 });

      toCheck();
    }
  })
}

const colDef = {
  headerName: '操作', 
  pinned: 'right', width: 150,
  cellRenderer: 'OrpActions',
  cellRendererParams: { 
    params: {
      view: paramsClick,
      remove: handleRemove
    }
  }
};
const colDef_check = {
  headerName: '操作', 
  pinned: 'right', width: 200,
  cellRenderer: 'BtnActions',
  cellRendererParams: {
    type: ['批准', '拒绝', '错误修改'],
    isSecondCheck: false,
    params: {
      approve: handleApprove,
      reject: handleReject,
      modify: handleModify,
    }
  }
};
const colDef_SecondCheck = {
  headerName: '操作', 
  pinned: 'right', width: 130,
  cellRenderer: 'BtnActions',
  cellRendererParams: {
    type: ['批准', '拒绝'],
    isSecondCheck: true,
    params: {
      approve: handleApprove,
      reject: handleReject
    }
  }
};
const pinnedTopRowData = ref([])

// 限制只能编辑 备注
function cellEditable(params) {
  return params.data.index === '注'; // 只允许编辑第一行
}
// 调整行高
const getRowHeight = (params) => {
  return params.data.index == "注" ? 160 : 40
}

const rowClassRules = ref({
  "text-red": (params)  => {
    return params.data.bdcj === '必填';
  },
  'bg-red': (params) => {
    return params.data.remark && (params.data.remark !== null);
  }
}) 

// 编辑备注信息
const stopEdit = (params) => {
  let { newValue, data, rowIndex} = params
  if (newValue) {
    newValue = newValue.trim()
  }

  axios.post('http://10.34.1.25:8010/cj/shebei/updateSheBeiBeiZhu', data).then(res => {
    if(res.data.code === 0) {
      toast.add({ severity: 'success', summary: '备注修改成功', detail: '', group: 'cg', life: 3000 });
    } else {
      toast.add({ severity: 'error', summary: '备注修改失败，请重试', detail: '', group: 'tc', life: 3000 });
    }
  }).catch(err => {
    toast.add({ severity: 'error', summary: '网络错误', detail: '', group: 'tc', life: 3000 });
    console.log(err);
  })
}

// 查询数据
const getList = async () => {
  tableData.value = [];
  pinnedTopRowData.value = [
    {
      ssfzx: "必填", sszd: "必填", shi: "必填", xian: "必填", shfzx: "必填", shxly: "必填", shxlym: "必填", ycmc: "必填", sscz: "必填",ycxm: "必填",zcxx: "必填",zdxx: "必填",fzxx: "必填",ylsccj: "必填",ylxh: "必填",
      yllx: "",ylwc: "必填",yltm: "必填",swonecj: "必填",swonexh: "必填",swonelx: "",swonetm: "必填",swtwocj: "必填", swtwoxh: "必填",
      swtwolx: "", swtwotm: "必填", zgsw: "必填", zgfxjc: "必填",
      zdsw: "必填", zdfxjc: "必填", sqcj: "必填", sqxh: "必填", sqlx: "", sqtm: "必填", 
      rtucj: "必填", rtuxh: "必填", rtutm: "必填", rjbbh: "必填", duanbo: "必填", twog: "必填", fourg: "必填", txfws: "必填",
      wlwk: "必填", txkhm: "必填", yczm: "必填", bdstcd: "必填", bdkh: "必填", bdtwo: "必填", bdthree: "必填", bdcj: "必填", bdxh: "必填", bdtm: "必填", wxtm: "必填", wxzt: "必填",
      wxdx: "必填", txdmc: "必填", ydtxone: "必填", ydtxtwo: "必填", wxtx: "必填", 
      sd: "必填", dclx: "必填", xdc: "必填", dcgg: "必填",
      dctm: "必填", tyngg: "必填", tynfs: "必填", tyndl: "必填", 
      jdfl: "必填", xfsbl: "必填", cjdw: "必填", ywdw: "必填", xmmc: "必填", xmbh: "必填",
      mztm: "必填", sjmc: "必填", sjtm: "必填", yctm: "必填", 
      gchj: "选填", zdqm: "选填", ylj: "选填", swjone: "选填", swjtwo: "选填", rtu: "选填", xdctwo: "选填", 
      bz: "选填", qt: "选填", tbtm: "必填", tbname: "必填", tbtel: "必填", shname: "必填", shtel: "必填",
    }
  ];
  permission.value = '';
  isLoading.value = true;
  column.value = [...columns_pinned, colDef];

  try {
    let user = localStorage.getItem('userid');
    // user = user.replace(/[^a-zA-Z0-9]/g, '');
    
    const response1 = await axios.get(`http://10.34.1.25:8010/cj/shebei/getSheBeiTail?userid=${user}`);
    if(response1.data.code === 0) {
      permission.value = response1.data.msg;
      tableData.value = response1.data.data.map((item, index) => {
        return {
          ...item,
          index: String(index + 1),
        }
      });
    }

    const response2 = await axios.get("http://10.34.1.25:8010/cj/shebei/getSheBeiBeiZhu");
    if(response2.data.code === 0) {
      pinnedTopRowData.value.push({index: '注', ...response2.data.data})
    }
    isLoading.value = false;
    
  } catch {
    toast.add({ severity: 'error', summary: '查询失败，请重试', detail: '', group: 'tc', life: 3000 });
  }
}
getList()

// 查询下拉菜单
const updateErji = (id) => {
  return axios.get(`http://10.34.1.25:8010/cj/shebei/getYaoCeKuByBid?bid=${id}`).then(res => {
    if(res.data.code === 0) {
      return res.data.data
    }
    return []
  });
}

const changeYijiValue = async (value, option, key) => {
  let params = option.find(item => item.name === value);

  form.value[key] = await updateErji(params.id)
}

const changeErjiValue = async (value, option, key) => {
  let params = option.find(item => item.name === value);
  let data = await updateErji(params.id);

  addForm.value[key] = data[0].name;
}

const init = () => {
  axios.get("http://10.34.1.25:8010/cj/shebei/getYaoCeKu").then(res => {
    if(res.data.code === 0) {
      selectData.value = res.data.data;
    }
  })
}
init()

function getOldAndNewValue(params) {
  return !params.colDef.noCellStyle && params.data.isEdit && params.value !== params.data.isEdit[params?.colDef?.field]
}

function cellStyle(params) {
  if (getOldAndNewValue(params)) {
    return {backgroundColor: '#e57c7c', color: "#fff"};
  }
  return null;
}

function setCellStyle(columns) {
  columns.forEach(item => {
    item.cellStyle = params => cellStyle(params)
    item.tooltipValueGetter = params => getOldAndNewValue(params) ? '原始数据：' + params.data.isEdit[params?.colDef?.field] : ''
    if (item.children) {
      return setCellStyle(item.children)
    }
  })
}

// 查询待审核数据
const toCheck = () => {
  dialogVisible_check.value = true;
  setCellStyle(columns)
  columns_check.value = [...columns];
  if(permission.value == 'admin') {
    columns_check.value.push({...colDef_check})
  }

  axios.get("http://10.34.1.25:8010/cj/shebei/getSheBeiReview").then(res => {
    if(res.data.code === 0) {
      tableData_check.value = res.data.data.map((item, index) => {
        return {
          ...item,
          index: index + 1
        }
      });
    }
  })
}

const toSecondCheck = () => {
  dialogVisible_check.value = true;
  setCellStyle(columns)
  columns_check.value = [...columns];
  if(permission.value == 'admin') {
    columns_check.value.push({...colDef_SecondCheck})
  }

  axios.get("http://10.34.1.25:8010/cj/shebei/getSheBeiReviewSecond").then(res => {
    if(res.data.code === 0) {
      tableData_check.value = res.data.data.map((item, index) => {
        return {
          ...item,
          index: index + 1
        }
      });
    }
  })
}

// 导出
const handleExport = () => {
  let headers = addDataToNestedArray(JSON.parse(JSON.stringify(column.value)));
  let rowHeight = {};

  if(headers.length) {
    headers = headers.slice(0, -1)
  }
  if(tableData.value && tableData.value.length) {
    tableData.value.forEach((item, index) => {
      if(index == 0) return;
      if(index == 1) return rowHeight[5] = 140;
      rowHeight[index+4] = 40;
    });
  }
  
  const config = {
    headers,
    data: pinnedTopRowData.value.concat(tableData.value),
    headerDeep:3,
    fileName: '遥测站点信息',
    rowHeight: rowHeight
  }
  let custom_obj = config.data.find(item => item.index == "注");
  config.custom = [
    { 'merged':{'s':[5,4],'e':[5,5]}, 'value': custom_obj.ycmc },
    { 'merged':{'s':[5,10],'e':[5,11]}, 'value': custom_obj.ylsccj },
    { 'merged':{'s':[5,15],'e':[5,22]}, 'value': custom_obj.swonecj },
    { 'merged':{'s':[5,23],'e':[5,26]}, 'value': custom_obj.zgsw },
    { 'merged':{'s':[5,27],'e':[5,30]}, 'value': custom_obj.sqcj },
    { 'merged':{'s':[5,31],'e':[5,34]}, 'value': custom_obj.rtucj },
    { 'merged':{'s':[5,35],'e':[5,37]}, 'value': custom_obj.duanbo },
    { 'merged':{'s':[5,44],'e':[5,45]}, 'value': custom_obj.bdtwo },
    { 'merged':{'s':[5,46],'e':[5,48]}, 'value': custom_obj.bdcj },
    { 'merged':{'s':[5,49],'e':[5,51]}, 'value': custom_obj.wxtm },
    { 'merged':{'s':[5,52],'e':[5,55]}, 'value': custom_obj.txdmc },
    { 'merged':{'s':[5,56],'e':[5,57]}, 'value': custom_obj.sd },
    { 'merged':{'s':[5,64],'e':[5,65]}, 'value': custom_obj.jdfl },
    { 'merged':{'s':[5,68],'e':[5,70]}, 'value': custom_obj.xmmc },
    { 'merged':{'s':[5,71],'e':[5,72]}, 'value': custom_obj.sjmc },
    { 'merged':{'s':[5,77],'e':[5,78]}, 'value': custom_obj.swjone },
    { 'merged':{'s':[5,83],'e':[5,87]}, 'value': custom_obj.tbtm },
  ];
  
  // http://60.174.203.118:5233/export // 公司
  // http://10.34.1.25:5233/export // 省局
  axios.post('http://60.174.203.118:5233/export', config).then(res => {
    if (res.data.code === 0) {
      const a = document.createElement('a')
      a.href = res.data.data;
      a.click();
    } else {
      toast.add({ severity: 'error', summary: '导出失败，请重试', detail: '', group: 'tc', life: 3000 });
    }
  }).catch(err => {
    toast.add({ severity: 'error', summary: '导出失败，请重试', detail: '', group: 'tc', life: 3000 });
    console.log(err);
  })
}

// 保存修改
const handleSubmit = () => {
  isSubmiting.value = true;

  let formData = JSON.parse(JSON.stringify(addForm.value));
  formData.yltm = (formData.yltm && formData.yltm != '无') ? dayjs(formData.yltm).format("YYYYMMDD") : formData.yltm;
  formData.swonetm = (formData.swonetm && formData.swonetm != '无') ? dayjs(formData.swonetm).format("YYYYMMDD") : formData.swonetm;
  formData.swtwotm = (formData.swtwotm && formData.swtwotm != '无') ? dayjs(formData.swtwotm).format("YYYYMMDD") : formData.swtwotm;
  formData.sqtm = (formData.sqtm && formData.sqtm != '无') ? dayjs(formData.sqtm).format("YYYYMMDD") : formData.sqtm;
  formData.rtutm = (formData.rtutm && formData.rtutm != '无') ? dayjs(formData.rtutm).format("YYYYMMDD") : formData.rtutm;
  formData.bdtm = (formData.bdtm && formData.bdtm != '无') ? dayjs(formData.bdtm).format("YYYYMMDD") : formData.bdtm;
  formData.wxtm = (formData.wxtm && formData.wxtm != '无') ? dayjs(formData.wxtm).format("YYYYMMDD") : formData.wxtm;
  formData.dctm = (formData.dctm && formData.dctm != '无') ? dayjs(formData.dctm).format("YYYYMMDD") : formData.dctm;
  formData.mztm = (formData.mztm && formData.mztm != '无') ? dayjs(formData.mztm).format("YYYYMMDD") : formData.mztm;
  formData.sjtm = (formData.sjtm && formData.sjtm != '无') ? dayjs(formData.sjtm).format("YYYYMMDD") : formData.sjtm;
  formData.yctm = (formData.yctm && formData.yctm != '无') ? dayjs(formData.yctm).format("YYYYMMDD") : formData.yctm;
  formData.tbtm = (formData.tbtm && formData.tbtm != '无') ? dayjs(formData.tbtm).format("YYYYMMDD") : formData.tbtm;
  formData.yltm = (formData.yltm && formData.yltm != '无') ? dayjs(formData.yltm).format("YYYYMMDD") : formData.yltm;

  if(formData.id) {
    formData.operation = 'U';
    formData.tailid = formData.id;
  } else {
    formData.operation = 'I';
  }
  
  // 提交审核
  axios.post("http://10.34.1.25:8010/cj/shebei/insertSheBeiReview", formData).then(res => {
    isSubmiting.value = false;
    if(res.data.code === 0) {
      dialogVisible.value = false;
      toast.add({ severity:'success', summary: '数据添加审核中，等待审核', detail: '', group: 'cg', life: 3000 });
    } else {
      toast.add({ severity:'error', summary: res.data.msg, detail: '', group: 'tc', life: 3000 });
    }
  }).catch(err => {
    isSubmiting.value = false;
    toast.add({ severity: 'error', summary: '网络错误', detail: '', group: 'tc', life: 3000 });
    console.log(err);
  });
}

// 初始化
const onGridReady = (params) => {
  gridApi = params.api
  gridApi.sizeColumnsToFit();
};

// 初始化
const onGridReady_check = (params) => {
  gridApi_check = params.api
  gridApi_check.sizeColumnsToFit();
}

// 添加表头
function addDataToNestedArray(arr) {
  arr.forEach(item => {
    if (Array.isArray(item.children)) {
      addDataToNestedArray(item.children);
    }
    item.title = item.headerName;
    item.styles = {bold:true,borderColor:'000000',borderStyle:'thin'};
    if(item.field == 'check') item.width = 120;
    else if(item.field == 'xmmc' || item.field == 'sjmc') item.width = 35;
    else item.width = 25;
  });

  return arr
}

// 时间组件输入 “无” 时，保留为 “无”
function handleInput(event, key) {
  const value = event.target.value.trim();
 
  if (value === '无') {
    // addForm.value.yltm = '无'
    switch(key) {
      case 'yltm':
        addForm.value.yltm = '无';
        break;
      case 'swonetm':
        addForm.value.swonetm = '无';
        break;
      case 'swtwotm':
        addForm.value.swtwotm = '无';
        break;
      case 'sqtm':
        addForm.value.sqtm = '无';
        break;
      case'rtutm':
        addForm.value.rtutm = '无';
        break;
      case'bdtm':
        addForm.value.bdtm = '无';
        break;
      case'wxtm':
        addForm.value.wxtm = '无';
        break;
      case'dctm':
        addForm.value.dctm = '无';
        break;
      case'mztm':
        addForm.value.mztm = '无';
        break;
      case'sjtm':
        addForm.value.sjtm = '无';
        break;
      case'yctm':
        addForm.value.yctm = '无';
        break;
      case'tbtm':
        addForm.value.tbtm = '无';
        break;
    }
  }
}

</script>

<style>
.ag-cell {
  text-align: center;
  white-space: normal !important;  /* 允许文本换行 */
  word-wrap: break-word;           /* 自动换行 */
}
.text-red {
  color: red;
}
.bg-red {
  background-color: #3b82f682;
}
.dialogForm .t2 {
  font-weight: 400;
}

.w285 {
  width: 285px;
}
</style>
