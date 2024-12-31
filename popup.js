// 常量定义
const WORK_START_HOUR = 10;
const WORK_END_HOUR = 19;
const WORKING_DAYS_PER_MONTH = 21.75;
const WORK_HOURS_PER_DAY = WORK_END_HOUR - WORK_START_HOUR;

// 更新当前时间
function updateCurrentTime() {
    const now = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    document.getElementById('current-time').textContent = now.toLocaleDateString('zh-CN', options);
}

// 计算距离周末的天数
function updateWeekendCountdown() {
    const now = new Date();
    const currentDay = now.getDay(); // 0是周日，6是周六
    const daysUntilWeekend = currentDay === 0 || currentDay === 6 ? 0 : 6 - currentDay;
    const message = daysUntilWeekend === 0 ? 
        "今天是周末！放假愉快！" : 
        `距离放假还有 ${daysUntilWeekend} 天`;
    document.getElementById('weekend-countdown').textContent = message;
}

// 计算工作进度和今日收入
function updateWorkProgress() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    // 如果不在工作时间内
    if (currentHour < WORK_START_HOUR || currentHour >= WORK_END_HOUR) {
        document.getElementById('work-progress').style.width = '0%';
        document.getElementById('progress-text').textContent = '0%';
        document.getElementById('earned-today').textContent = '当前不在工作时间内';
        return;
    }

    // 计算工作进度
    const totalMinutes = WORK_HOURS_PER_DAY * 60;
    const workedMinutes = (currentHour - WORK_START_HOUR) * 60 + currentMinute;
    const progress = (workedMinutes / totalMinutes) * 100;
    const progressFormatted = progress.toFixed(1);
    
    document.getElementById('work-progress').style.width = `${progressFormatted}%`;
    document.getElementById('progress-text').textContent = `${progressFormatted}%`;

    // 计算今日收入
    const salary = document.getElementById('salary').value;
    if (salary) {
        const dailySalary = salary / WORKING_DAYS_PER_MONTH;
        const earned = (dailySalary * progress / 100).toFixed(2);
        document.getElementById('earned-today').textContent = `今日已赚: ¥${earned}`;
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    // 从存储中获取上次输入的工资
    chrome.storage.local.get(['salary'], (result) => {
        if (result.salary) {
            document.getElementById('salary').value = result.salary;
        }
    });

    // 监听工资输入变化
    document.getElementById('salary').addEventListener('input', (e) => {
        chrome.storage.local.set({ salary: e.target.value });
        updateWorkProgress();
    });

    // 初始更新所有信息
    updateCurrentTime();
    updateWeekendCountdown();
    updateWorkProgress();

    // 每秒更新一次
    setInterval(() => {
        updateCurrentTime();
        updateWeekendCountdown();
        updateWorkProgress();
    }, 1000);
});