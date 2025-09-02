import request from '@/utils/request'

export default {
  getReminderList(searchModel) {
    return request({
      url: '/reminder/list',
      method: 'get',
      params: {
        pageNo: searchModel.pageNo,
        pageSize: searchModel.pageSize,
        keyword: searchModel.keyword,
        type: searchModel.type,
        priority: searchModel.priority,
        isRead: searchModel.isRead
      }
    });
  },
  
  getUnreadCount() {
    return request({
      url: '/reminder/unreadCount',
      method: 'get'
    });
  },
  
  addReminder(reminder) {
    return request({
      url: '/reminder/add',
      method: 'post',
      data: reminder
    });
  },
  
  updateReminder(reminder) {
    return request({
      url: '/reminder/update',
      method: 'put',
      data: reminder
    });
  },
  
  markAsRead(id) {
    return request({
      url: `/reminder/markAsRead/${id}`,
      method: 'put'
    });
  },
  
  deleteReminder(id) {
    return request({
      url: `/reminder/${id}`,
      method: 'delete'
    });
  },
  
  markAllAsRead() {
    return request({
      url: '/reminder/markAllAsRead',
      method: 'put'
    });
  }
} 