document.addEventListener('DOMContentLoaded', function() {
  // 獲取 DOM 元素
  const wktForm = document.getElementById('wkt-form');
  const coordinatesInput = document.getElementById('coordinates');
  const formatToggle = document.getElementById('format-toggle');
  const formatDesc = document.getElementById('format-desc');
  const formatHelp = document.getElementById('format-help');
  const resultText = document.getElementById('result-text');
  const errorMessage = document.getElementById('error-message');
  const clearBtn = document.getElementById('clear-btn');
  const copyBtn = document.getElementById('copy-btn');
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const currentYearElement = document.getElementById('current-year');
  
  // 設定當前年份
  currentYearElement.textContent = new Date().getFullYear();
  
  // 檢查並設定主題
  function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-theme');
    }
  }
  
  // 切換主題
  function toggleTheme() {
    if (document.body.classList.contains('dark-theme')) {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    } else {
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    }
  }
  
  // 更新座標格式描述
  function updateFormatDescription() {
    const isLatLong = formatToggle.checked;
    
    if (isLatLong) {
      formatDesc.textContent = '目前：緯度,經度（Google Maps 格式）';
      formatHelp.textContent = '支援多種格式：緯度 經度（例如：25.037571 121.557846）或緯度,經度（例如：25.037571,121.557846）';
    } else {
      formatDesc.textContent = '目前：經度,緯度（國土測繪格式）';
      formatHelp.textContent = '支援多種格式：經度 緯度（例如：121.557846 25.037571）或經度,緯度（例如：121.557846,25.037571）';
    }
  }
  
  // 清除所有內容
  function clearAll() {
    coordinatesInput.value = '';
    resultText.textContent = '';
    errorMessage.textContent = '';
  }
  
  // 複製結果到剪貼簿
  function copyResult() {
    if (!resultText.textContent) return;
    
    navigator.clipboard.writeText(resultText.textContent)
      .then(() => {
        // 顯示複製成功提示
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i>';
        
        setTimeout(() => {
          copyBtn.innerHTML = originalText;
        }, 2000);
      })
      .catch(err => {
        console.error('複製失敗:', err);
      });
  }
  
  // 處理表單提交
  function handleSubmit(e) {
    e.preventDefault();
    
    // 清除先前的結果和錯誤
    resultText.textContent = '';
    errorMessage.textContent = '';
    
    // 獲取輸入值
    const coordinates = coordinatesInput.value.trim();
    if (!coordinates) {
      errorMessage.textContent = '請輸入座標';
      return;
    }
    
    // 獲取轉換模式
    const modeRadios = document.getElementsByName('conversionMode');
    let selectedMode;
    
    for (const radio of modeRadios) {
      if (radio.checked) {
        selectedMode = radio.value;
        break;
      }
    }
    
    // 獲取座標格式
    const format = formatToggle.checked ? 'LAT_LONG' : 'LONG_LAT';
    
    // 執行轉換
    try {
      const result = convertToWkt(coordinates, selectedMode, format);
      resultText.textContent = result;
    } catch (error) {
      errorMessage.textContent = error.message;
    }
  }
  
  // 初始化
  initTheme();
  updateFormatDescription();
  
  // 事件監聽器
  wktForm.addEventListener('submit', handleSubmit);
  formatToggle.addEventListener('change', updateFormatDescription);
  clearBtn.addEventListener('click', clearAll);
  copyBtn.addEventListener('click', copyResult);
  themeToggleBtn.addEventListener('click', toggleTheme);
});
