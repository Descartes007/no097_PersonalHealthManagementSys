import request from '@/utils/request'

export default{
  BodyInformation(data){
        return request({
          url: '/user/BodyInformation',
          method: 'post',
          data: data
        });
      },

      BodyInformationNotes(data){
        return request({
          url: '/user/BodyInformationNotes',
          method: 'post',
          data: data
        });
      },

      getAllSportInfo(){
        return request({
          url: `/sport/getAllSportInfo`,
          method: 'get',
        });
      },


      DetailInfo(sportName) {
        return request({
          url: `/detail/DetailInfo/${sportName}`,
          method: 'get',
        });
      },
      

      getSportList(searchModel){
        return request({
          //路径
          url: '/sport/getSportList',
          method: 'get',
          //数据
          params:{
            pageNo:searchModel.pageNo,
            pageSize:searchModel.pageSize,
            sportType:searchModel.sportType,
          }
        });
      },


      saveSport(sport){
        if(sport.id == null && sport.id == undefined){
          return this.addSport(sport);
        }
        return this.updateSport(sport);
      },



      addSport(sport) {
        return request({
          url: '/sport/add',
          method: 'post',
          data: sport
        }).catch(error => {
          console.log(error.response.data);
          throw error;
        });
      },

      updateSport(sport){
        return request({
          url: '/sport/update',
          method: 'put',
          data: sport
        });
      },
      

      getSportById(id){
        return request({
          url: `/sport/${id}`,
          method: 'get',
        });
      },


      deleteSportById(id){
        return request({
          url: `/sport/${id}`,
          method: 'delete'
        });
      },



      getBodyNotes(id){
        return request({
          url: `/user/getBodyNotes/${id}`,
          method: 'get',
        });
      },
      






      getDetailList(searchModel){
        return request({
          //路径
          url: '/detail/getDetailList',
          method: 'get',
          //数据
          params:{
            pageNo:searchModel.pageNo,
            pageSize:searchModel.pageSize,
            sportType:searchModel.sportType,
          }
        });
      },


      saveDetail(sport){
        if(sport.id == null && sport.id == undefined){
          return this.addDetail(sport);
        }
        return this.updateDetail(sport);
      },



      addDetail(sport) {
        return request({
          url: '/detail/addDetail',
          method: 'post',
          data: sport
        }).catch(error => {
          console.log(error.response.data);
          throw error;
        });
      },

      updateDetail(sport){
        return request({
          url: '/detail/updateDetail',
          method: 'put',
          data: sport
        });
      },
      

      getDetailById(id){
        return request({
          url: `/detail/getDetailById/${id}`,
          method: 'get',
        });
      },


      deleteDetailById(id){
        return request({
          url: `/detail/deleteDetailById/${id}`,
          method: 'delete'
        });
      },
      
      // 心理健康检测API
      saveMentalHealthTest(data) {
        return request({
          url: '/mentalHealth/save',
          method: 'post',
          data: data
        });
      },

      getLatestMentalHealthTest(userId) {
        return request({
          url: `/mentalHealth/latest/${userId}`,
          method: 'get',
        });
      },

      getMentalHealthHistory(userId) {
        return request({
          url: `/mentalHealth/history/${userId}`,
          method: 'get',
        });
      }
}