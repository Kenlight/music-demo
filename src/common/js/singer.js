export class Singer {
  constructor(id, name) {
    this.id = id
    this.name = name
    this.avatar = `https://y.gtimg.cn/music/photo_new/T001R300x300M000${this.id}.jpg?max_age=2592000`
  }
}
export function getData(el, name, val) {
  const str = 'data-'
  if (val) {
    return el.setAttribute(str + name, val)
  }
  return el.getAttribute(str + name)
}
