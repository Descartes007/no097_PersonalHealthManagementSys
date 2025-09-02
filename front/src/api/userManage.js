import request from '@/utils/request'

export default{
  getUserList(searchModel){
    return request({
      //路径
      url: '/user/list',
      method: 'get',
      //数据
      params:{
        pageNo:searchModel.pageNo,
        pageSize:searchModel.pageSize,
        username:searchModel.username,
        phone:searchModel.phone
      }
    });
  },

  addUser(user) {
    return request({
      url: '/user/add',
      method: 'post',
      data: user
    }).catch(error => {
      console.log(error.response.data);
      throw error;
    });
  },
  
  getUserById(id){
    return request({
      url: `/user/${id}`,
      method: 'get',
    });
  },

  saveUser(user){
    if(user.id == null && user.id == undefined){
      return this.addUser(user);
    }
    return this.updateUser(user);
  },


  updateUser(user){
    return request({
      url: '/user/update',
      method: 'put',
      data: user
    });
  },

  
  deleteUserById(id){
    return request({
      url: `/user/${id}`,
      method: 'delete'
    });
  },

  register(registerData){
    return request({
      url: '/user/register',
      method: 'post',
      data: registerData
    });
  },

  getUserId(){
    return request({
      url: `/user/getUserId`,
      method: 'get',
    });
  },

  getBodyInfo(){
    return request({
      url: `/user/getBodyInfo`,
      method: 'get',
    });
  },

  getBodyList(searchModel){
    return request({
      //路径
      url: '/user/getBodyList',
      method: 'get',
      //数据
      params:{
        id:searchModel.id,
        pageNo:searchModel.pageNo,
        pageSize:searchModel.pageSize,
        name:searchModel.name,
      }
    });
  },




  





  getBodyById(id){
    return request({
      url: `/user/getBodyById/${id}`,
      method: 'get',
    });
  },

  

  updateBody(body){
    return request({
      url: '/user/updateBody',
      method: 'put',
      data: body
    });
  },

  deleteBodyById(id){
    return request({
      url: `/user/deleteBodyById/${id}`,
      method: 'delete'
    });
  },



  changePassword(user){
    return request({
      url: '/user/changePassword',
      method: 'put',
      data: user
    });
  },











//用户管理自己的身体信息
  getUserBodyList(searchModel){
    return request({
      //路径
      url: '/user/getUserBodyList',
      method: 'get',
      //数据
      params:{
        id:searchModel.id,
        pageNo:searchModel.pageNo,
        pageSize:searchModel.pageSize,
        name:searchModel.name,
      }
    });
  },


  getUserBodyById(notesid){
    return request({
      url: `/user/getUserBodyById/${notesid}`,
      method: 'get',
    });
  },

  

  updateUserBody(body){
    return request({
      url: '/user/updateUserBody',
      method: 'put',
      data: body
    });
  },


  deleteUserBodyById(id){
    return request({
      url: `/user/deleteUserBodyById/${id}`,
      method: 'delete'
    });
  },




}
