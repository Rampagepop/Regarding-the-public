const fs = require('fs')
function deleFile(path, parentPath) {
  if (fs.statSync(path).isDirectory()) {
    let files = fs.readdirSync(path)
    files.forEach((file, index) => {
      let currentPath = path + "/" + file
      if (fs.statSync(currentPath).isDirectory()) {
        //如果条件为真 说明 currentPath是一个目录
        deleFile(currentPath, path)
      } else {
        //currentPath说明是一个文件
        fs.unlinkSync(currentPath)
      }
    })
    if (path != parentPath) {
      fs.rmdirSync(path)
    }
  } else {
    fs.unlinkSync(path)
  }
}
deleFile('./node_modules/.cache/hard-source')