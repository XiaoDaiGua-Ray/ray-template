import request from '../request'

export const useAxiosTest = (file: File) => {
  const formData = new FormData()
  formData.append('file', file!.slice())

  return request({
    method: 'post',
    url: 'https://api.freezonecoin.com/identity/images/v1/upload',
    data: formData,
  })
}
