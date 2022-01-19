import { request } from '@/plugins/request'

export const register = data => {
 return request({
    method: 'POST',
    url: '/api/users',
    data
  })
}
export const login = data => {
  return request({
     method: 'POST',
     url: '/api/users/login',
     data
   })
 }