import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';

// 配置dayjs
dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

/**
 * 格式化时间为相对时间
 * @param date 日期字符串或Date对象
 * @returns 相对时间字符串，如"几分钟前"、"几小时前"、"几天前"
 */
export const formatRelativeTime = (date: string | Date | null | undefined): string => {
  if (!date) return '从未连接';
  
  try {
    const dayjsDate = dayjs(date);
    if (!dayjsDate.isValid()) return '无效时间';
    
    return dayjsDate.fromNow();
  } catch (error) {
    console.error('时间格式化错误:', error);
    return '时间错误';
  }
};

/**
 * 格式化时间为详细时间
 * @param date 日期字符串或Date对象
 * @returns 详细时间字符串，如"2024年1月15日 14:30"
 */
export const formatDetailedTime = (date: string | Date | null | undefined): string => {
  if (!date) return '从未连接';
  
  try {
    const dayjsDate = dayjs(date);
    if (!dayjsDate.isValid()) return '无效时间';
    
    return dayjsDate.format('YYYY年MM月DD日 HH:mm');
  } catch (error) {
    console.error('时间格式化错误:', error);
    return '时间错误';
  }
};

/**
 * 格式化创建时间
 * @param date 日期字符串或Date对象
 * @returns 创建时间字符串
 */
export const formatCreatedTime = (date: string | Date | null | undefined): string => {
  if (!date) return '未知';
  
  try {
    const dayjsDate = dayjs(date);
    if (!dayjsDate.isValid()) return '无效时间';
    
    return dayjsDate.format('YYYY-MM-DD HH:mm');
  } catch (error) {
    console.error('时间格式化错误:', error);
    return '时间错误';
  }
};

/**
 * 检查时间是否在指定范围内
 * @param date 日期字符串或Date对象
 * @param minutes 分钟数
 * @returns 是否在指定时间内
 */
export const isWithinMinutes = (date: string | Date | null | undefined, minutes: number): boolean => {
  if (!date) return false;
  
  try {
    const dayjsDate = dayjs(date);
    if (!dayjsDate.isValid()) return false;
    
    const now = dayjs();
    return now.diff(dayjsDate, 'minute') <= minutes;
  } catch (error) {
    console.error('时间比较错误:', error);
    return false;
  }
}; 