<template>
  <div class="page">
    <Toast position="top-center"></Toast>
    <div class="page-head">
      <div flex-y-center>
        <div class="point-title">
          <span class="point"></span>
          <span class="point-label">淮委3h雨量数值预报</span>
        </div>
      </div>
      <div>
        <span>预报日期：</span>
        <DatePicker v-model="selectedDate" dateFormat="yy-mm-dd" w-110px />
        <Select v-model="selectedStartTime" :options="hourArr" w-70px m-x-5px />
        <span>预见期 (小时)：</span>
        <Select v-model="selectedRainHour" :options="rainHourOptions" w-70px m-x-5px />

        <Button label="查询预报" size="small" :loading="isLoading" @click="fetchRainForecast" style="padding: 5px 25px;" />
        <Button v-if="imageUrl" label="下载图片" size="small" severity="success" @click="downloadImage" style="padding: 5px 25px;" ml-10px />
      </div>
    </div>

    <div class="page-main b-#ccc" b-1 b-dashed relative>
      <ProgressSpinner v-if="isLoading" />
      <Image v-else-if="imageUrl" :src="imageUrl" alt="雨量预报图" class="responsive-image"/>

      <i class="pi pi-angle pi-angle-left top-50% translate-y-[-50%] left-220px" absolute @click="prevHour"></i>
      <i class="pi pi-angle pi-angle-right top-50% translate-y-[-50%] right-220px" absolute @click="nextHour"></i>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import { get3hRainForecast } from '@/api/url';

const toast = useToast();

const hourArr = ['02', '05', '08', '11', '14', '17', '20', '23'];
const rainHourOptions = [3, 6, 12, 24, 48, 72];

const selectedDate = ref(new Date());
const selectedStartTime = ref('08');
const selectedRainHour = ref(24);

const isLoading = ref(false);
const imageUrl = ref('');
const forecastInfo = ref({});

const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
};

const fetchRainForecast = async () => {
  if (!selectedDate.value || !selectedStartTime.value || !selectedRainHour.value) {
    toast.add({ severity: 'warn', summary: '提示', detail: '请完整填写查询条件', life: 3000 });
    return;
  }

  const dateStr = formatDate(selectedDate.value);
  const startTime = `${dateStr}${selectedStartTime.value}`;
  isLoading.value = true;
  imageUrl.value = '';

  try {
    const response = await get3hRainForecast({time: startTime, hour: selectedRainHour.value});
    const resData = response.data;

    if (resData && response.code === 0) {
      imageUrl.value = resData.dataUrl; 
      forecastInfo.value = {
        startTime: resData.startTime,
        endTime: resData.endTime,
        queryTime: resData.queryTime,
        source: resData.source
      };
      
      toast.add({ severity: 'success', summary: '查询成功', detail: '图片已更新', life: 3000 });
    } else {
      toast.add({ severity: 'error', summary: '查询失败', detail: resData.msg || '未知错误', life: 5000 });
    }
  } catch (error) {
    console.error('获取预报图片失败:', error);
    toast.add({ severity: 'error', summary: '网络错误', detail: '无法连接到预报服务接口', life: 5000 });
  } finally {
    isLoading.value = false;
  }
};

const prevHour = () => {
  let time = dayjs(selectedDate.value).format('YYYY-MM-DD') + ` ${selectedStartTime.value}:00`;
  time = dayjs(time).subtract(selectedRainHour.value, 'hour').format('YYYY-MM-DD HH:mm');

  selectedDate.value = dayjs(time).format('YYYY-MM-DD');
  selectedStartTime.value = dayjs(time).format('HH');
  fetchRainForecast();
}

const nextHour = () => {
  let time = dayjs(selectedDate.value).format('YYYY-MM-DD')+ ` ${selectedStartTime.value}:00`;
  time = dayjs(time).add(selectedRainHour.value, 'hour').format('YYYY-MM-DD HH:mm');

  selectedDate.value = dayjs(time).format('YYYY-MM-DD');
  selectedStartTime.value = dayjs(time).format('HH');
  fetchRainForecast();
}

const downloadImage = () => {
  if (!imageUrl.value) return;
  const dateStr = formatDate(selectedDate.value);
  const fileName = `淮委雨量预报_${dateStr}${selectedStartTime.value}_${selectedRainHour.value}h.png`; 

  // 创建隐藏的 a 标签触发下载
  const link = document.createElement('a');
  link.href = imageUrl.value;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

onMounted(() => {
  fetchRainForecast();
})
</script>

<style scoped>
.responsive-image {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.responsive-image :deep(img) {
  height: calc(100% - 0px);
}

/* 点击箭头切换图片 */
.pi-angle {
  cursor: pointer;
  border: 1px solid #ccc;
  border-radius: 50%;
  padding: 5px;
  background-color: #f5f5f5;
  text-align: center;
  font-size: 2rem;
  color: #ccc;
}
.pi-angle:hover {
  color: #000 !important;
  border: 1px solid #000;
}
</style>