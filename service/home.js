module.exports = {
  register: async(name, pws) => {
    let data
    if (name === 'zcr' && pws === '12345') {
      data = `Hello, ${name}`
    } else {
      data = '账号错误'
    }
    return data
  }
}