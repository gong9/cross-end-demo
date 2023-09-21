export const download = (dataString, name) => {
  const url = `data:,${dataString}`
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.click()
}
